import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { booking_id, family_id, member_id, shop_id, auth_type, auth_status, otp_code } = body || {}

    if (!family_id || !member_id || !shop_id || !auth_type || !auth_status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase.from("auth_logs").insert({
      booking_id: booking_id || null,
      family_id,
      member_id,
      shop_id,
      auth_type,
      auth_status,
      otp_code: otp_code || null,
    })
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error("/api/shop/verify error", e)
    return NextResponse.json({ success: false, error: e.message || "Server error" }, { status: 500 })
  }
}


