import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const familyId = searchParams.get("familyId")

    if (!familyId) {
      return NextResponse.json({ success: false, error: "Missing familyId" }, { status: 400 })
    }

    const supabase = await createClient()

    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    // Get or initialize balance
    let { data: balance, error: balanceError } = await supabase
      .from("monthly_balances")
      .select("*")
      .eq("family_id", Number.parseInt(familyId))
      .eq("month", currentMonth)
      .eq("year", currentYear)
      .single()

    if (balanceError && balanceError.code === "PGRST116") {
      // Balance doesn't exist, initialize it
      const { error: initError } = await supabase.rpc("initialize_monthly_balance", {
        p_family_id: Number.parseInt(familyId),
        p_month: currentMonth,
        p_year: currentYear,
      })

      if (initError) {
        console.error("[v0] Balance init error:", initError)
        return NextResponse.json({ success: false, error: initError.message }, { status: 500 })
      }

      // Fetch again
      const { data: newBalance, error: newBalanceError } = await supabase
        .from("monthly_balances")
        .select("*")
        .eq("family_id", Number.parseInt(familyId))
        .eq("month", currentMonth)
        .eq("year", currentYear)
        .single()

      if (newBalanceError) {
        return NextResponse.json({ success: false, error: newBalanceError.message }, { status: 500 })
      }

      balance = newBalance
    } else if (balanceError) {
      return NextResponse.json({ success: false, error: balanceError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      balance,
    })
  } catch (error: any) {
    console.error("[v0] Get balance error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
