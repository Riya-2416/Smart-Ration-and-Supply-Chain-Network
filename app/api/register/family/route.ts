import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function hashOtp(otp: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(otp).digest("hex")
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      head_name,
      head_age,
      head_gender,
      head_aadhaar_number,
      head_mobile,
      address,
      ration_card_number,
      ration_card_type,
    } = body || {}

    if (
      !head_name ||
      !head_age ||
      !head_gender ||
      !head_aadhaar_number ||
      !head_mobile ||
      !address ||
      !ration_card_number ||
      !ration_card_type
    ) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    if (!/^\d{12}$/.test(String(head_aadhaar_number))) {
      return NextResponse.json({ success: false, error: "Aadhaar must be 12 digits" }, { status: 400 })
    }

    const supabase = await createClient()

    // Ensure uniqueness
    const [{ data: existingFam }, { data: existingMem }] = await Promise.all([
      supabase.from("families").select("family_id").eq("head_aadhaar_number", head_aadhaar_number).limit(1),
      supabase.from("family_members").select("member_id").eq("aadhaar_number", head_aadhaar_number).limit(1),
    ])

    if ((existingFam && existingFam.length) || (existingMem && existingMem.length)) {
      return NextResponse.json({ success: false, error: "Aadhaar already registered" }, { status: 409 })
    }

    // Allocate new IDs using MAX+1 pattern (fits our current schema)
    const [{ data: famMax }, { data: memMax }] = await Promise.all([
      supabase.from("families").select("max:family_id(max)").single(),
      supabase.from("family_members").select("max:member_id(max)").single(),
    ])

    const family_id = (famMax?.max || 0) + 1
    const member_id = (memMax?.max || 0) + 1

    // Insert family
    const { error: famError } = await supabase.from("families").insert({
      family_id,
      head_name,
      head_age,
      head_gender,
      head_mobile,
      head_aadhaar_number,
      ration_card_number,
      ration_card_type,
      address,
      family_members_count: 1,
    })
    if (famError) {
      return NextResponse.json({ success: false, error: famError.message }, { status: 500 })
    }

    // Insert head as member
    const { error: memError } = await supabase.from("family_members").insert({
      member_id,
      family_id,
      name: head_name,
      age: head_age,
      gender: head_gender,
      aadhaar_number: head_aadhaar_number,
      status: "Active",
      relation_to_head: "Head",
    })
    if (memError) {
      return NextResponse.json({ success: false, error: memError.message }, { status: 500 })
    }

    // Initialize current month balance via RPC function
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    const { error: initError } = await supabase.rpc("initialize_monthly_balance", {
      p_family_id: family_id,
      p_month: month,
      p_year: year,
    })
    if (initError) {
      // Not fatal for registration, but report
      console.error("initialize_monthly_balance error", initError)
    }

    // Create OTP and persist to auth_otp
    const otp = generateOTP()
    const secret = process.env.OTP_SECRET || "dev-secret"
    const otp_hash = hashOtp(otp, secret)
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    const { error: otpError } = await supabase
      .from("auth_otp")
      .upsert({ identifier: head_mobile, otp_hash, expires_at }, { onConflict: "identifier" })
    if (otpError) {
      return NextResponse.json({ success: false, error: "Failed to create OTP" }, { status: 500 })
    }

    console.log(`[register] OTP for ${head_mobile}: ${otp}`)

    return NextResponse.json({
      success: true,
      family_id,
      member_id,
      mobile: head_mobile,
      ...(process.env.NODE_ENV !== "production" && { otp }),
    })
  } catch (e: any) {
    console.error("/api/register/family error", e)
    return NextResponse.json({ success: false, error: e.message || "Server error" }, { status: 500 })
  }
}


