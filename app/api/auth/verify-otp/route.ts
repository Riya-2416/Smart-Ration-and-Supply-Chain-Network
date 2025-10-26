import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { identifier, otp, type } = await request.json()
    if (!identifier || !otp) {
      return NextResponse.json({ success: false, error: "Missing identifier or OTP" }, { status: 400 })
    }

    // For development, accept any 6-digit OTP
    if (process.env.NODE_ENV === "development") {
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        // Mock family data for development
        const mockFamily = {
          family_id: 101,
          head_name: "John Doe",
          head_mobile: identifier,
          ration_card_number: "RC123456789",
          ration_card_type: "BPL",
          address: "123 Main Street, Vashivali, Khalapur, Raigad",
          family_members: 4
        }

        const mockMembers = [
          {
            member_id: 201,
            family_id: 101,
            name: "John Doe",
            age: 45,
            gender: "Male",
            aadhaar_number: identifier,
            relation_to_head: "Self",
            status: "Active"
          },
          {
            member_id: 202,
            family_id: 101,
            name: "Jane Doe",
            age: 40,
            gender: "Female",
            aadhaar_number: "123456789012",
            relation_to_head: "Wife",
            status: "Active"
          }
        ]

        const mockQuota = {
          rice: 5,
          wheat: 4,
          sugar: 1,
          kerosene: 2
        }

        // Set session cookie
        const cookieStore = await cookies()
        cookieStore.set("smart_ration_session", JSON.stringify({ 
          familyId: mockFamily.family_id, 
          ts: Date.now() 
        }), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24,
        })

        return NextResponse.json({
          success: true,
          family: mockFamily,
          members: mockMembers,
          balance: mockQuota
        })
      } else {
        return NextResponse.json({ success: false, error: "Invalid OTP format" }, { status: 400 })
      }
    }

    // In production, verify with actual backend
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
    const resp = await fetch(`${API_BASE}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, otp, type }),
    })
    const data = await resp.json()

    if (data.success && data.family) {
      const cookieStore = await cookies()
      cookieStore.set("smart_ration_session", JSON.stringify({ familyId: data.family.family_id, ts: Date.now() }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      })
    }

    return NextResponse.json(data, { status: resp.status })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
