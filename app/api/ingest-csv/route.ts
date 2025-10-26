import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface FamilyCSVRow {
  family_id: string
  head_name: string
  head_age: string
  head_gender: string
  head_mobile: string
  head_aadhaar_number: string
  ration_card_number: string
  ration_card_type: string
  address: string
  family_members: string
}

interface MemberCSVRow {
  member_id: string
  family_id: string
  name: string
  age: string
  gender: string
  aadhaar_number: string
  status: string
  relation_to_head: string
}

function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim())
    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index]
    })
    return row
  })
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Fetch CSV files from the provided URLs
    const familiesResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DOC-20251001-WA0005-a8gjX72Q5V5tzXe4lJFRVWXUrIwk3j.csv",
    )
    const membersResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/family_members-eaqbHmUIQHB5mFDGnAMn0pgPSI9Nih.csv",
    )

    if (!familiesResponse.ok || !membersResponse.ok) {
      throw new Error("Failed to fetch CSV files")
    }

    const familiesCSV = await familiesResponse.text()
    const membersCSV = await membersResponse.text()

    // Parse CSV data
    const familiesData = parseCSV(familiesCSV) as FamilyCSVRow[]
    const membersData = parseCSV(membersCSV) as MemberCSVRow[]

    console.log("[v0] Parsed families:", familiesData.length)
    console.log("[v0] Parsed members:", membersData.length)

    // Insert families
    const familiesInsertData = familiesData.map((row) => ({
      family_id: Number.parseInt(row.family_id),
      head_name: row.head_name,
      head_age: Number.parseInt(row.head_age),
      head_gender: row.head_gender,
      head_mobile: row.head_mobile,
      head_aadhaar_number: row.head_aadhaar_number,
      ration_card_number: row.ration_card_number,
      ration_card_type: row.ration_card_type,
      address: row.address,
      family_members_count: Number.parseInt(row.family_members),
      village: "Vashivali",
      taluka: "Khalapur",
      district: "Raigad",
      pincode: "410220",
    }))

    const { data: familiesResult, error: familiesError } = await supabase
      .from("families")
      .upsert(familiesInsertData, { onConflict: "family_id" })
      .select()

    if (familiesError) {
      console.error("[v0] Families insert error:", familiesError)
      throw familiesError
    }

    console.log("[v0] Inserted families:", familiesResult?.length)

    // Insert family members
    const membersInsertData = membersData.map((row) => ({
      member_id: Number.parseInt(row.member_id),
      family_id: Number.parseInt(row.family_id),
      name: row.name,
      age: Number.parseInt(row.age),
      gender: row.gender,
      aadhaar_number: row.aadhaar_number,
      status: row.status,
      relation_to_head: row.relation_to_head,
    }))

    const { data: membersResult, error: membersError } = await supabase
      .from("family_members")
      .upsert(membersInsertData, { onConflict: "member_id" })
      .select()

    if (membersError) {
      console.error("[v0] Members insert error:", membersError)
      throw membersError
    }

    console.log("[v0] Inserted members:", membersResult?.length)

    // Initialize monthly balances for all families
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    for (const family of familiesInsertData) {
      const { error: balanceError } = await supabase.rpc("initialize_monthly_balance", {
        p_family_id: family.family_id,
        p_month: currentMonth,
        p_year: currentYear,
      })

      if (balanceError) {
        console.error("[v0] Balance init error for family", family.family_id, balanceError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "CSV data ingested successfully",
      families: familiesResult?.length || 0,
      members: membersResult?.length || 0,
    })
  } catch (error: any) {
    console.error("[v0] CSV ingestion error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
