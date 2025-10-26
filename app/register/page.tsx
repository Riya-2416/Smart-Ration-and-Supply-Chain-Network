"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, ArrowLeft, CheckCircle, Shield, Store, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { dataService } from "@/lib/data-service"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [registrationData, setRegistrationData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("citizen")

  const handleCitizenSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      // Register new family
      const familyId = dataService.registerNewFamily({
        head_name: formData.get("head_name") as string,
        head_age: Number(formData.get("head_age")),
        head_gender: formData.get("head_gender") as string,
        head_mobile: formData.get("head_mobile") as string,
        head_aadhaar_number: formData.get("head_aadhaar") as string,
        ration_card_number: formData.get("ration_card") as string,
        ration_card_type: formData.get("card_type") as string,
        address: formData.get("address") as string,
        family_members: Number(formData.get("family_members")),
      })

      setRegistrationData({
        type: "citizen",
        rationCardNumber: formData.get("ration_card") as string,
        familyId
      })
      setRegistered(true)

      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error) {
      console.error("[v0] Registration failed:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDistributorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const registrationData = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        full_name: formData.get("full_name") as string,
        email: formData.get("email") as string,
        mobile: formData.get("mobile") as string,
        aadhaar_number: formData.get("aadhaar") as string,
        shop_name: formData.get("shop_name") as string,
        shop_address: formData.get("shop_address") as string,
        license_number: formData.get("license_number") as string,
      }

      console.log("[Frontend] Sending distributor registration:", registrationData)

      // Register distributor
      const response = await fetch("/api/register/distributor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      })

      const data = await response.json()
      console.log("[Frontend] Registration response:", data)

      if (data.success) {
        setRegistrationData({
          type: "distributor",
          username: formData.get("username") as string,
          shopName: formData.get("shop_name") as string
        })
        setRegistered(true)

        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        console.error("[Frontend] Registration failed:", data)
        alert(data.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Registration failed:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      // Register admin
      const response = await fetch("/api/register/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username") as string,
          password: formData.get("password") as string,
          full_name: formData.get("full_name") as string,
          email: formData.get("email") as string,
          mobile: formData.get("mobile") as string,
          department: formData.get("department") as string,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setRegistrationData({
          type: "admin",
          username: formData.get("username") as string,
          department: formData.get("department") as string
        })
        setRegistered(true)

        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        alert(data.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Registration failed:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Registration Successful!</h2>
                <p className="text-muted-foreground mt-2">
                  {registrationData?.type === "citizen" && "Your ration card has been registered successfully."}
                  {registrationData?.type === "distributor" && "Your distributor account has been created successfully."}
                  {registrationData?.type === "admin" && "Your admin account has been created successfully."}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                {registrationData?.type === "citizen" && (
                  <>
                    <Label className="text-sm text-muted-foreground">Ration Card Number</Label>
                    <p className="font-mono text-lg font-bold">{registrationData.rationCardNumber}</p>
                  </>
                )}
                {registrationData?.type === "distributor" && (
                  <>
                    <Label className="text-sm text-muted-foreground">Username</Label>
                    <p className="font-mono text-lg font-bold">{registrationData.username}</p>
                    <Label className="text-sm text-muted-foreground mt-2">Shop Name</Label>
                    <p className="font-mono text-lg font-bold">{registrationData.shopName}</p>
                  </>
                )}
                {registrationData?.type === "admin" && (
                  <>
                    <Label className="text-sm text-muted-foreground">Username</Label>
                    <p className="font-mono text-lg font-bold">{registrationData.username}</p>
                    <Label className="text-sm text-muted-foreground mt-2">Department</Label>
                    <p className="font-mono text-lg font-bold">{registrationData.department}</p>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Redirecting to login page...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/login">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UserPlus className="h-8 w-8 text-primary" />
            Register Account
          </h1>
          <p className="text-muted-foreground mt-2">
            Choose your account type and fill in the details to get started
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

          <TabsContent value="citizen">
            <form onSubmit={handleCitizenSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Head of Family Details</CardTitle>
              <CardDescription>Primary cardholder information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="head_name">Full Name *</Label>
                  <Input id="head_name" name="head_name" placeholder="Enter full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="head_age">Age *</Label>
                  <Input id="head_age" name="head_age" type="number" placeholder="Age" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="head_gender">Gender *</Label>
                  <Select name="head_gender" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="head_mobile">Mobile Number *</Label>
                  <Input id="head_mobile" name="head_mobile" type="tel" placeholder="+91 XXXXX XXXXX" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="head_aadhaar">Aadhaar Number *</Label>
                  <Input id="head_aadhaar" name="head_aadhaar" placeholder="XXXX XXXX XXXX" maxLength={12} required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ration Card Details</CardTitle>
              <CardDescription>Card type and family information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ration_card">Ration Card Number *</Label>
                  <Input id="ration_card" name="ration_card" placeholder="Enter card number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card_type">Card Type *</Label>
                  <Select name="card_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AAY">AAY (Antyodaya Anna Yojana)</SelectItem>
                      <SelectItem value="BPL">BPL (Below Poverty Line)</SelectItem>
                      <SelectItem value="White">White Card (APL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="family_members">Number of Family Members *</Label>
                  <Input
                    id="family_members"
                    name="family_members"
                    type="number"
                    min="1"
                    placeholder="Total members"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Complete Address *</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="House No, Village/Town, Taluka, District, Pincode"
                  required
                />
              </div>
            </CardContent>
          </Card>

              <div className="mt-6 flex gap-4">
                <Button type="submit" size="lg" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register Family"}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => router.push("/login")}>
                  Cancel
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="distributor">
            <form onSubmit={handleDistributorSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Distributor Account Details</CardTitle>
                  <CardDescription>Create your distributor account to manage ration distribution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username *</Label>
                      <Input id="username" name="username" placeholder="Enter username" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input id="password" name="password" type="password" placeholder="Enter password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input id="full_name" name="full_name" placeholder="Enter full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="Enter email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input id="mobile" name="mobile" type="tel" placeholder="+91 XXXXX XXXXX" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                      <Input id="aadhaar" name="aadhaar" placeholder="XXXX XXXX XXXX" maxLength={12} required />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Shop Details</CardTitle>
                  <CardDescription>Information about your ration shop</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shop_name">Shop Name *</Label>
                      <Input id="shop_name" name="shop_name" placeholder="Enter shop name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license_number">License Number *</Label>
                      <Input id="license_number" name="license_number" placeholder="Enter license number" required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="shop_address">Shop Address *</Label>
                      <Input id="shop_address" name="shop_address" placeholder="Complete shop address" required />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 flex gap-4">
                <Button type="submit" size="lg" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register Distributor"}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => router.push("/login")}>
                  Cancel
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="admin">
            <form onSubmit={handleAdminSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Admin Account Details</CardTitle>
                  <CardDescription>Create your admin account to manage the system</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin_username">Username *</Label>
                      <Input id="admin_username" name="username" placeholder="Enter username" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin_password">Password *</Label>
                      <Input id="admin_password" name="password" type="password" placeholder="Enter password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin_full_name">Full Name *</Label>
                      <Input id="admin_full_name" name="full_name" placeholder="Enter full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin_email">Email</Label>
                      <Input id="admin_email" name="email" type="email" placeholder="Enter email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin_mobile">Mobile Number *</Label>
                      <Input id="admin_mobile" name="mobile" type="tel" placeholder="+91 XXXXX XXXXX" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select name="department" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food & Civil Supplies">Food & Civil Supplies</SelectItem>
                          <SelectItem value="District Administration">District Administration</SelectItem>
                          <SelectItem value="IT Department">IT Department</SelectItem>
                          <SelectItem value="Monitoring">Monitoring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 flex gap-4">
                <Button type="submit" size="lg" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register Admin"}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => router.push("/login")}>
                  Cancel
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
