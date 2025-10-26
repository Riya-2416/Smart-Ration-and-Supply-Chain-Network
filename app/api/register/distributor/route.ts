import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const {
      username,
      password,
      full_name,
      email,
      mobile,
      aadhaar_number,
      shop_name,
      shop_address,
      license_number,
    } = await request.json()

    console.log("[API] Distributor registration request:", {
      username,
      full_name,
      mobile,
      shop_name,
      hasPassword: !!password,
      hasAadhaar: !!aadhaar_number
    })

    // Validate required fields
    if (!username || !password || !full_name || !mobile || !aadhaar_number || !shop_name || !shop_address || !license_number) {
      console.log("[API] Missing required fields:", {
        username: !!username,
        password: !!password,
        full_name: !!full_name,
        mobile: !!mobile,
        aadhaar_number: !!aadhaar_number,
        shop_name: !!shop_name,
        shop_address: !!shop_address,
        license_number: !!license_number
      })
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // For development, simulate successful registration
    if (process.env.NODE_ENV === "development") {
      console.log("[DEV] Distributor registration:", {
        username,
        full_name,
        shop_name,
        mobile
      })
      
      return NextResponse.json({
        success: true,
        message: "Distributor registered successfully",
        user: {
          user_id: Math.floor(Math.random() * 1000),
          username,
          full_name,
          role: "distributor"
        }
      })
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
    
    // Register distributor
    const response = await fetch(`${API_BASE}/register/distributor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password_hash: passwordHash,
        full_name,
        email,
        mobile,
        aadhaar_number,
        shop_name,
        shop_address,
        license_number,
        role: "distributor"
      }),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
