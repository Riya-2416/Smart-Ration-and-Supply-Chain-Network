"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Smartphone, Shield, User, Store, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [mobile, setMobile] = useState("")
  const [currentIdentifier, setCurrentIdentifier] = useState("")
  const [currentType, setCurrentType] = useState<"aadhaar" | "mobile">("aadhaar")
  const [error, setError] = useState("")
  const [loginType, setLoginType] = useState<"citizen" | "distributor" | "admin">("citizen")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { t } = useLanguage()

  const handleAadhaarLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: aadhaarNumber, type: "aadhaar" }),
      })

      const data = await response.json()

      if (data.success) {
        setOtpSent(true)
        setCurrentIdentifier(aadhaarNumber)
        setCurrentType("aadhaar")
        // In development, show OTP in console
        if (data.otp) {
          console.log("[v0] Development OTP:", data.otp)
        }
      } else {
        setError(data.error || "Failed to send OTP")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMobileLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: mobile, type: "mobile" }),
      })

      const data = await response.json()

      if (data.success) {
        setOtpSent(true)
        setCurrentIdentifier(mobile)
        setCurrentType("mobile")
        // In development, show OTP in console
        if (data.otp) {
          console.log("[v0] Development OTP:", data.otp)
        }
      } else {
        setError(data.error || "Failed to send OTP")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: currentIdentifier, otp, type: currentType }),
      })

      const data = await response.json()

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            family: data.family,
            members: data.members,
            balance: data.balance,
            role: "citizen"
          }),
        )
        router.push("/dashboard")
      } else {
        setError(data.error || "Invalid OTP")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUsernamePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          password, 
          role: loginType 
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store user data in localStorage
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            user: data.user,
            role: loginType,
            ...(loginType === "distributor" && { shop: data.shop }),
            ...(loginType === "admin" && { department: data.department })
          }),
        )
        
        // Redirect based on role
        if (loginType === "admin") {
          router.push("/admin")
        } else if (loginType === "distributor") {
          router.push("/shop")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError(data.error || "Invalid credentials")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setOtpSent(false)
    setOtp("")
    setError("")
  }

  return (
    <div className="space-y-6">
      {/* Role Selection */}
      <Tabs value={loginType} onValueChange={(value) => setLoginType(value as "citizen" | "distributor" | "admin")} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="citizen" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Citizen</span>
          </TabsTrigger>
          <TabsTrigger value="distributor" className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <span>Distributor</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Admin</span>
          </TabsTrigger>
        </TabsList>

        {/* Citizen Login */}
        <TabsContent value="citizen">
          <Tabs defaultValue="aadhaar" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="aadhaar" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>{t("aadhaar")}</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span>{t("mobile")}</span>
              </TabsTrigger>
              <TabsTrigger value="rfid" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>{t("rfid")}</span>
              </TabsTrigger>
            </TabsList>

        <TabsContent value="aadhaar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>{t("aadhaarAuth")}</span>
              </CardTitle>
              <CardDescription>{t("aadhaarDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {!otpSent ? (
                <form onSubmit={handleAadhaarLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">{t("aadhaarNumber")}</Label>
                    <Input
                      id="aadhaar"
                      placeholder="XXXX XXXX XXXX"
                      maxLength={12}
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending OTP..." : t("sendOTP")}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpVerification} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">{t("enterOTP")}</Label>
                    <Input
                      id="otp"
                      placeholder="6-digit OTP"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground">{t("otpSent")}</p>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Verifying..." : t("verifyLogin")}
                  </Button>
                  <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleResendOTP}>
                    {t("resendOTP")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>{t("mobileLogin")}</span>
              </CardTitle>
              <CardDescription>{t("mobileDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {!otpSent ? (
                <form onSubmit={handleMobileLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">{t("mobileNumber")}</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending OTP..." : t("sendOTP")}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpVerification} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp-mobile">{t("enterOTP")}</Label>
                    <Input
                      id="otp-mobile"
                      placeholder="6-digit OTP"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <p className="text-sm text-muted-foreground">{t("otpSent")}</p>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Verifying..." : t("verifyLogin")}
                  </Button>
                  <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleResendOTP}>
                    {t("resendOTP")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfid">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>{t("rfidCardLogin")}</span>
              </CardTitle>
              <CardDescription>{t("rfidDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
                <p className="text-lg font-medium mb-2">{t("readyToScan")}</p>
                <p className="text-muted-foreground">{t("placeRFID")}</p>
              </div>
            </CardContent>
          </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Distributor Login */}
        <TabsContent value="distributor">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="h-5 w-5" />
                <span>Distributor Login</span>
              </CardTitle>
              <CardDescription>Login with your distributor credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUsernamePasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dist_username">Username</Label>
                  <Input
                    id="dist_username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dist_password">Password</Label>
                  <Input
                    id="dist_password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Distributor"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Login */}
        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Admin Login</span>
              </CardTitle>
              <CardDescription>Login with your admin credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUsernamePasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin_username">Username</Label>
                  <Input
                    id="admin_username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin_password">Password</Label>
                  <Input
                    id="admin_password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Admin"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Don't have an account?</p>
        <Link href="/register">
          <Button variant="outline" className="w-full bg-transparent">
            Register Account
          </Button>
        </Link>
      </div>
    </div>
  )
}
