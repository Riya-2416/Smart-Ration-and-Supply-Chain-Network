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
      department,
    } = await request.json()

    // Validate required fields
    if (!username || !password || !full_name || !mobile || !department) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // For development, simulate successful registration
    if (process.env.NODE_ENV === "development") {
      console.log("[DEV] Admin registration:", {
        username,
        full_name,
        department,
        mobile
      })
      
      return NextResponse.json({
        success: true,
        message: "Admin registered successfully",
        user: {
          user_id: Math.floor(Math.random() * 1000),
          username,
          full_name,
          role: "admin",
          department
        }
      })
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
    
    // Register admin
    const response = await fetch(`${API_BASE}/register/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password_hash: passwordHash,
        full_name,
        email,
        mobile,
        department,
        role: "admin"
      }),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
