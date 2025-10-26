import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json()
    
    if (!username || !password || !role) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // For development, simulate successful login
    if (process.env.NODE_ENV === "development") {
      console.log("[DEV] Login attempt:", { username, role })
      
      // Mock user data based on role
      const mockUser = {
        user_id: Math.floor(Math.random() * 1000),
        username,
        full_name: role === "admin" ? "Admin User" : "Distributor User",
        role,
        ...(role === "distributor" && {
          shop: {
            shop_id: 1,
            shop_name: "Vashivali Ration Shop",
            address: "Vashivali, Khalapur, Raigad"
          }
        }),
        ...(role === "admin" && {
          department: "Food & Civil Supplies"
        })
      }

      // Set session cookie
      const cookieStore = await import("next/headers").then(m => m.cookies())
      cookieStore.set("smart_ration_session", JSON.stringify({ 
        userId: mockUser.user_id, 
        role: mockUser.role,
        ts: Date.now() 
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      })

      return NextResponse.json({
        success: true,
        user: mockUser
      })
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
    
    // Login with username/password
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    })

    const data = await response.json()
    
    if (data.success && data.user) {
      // Set session cookie
      const cookieStore = await import("next/headers").then(m => m.cookies())
      cookieStore.set("smart_ration_session", JSON.stringify({ 
        userId: data.user.user_id, 
        role: data.user.role,
        ts: Date.now() 
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
