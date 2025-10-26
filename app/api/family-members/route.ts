import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { family_id, name, age, gender, aadhaar_number, relation_to_head } = body || {}

    if (!family_id || !name || !aadhaar_number) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }
    if (!/^\d{12}$/.test(String(aadhaar_number))) {
      return NextResponse.json({ success: false, error: "Aadhaar must be 12 digits" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify family exists
    const { data: fam, error: famErr } = await supabase.from("families").select("family_id").eq("family_id", family_id).single()
    if (famErr || !fam) {
      return NextResponse.json({ success: false, error: "Family not found" }, { status: 404 })
    }

    // Aadhaar uniqueness
    const { data: existing, error: existErr } = await supabase
      .from("family_members")
      .select("member_id")
      .eq("aadhaar_number", aadhaar_number)
      .limit(1)
    if (existErr) {
      return NextResponse.json({ success: false, error: existErr.message }, { status: 500 })
    }
    if (existing && existing.length) {
      return NextResponse.json({ success: false, error: "Aadhaar already exists" }, { status: 409 })
    }

    // Next member id
    const { data: memMax } = await supabase.from("family_members").select("max:member_id(max)").single()
    const member_id = (memMax?.max || 0) + 1

    // Insert member
    const { error: insertErr } = await supabase.from("family_members").insert({
      member_id,
      family_id,
      name,
      age,
      gender,
      aadhaar_number,
      status: "Active",
      relation_to_head: relation_to_head || null,
    })
    if (insertErr) {
      return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 })
    }

    // Update family count
    await supabase.rpc("increment", { table_name: "families", id_col: "family_id", id_val: family_id, col: "family_members_count" })
      .catch(() => supabase.from("families").update({ family_members_count: (fam as any).family_members_count + 1 }).eq("family_id", family_id))

    // Recompute entitlement for current month by re-running initialize
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    await supabase.rpc("initialize_monthly_balance", { p_family_id: family_id, p_month: month, p_year: year })

    return NextResponse.json({ success: true, member_id })
  } catch (e: any) {
    console.error("/api/family-members error", e)
    return NextResponse.json({ success: false, error: e.message || "Server error" }, { status: 500 })
  }
}


