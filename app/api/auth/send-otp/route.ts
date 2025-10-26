import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { identifier, type } = await request.json()
    if (!identifier || !type) {
      return NextResponse.json({ success: false, error: "Missing identifier or type" }, { status: 400 })
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // In development, return the OTP for testing
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] OTP for ${identifier}: ${otp}`)
      
      // Simulate successful OTP send
      return NextResponse.json({ 
        success: true, 
        message: "OTP sent successfully",
        otp: otp // Only in development
      })
    }

    // In production, integrate with actual SMS service
    // For now, simulate success
    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully" 
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
