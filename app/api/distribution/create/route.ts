import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { familyId, shopId, memberId, rice, wheat, sugar, kerosene, totalAmount, paymentMethod, transactionHash } =
      await request.json()

    if (!familyId || !shopId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Use the stored procedure to record distribution
    const { data, error } = await supabase.rpc("record_distribution", {
      p_family_id: familyId,
      p_shop_id: shopId,
      p_member_id: memberId || null,
      p_rice_kg: rice || 0,
      p_wheat_kg: wheat || 0,
      p_sugar_kg: sugar || 0,
      p_kerosene_liters: kerosene || 0,
      p_total_amount: totalAmount || 0,
      p_payment_method: paymentMethod || "Cash",
      p_transaction_hash: transactionHash || null,
    })

    if (error) {
      console.error("[v0] Distribution error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    // Get the created distribution
    const { data: distribution, error: fetchError } = await supabase
      .from("distributions")
      .select("*")
      .eq("distribution_id", data)
      .single()

    if (fetchError) {
      console.error("[v0] Fetch distribution error:", fetchError)
    }

    // Get updated balance
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    const { data: balance, error: balanceError } = await supabase
      .from("monthly_balances")
      .select("*")
      .eq("family_id", familyId)
      .eq("month", currentMonth)
      .eq("year", currentYear)
      .single()

    if (balanceError) {
      console.error("[v0] Balance fetch error:", balanceError)
    }

    return NextResponse.json({
      success: true,
      message: "Distribution recorded successfully",
      distributionId: data,
      distribution,
      balance,
    })
  } catch (error: any) {
    console.error("[v0] Create distribution error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
