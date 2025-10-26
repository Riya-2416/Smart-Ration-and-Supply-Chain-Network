import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      booking_id,
      family_id,
      member_id,
      shop_id,
      rice_kg = 0,
      wheat_kg = 0,
      sugar_kg = 0,
      kerosene_liters = 0,
      shortage,
    } = body || {}

    if (!family_id || !member_id || !shop_id) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Ensure monthly balance row exists
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    await supabase.rpc("initialize_monthly_balance", { p_family_id: family_id, p_month: month, p_year: year })

    // Check and atomically decrement balances
    const { data: balance, error: balErr } = await supabase
      .from("monthly_balances")
      .select("*")
      .eq("family_id", family_id)
      .eq("month", month)
      .eq("year", year)
      .single()
    if (balErr || !balance) {
      return NextResponse.json({ success: false, error: "Balance not found" }, { status: 400 })
    }

    if (
      balance.rice_remaining < rice_kg ||
      balance.wheat_remaining < wheat_kg ||
      balance.sugar_remaining < sugar_kg ||
      balance.kerosene_remaining < kerosene_liters
    ) {
      return NextResponse.json({ success: false, error: "Insufficient balance" }, { status: 400 })
    }

    // Insert distribution
    const { data: dist, error: distErr } = await supabase
      .from("distributions")
      .insert({
        booking_id: booking_id || null,
        family_id,
        member_id,
        shop_id,
        rice_kg,
        wheat_kg,
        sugar_kg,
        kerosene_liters,
      })
      .select("distribution_id")
      .single()
    if (distErr) {
      return NextResponse.json({ success: false, error: distErr.message }, { status: 500 })
    }

    const { error: updErr } = await supabase
      .from("monthly_balances")
      .update({
        rice_remaining: balance.rice_remaining - rice_kg,
        wheat_remaining: balance.wheat_remaining - wheat_kg,
        sugar_remaining: balance.sugar_remaining - sugar_kg,
        kerosene_remaining: balance.kerosene_remaining - kerosene_liters,
      })
      .eq("family_id", family_id)
      .eq("month", month)
      .eq("year", year)
    if (updErr) {
      return NextResponse.json({ success: false, error: updErr.message }, { status: 500 })
    }

    if (booking_id) {
      await supabase.from("bookings").update({ status: "Completed" }).eq("booking_id", booking_id)
    }

    // Log shortages if provided
    if (shortage && Array.isArray(shortage)) {
      const rows = shortage.map((s: any) => ({
        distribution_id: dist.distribution_id,
        family_id,
        item_code: s.item_code,
        expected_qty: s.expected_qty,
        given_qty: s.given_qty,
        reason_code: s.reason_code,
        reason_text: s.reason_text,
      }))
      await supabase.from("undistributed_logs").insert(rows)
    }

    return NextResponse.json({ success: true, distribution_id: dist.distribution_id })
  } catch (e: any) {
    console.error("/api/shop/distribute error", e)
    return NextResponse.json({ success: false, error: e.message || "Server error" }, { status: 500 })
  }
}


