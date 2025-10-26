import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import crypto from "crypto"
import { db } from "./db"

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: "2mb" }))

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Run migrations at startup
import fs from "fs"
import path from "path"
const migrations = fs.readFileSync(path.join(process.cwd(), "server", "migrations.sql"), "utf8")
try {
  db.exec(migrations)
} catch (e: any) {
  console.warn('[server] Migrations already applied or partially applied:', e.message)
}

// Routes
app.post("/register-family", (req, res) => {
  try {
    const b = req.body || {}
    const required = [
      "head_name",
      "head_age",
      "head_gender",
      "head_mobile",
      "head_aadhaar_number",
      "ration_card_number",
      "ration_card_type",
      "address",
      "family_members",
    ]
    for (const k of required) if (!b[k]) return res.status(400).json({ success: false, error: `Missing ${k}` })

    const tx = db.transaction(() => {
      const famStmt = db.prepare(
        `INSERT INTO families (head_name, head_age, head_gender, head_mobile, head_aadhaar_number, ration_card_number, ration_card_type, address, family_members)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      famStmt.run(
        b.head_name,
        Number(b.head_age),
        b.head_gender,
        String(b.head_mobile),
        String(b.head_aadhaar_number),
        String(b.ration_card_number),
        String(b.ration_card_type),
        b.address,
        Number(b.family_members)
      )
      const familyId = db.prepare("SELECT last_insert_rowid() as id").get().id as number

      const headMember = db.prepare(
        `INSERT INTO family_members (family_id, name, age, gender, aadhaar_number, status, relation_to_head) VALUES (?, ?, ?, ?, ?, 'Active', 'Head')`
      )
      headMember.run(
        familyId,
        b.head_name,
        Number(b.head_age),
        b.head_gender,
        String(b.head_aadhaar_number)
      )
      return familyId
    })

    const family_id = tx()
    // Dev OTP to confirm registration
    const otp = generateOTP()
    const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    db.prepare(`INSERT INTO otps (mobile_number, otp_code, expires_at) VALUES (?, ?, ?)`)
      .run(String(b.head_mobile), otp, expires)

    console.log(`[server] Registration OTP for ${b.head_mobile}: ${otp}`)
    res.json({ success: true, family_id, otp_dev: process.env.NODE_ENV !== "production" ? otp : undefined })
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message })
  }
})

app.post("/login", (req, res) => {
  try {
    const { identifier } = req.body || {}
    if (!identifier) return res.status(400).json({ success: false, error: "Missing identifier" })

    // Aadhaar or mobile
    const isAadhaar = /^\d{12}$/.test(String(identifier))

    let mobile: string | null = null
    if (isAadhaar) {
      // Find member → family → head mobile
      const member = db.prepare(`SELECT family_id FROM family_members WHERE aadhaar_number = ?`).get(String(identifier))
      if (member) {
        const fam = db.prepare(`SELECT head_mobile FROM families WHERE family_id = ?`).get(member.family_id)
        if (fam) mobile = fam.head_mobile
      }
      if (!mobile) {
        const fam = db.prepare(`SELECT head_mobile FROM families WHERE head_aadhaar_number = ?`).get(String(identifier))
        if (fam) mobile = fam.head_mobile
      }
      if (!mobile) return res.status(404).json({ success: false, error: "Aadhaar not registered" })
    } else {
      const fam = db.prepare(`SELECT head_mobile FROM families WHERE head_mobile = ?`).get(String(identifier))
      if (!fam) return res.status(404).json({ success: false, error: "Mobile not registered" })
      mobile = fam.head_mobile
    }

    const otp = generateOTP()
    const expires = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    db.prepare(`INSERT INTO otps (mobile_number, otp_code, expires_at) VALUES (?, ?, ?)`)
      .run(String(mobile), otp, expires)
    console.log(`[server] Login OTP for ${mobile}: ${otp}`)
    res.json({ success: true, mobile, otp_dev: process.env.NODE_ENV !== "production" ? otp : undefined })
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message })
  }
})

app.post("/verify-otp", (req, res) => {
  try {
    const { identifier, otp } = req.body || {}
    if (!identifier || !otp) return res.status(400).json({ success: false, error: "Missing identifier or otp" })

    const isAadhaar = /^\d{12}$/.test(String(identifier))
    let mobile: string | null = null
    if (isAadhaar) {
      const member = db.prepare(`SELECT family_id FROM family_members WHERE aadhaar_number = ?`).get(String(identifier))
      if (member) {
        const fam = db.prepare(`SELECT head_mobile FROM families WHERE family_id = ?`).get(member.family_id)
        if (fam) mobile = fam.head_mobile
      }
      if (!mobile) {
        const fam = db.prepare(`SELECT head_mobile FROM families WHERE head_aadhaar_number = ?`).get(String(identifier))
        if (fam) mobile = fam.head_mobile
      }
    } else {
      mobile = String(identifier)
    }
    if (!mobile) return res.status(404).json({ success: false, error: "User not found" })

    const row = db.prepare(`SELECT otp_id, expires_at FROM otps WHERE mobile_number = ? AND otp_code = ? ORDER BY created_at DESC LIMIT 1`).get(mobile, String(otp))
    if (!row) return res.status(400).json({ success: false, error: "Invalid OTP" })
    if (new Date(row.expires_at).getTime() < Date.now()) return res.status(400).json({ success: false, error: "OTP expired" })

    // Cleanup used OTP
    db.prepare(`DELETE FROM otps WHERE otp_id = ?`).run(row.otp_id)

    // Return family + members
    const fam = db.prepare(`SELECT * FROM families WHERE head_mobile = ?`).get(mobile)
    const members = db.prepare(`SELECT * FROM family_members WHERE family_id = ?`).all(fam.family_id)
    res.json({ success: true, family: fam, members })
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message })
  }
})

app.get("/families/:id", (req, res) => {
  try {
    const id = Number(req.params.id)
    const fam = db.prepare(`SELECT * FROM families WHERE family_id = ?`).get(id)
    if (!fam) return res.status(404).json({ success: false, error: "Family not found" })
    const members = db.prepare(`SELECT * FROM family_members WHERE family_id = ?`).all(id)
    res.json({ success: true, family: fam, members })
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message })
  }
})

app.post("/admin/upload-csv", (req, res) => {
  try {
    const { families, family_members } = req.body || {}
    if (!Array.isArray(families) || !Array.isArray(family_members)) return res.status(400).json({ success: false, error: "Provide families and family_members arrays" })

    const tx = db.transaction(() => {
      let importedFamilies = 0
      let importedMembers = 0

      const upsertFamily = db.prepare(
        `INSERT INTO families (family_id, head_name, head_age, head_gender, head_mobile, head_aadhaar_number, ration_card_number, ration_card_type, address, family_members)
         VALUES (@family_id, @head_name, @head_age, @head_gender, @head_mobile, @head_aadhaar_number, @ration_card_number, @ration_card_type, @address, @family_members)
         ON CONFLICT(family_id) DO UPDATE SET
           head_name=excluded.head_name, head_age=excluded.head_age, head_gender=excluded.head_gender,
           head_mobile=excluded.head_mobile, head_aadhaar_number=excluded.head_aadhaar_number,
           ration_card_number=excluded.ration_card_number, ration_card_type=excluded.ration_card_type,
           address=excluded.address, family_members=excluded.family_members`
      )

      const upsertMember = db.prepare(
        `INSERT INTO family_members (member_id, family_id, name, age, gender, aadhaar_number, status, relation_to_head)
         VALUES (@member_id, @family_id, @name, @age, @gender, @aadhaar_number, @status, @relation_to_head)
         ON CONFLICT(member_id) DO UPDATE SET
           family_id=excluded.family_id, name=excluded.name, age=excluded.age, gender=excluded.gender,
           aadhaar_number=excluded.aadhaar_number, status=excluded.status, relation_to_head=excluded.relation_to_head`
      )

      for (const f of families) {
        upsertFamily.run({
          family_id: Number(f.family_id),
          head_name: f.head_name,
          head_age: Number(f.head_age) || null,
          head_gender: f.head_gender,
          head_mobile: String(f.head_mobile),
          head_aadhaar_number: String(f.head_aadhaar_number),
          ration_card_number: String(f.ration_card_number),
          ration_card_type: String(f.ration_card_type),
          address: f.address,
          family_members: Number(f.family_members) || 1,
        })
        importedFamilies++
      }

      for (const m of family_members) {
        // ensure family exists
        const fam = db.prepare(`SELECT family_id FROM families WHERE family_id = ?`).get(Number(m.family_id))
        if (!fam) continue
        upsertMember.run({
          member_id: Number(m.member_id),
          family_id: Number(m.family_id),
          name: m.name,
          age: Number(m.age) || null,
          gender: m.gender,
          aadhaar_number: String(m.aadhaar_number),
          status: m.status || "Active",
          relation_to_head: m.relation_to_head || "",
        })
        importedMembers++
      }

      return { importedFamilies, importedMembers }
    })

    const report = tx()
    res.json({ success: true, report })
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message })
  }
})

// Shops list
app.get("/shops", (req, res) => {
  try {
    const shops = db.prepare(`SELECT * FROM shops`).all()
    res.json({ success: true, shops })
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message })
  }
})

// Assign preferred shop to a member
app.post("/members/:id/assign-shop", (req, res) => {
  try {
    const id = Number(req.params.id)
    const { fps_id } = req.body || {}
    if (!fps_id) return res.status(400).json({ success: false, error: "Missing fps_id" })
    const member = db.prepare(`SELECT member_id FROM family_members WHERE member_id = ?`).get(id)
    if (!member) return res.status(404).json({ success: false, error: "Member not found" })
    db.prepare(`UPDATE family_members SET preferred_fps_id = ? WHERE member_id = ?`).run(String(fps_id), id)
    res.json({ success: true })
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message })
  }
})

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`[server] Express running on http://localhost:${port}`)
})


