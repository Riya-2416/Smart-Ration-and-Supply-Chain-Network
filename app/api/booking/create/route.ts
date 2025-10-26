import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { familyId, shopId, memberId, pickupDate, rice, wheat, sugar, kerosene } = await request.json()

    if (!familyId || !shopId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check available balance
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    const { data: balance, error: balanceError } = await supabase
      .from("monthly_balances")
      .select("*")
      .eq("family_id", familyId)
      .eq("month", currentMonth)
      .eq("year", currentYear)
      .single()

    if (balanceError || !balance) {
      return NextResponse.json({ success: false, error: "Balance not found" }, { status: 404 })
    }

    // Validate requested quantities
    if (rice > balance.rice_remaining) {
      return NextResponse.json({ success: false, error: "Insufficient rice balance" }, { status: 400 })
    }
    if (wheat > balance.wheat_remaining) {
      return NextResponse.json({ success: false, error: "Insufficient wheat balance" }, { status: 400 })
    }
    if (sugar > balance.sugar_remaining) {
      return NextResponse.json({ success: false, error: "Insufficient sugar balance" }, { status: 400 })
    }
    if (kerosene > balance.kerosene_remaining) {
      return NextResponse.json({ success: false, error: "Insufficient kerosene balance" }, { status: 400 })
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        family_id: familyId,
        shop_id: shopId,
        member_id: memberId || null,
        pickup_date: pickupDate,
        rice_kg: rice || 0,
        wheat_kg: wheat || 0,
        sugar_kg: sugar || 0,
        kerosene_liters: kerosene || 0,
        status: "Confirmed",
      })
      .select()
      .single()

    if (bookingError) {
      console.error("[v0] Booking error:", bookingError)
      return NextResponse.json({ success: false, error: bookingError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      booking,
    })
  } catch (error: any) {
    console.error("[v0] Create booking error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
