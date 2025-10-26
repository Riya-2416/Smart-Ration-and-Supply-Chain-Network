"use client"

import { useState, useEffect } from "react"
import { ShopHeader } from "@/components/shop/shop-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  UserCheck, 
  CreditCard, 
  Smartphone, 
  Package, 
  Receipt, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Send
} from "lucide-react"

interface FamilyMember {
  member_id: number
  name: string
  age: number
  gender: string
  aadhaar_number: string
  relation_to_head: string
  status: string
}

interface FamilyData {
  family_id: number
  head_name: string
  head_mobile: string
  ration_card_number: string
  ration_card_type: string
  address: string
  family_members: number
  members: FamilyMember[]
}

interface RationQuota {
  rice: number
  wheat: number
  sugar: number
  kerosene: number
}

interface DistributionRecord {
  id: string
  family_id: number
  member_id: number
  items: Array<{
    name: string
    quantity: number
    unit: string
    price: number
  }>
  total_amount: number
  date: string
  status: "completed" | "pending"
}

export default function VerificationPage() {
  const [verificationMethod, setVerificationMethod] = useState<"aadhaar" | "mobile">("aadhaar")
  const [identifier, setIdentifier] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [verifiedFamily, setVerifiedFamily] = useState<FamilyData | null>(null)
  const [quota, setQuota] = useState<RationQuota | null>(null)
  const [distributionItems, setDistributionItems] = useState<Array<{
    name: string
    quantity: number
    unit: string
    price: number
  }>>([])
  const [recentDistributions, setRecentDistributions] = useState<DistributionRecord[]>([])

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockDistributions: DistributionRecord[] = [
      {
        id: "1",
        family_id: 101,
        member_id: 201,
        items: [
          { name: "Rice", quantity: 5, unit: "kg", price: 25 },
          { name: "Wheat", quantity: 4, unit: "kg", price: 20 },
          { name: "Sugar", quantity: 1, unit: "kg", price: 40 }
        ],
        total_amount: 245,
        date: "2024-01-15T10:30:00Z",
        status: "completed"
      },
      {
        id: "2",
        family_id: 102,
        member_id: 202,
        items: [
          { name: "Rice", quantity: 5, unit: "kg", price: 25 },
          { name: "Wheat", quantity: 4, unit: "kg", price: 20 },
          { name: "Sugar", quantity: 1, unit: "kg", price: 40 },
          { name: "Kerosene", quantity: 2, unit: "liters", price: 60 }
        ],
        total_amount: 365,
        date: "2024-01-15T09:15:00Z",
        status: "completed"
      }
    ]
    setRecentDistributions(mockDistributions)
  }, [])

  const handleSendOTP = async () => {
    if (!identifier) {
      setError("Please enter Aadhaar number or mobile number")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          identifier, 
          type: verificationMethod 
        }),
      })

      const data = await response.json()

      if (data.success) {
        setOtpSent(true)
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

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter OTP")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          identifier, 
          otp,
          type: verificationMethod 
        }),
      })

      const data = await response.json()

      if (data.success) {
        setVerifiedFamily(data.family)
        setQuota(data.quota)
        
        // Initialize distribution items based on quota
        setDistributionItems([
          { name: "Rice", quantity: data.quota.rice, unit: "kg", price: 25 },
          { name: "Wheat", quantity: data.quota.wheat, unit: "kg", price: 20 },
          { name: "Sugar", quantity: data.quota.sugar, unit: "kg", price: 40 },
          { name: "Kerosene", quantity: data.quota.kerosene, unit: "liters", price: 60 }
        ])
      } else {
        setError(data.error || "Invalid OTP")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDistribute = async () => {
    if (!verifiedFamily || !distributionItems.length) {
      setError("No family verified or items to distribute")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const totalAmount = distributionItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
      
      const response = await fetch("/api/distribution/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          family_id: verifiedFamily.family_id,
          member_id: verifiedFamily.members[0]?.member_id,
          items: distributionItems,
          total_amount: totalAmount,
          shop_id: 1 // Current shop ID
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Generate and send receipt
        await generateReceipt(data.distribution)
        
        // Reset form
        setVerifiedFamily(null)
        setQuota(null)
        setDistributionItems([])
        setOtpSent(false)
        setOtp("")
        setIdentifier("")
        
        // Refresh recent distributions
        setRecentDistributions(prev => [data.distribution, ...prev])
        
        alert("Distribution completed successfully! Receipt sent via SMS.")
      } else {
        setError(data.error || "Distribution failed")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const generateReceipt = async (distribution: DistributionRecord) => {
    try {
      const response = await fetch("/api/receipt/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distribution_id: distribution.id,
          family_id: distribution.family_id,
          items: distribution.items,
          total_amount: distribution.total_amount,
          mobile: verifiedFamily?.head_mobile
        }),
      })

      const data = await response.json()
      if (data.success) {
        console.log("Receipt generated and sent successfully")
      }
    } catch (error) {
      console.error("Failed to generate receipt:", error)
    }
  }

  const updateItemQuantity = (index: number, quantity: number) => {
    const updatedItems = [...distributionItems]
    updatedItems[index].quantity = Math.max(0, quantity)
    setDistributionItems(updatedItems)
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <main className="p-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Customer Verification</h1>
            <p className="text-muted-foreground">Verify customers and distribute ration items</p>
          </div>

          <Tabs defaultValue="verify" className="w-full">
            <TabsList>
              <TabsTrigger value="verify">Verify Customer</TabsTrigger>
              <TabsTrigger value="distribute">Distribute Items</TabsTrigger>
              <TabsTrigger value="history">Distribution History</TabsTrigger>
            </TabsList>

            <TabsContent value="verify" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Verification Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserCheck className="h-5 w-5" />
                      <span>Customer Verification</span>
                    </CardTitle>
                    <CardDescription>Verify customer identity using Aadhaar or mobile number</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Button
                          variant={verificationMethod === "aadhaar" ? "default" : "outline"}
                          onClick={() => setVerificationMethod("aadhaar")}
                          className="flex items-center space-x-2"
                        >
                          <CreditCard className="h-4 w-4" />
                          <span>Aadhaar</span>
                        </Button>
                        <Button
                          variant={verificationMethod === "mobile" ? "default" : "outline"}
                          onClick={() => setVerificationMethod("mobile")}
                          className="flex items-center space-x-2"
                        >
                          <Smartphone className="h-4 w-4" />
                          <span>Mobile</span>
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="identifier">
                          {verificationMethod === "aadhaar" ? "Aadhaar Number" : "Mobile Number"}
                        </Label>
                        <Input
                          id="identifier"
                          placeholder={verificationMethod === "aadhaar" ? "XXXX XXXX XXXX" : "+91 XXXXX XXXXX"}
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          maxLength={verificationMethod === "aadhaar" ? 12 : 10}
                        />
                      </div>

                      {otpSent && (
                        <div className="space-y-2">
                          <Label htmlFor="otp">OTP</Label>
                          <Input
                            id="otp"
                            placeholder="6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                          />
                        </div>
                      )}

                      {error && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="flex space-x-2">
                        {!otpSent ? (
                          <Button onClick={handleSendOTP} disabled={isLoading} className="flex-1">
                            {isLoading ? "Sending..." : "Send OTP"}
                          </Button>
                        ) : (
                          <Button onClick={handleVerifyOTP} disabled={isLoading} className="flex-1">
                            {isLoading ? "Verifying..." : "Verify OTP"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Information */}
                {verifiedFamily && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Verified Customer</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-muted-foreground">Head of Family</Label>
                          <p className="font-medium">{verifiedFamily.head_name}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Mobile</Label>
                          <p className="font-medium">{verifiedFamily.head_mobile}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Ration Card</Label>
                          <p className="font-medium">{verifiedFamily.ration_card_number}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Card Type</Label>
                          <Badge variant="outline">{verifiedFamily.ration_card_type}</Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-muted-foreground">Address</Label>
                        <p className="text-sm">{verifiedFamily.address}</p>
                      </div>

                      <div>
                        <Label className="text-sm text-muted-foreground">Family Members</Label>
                        <div className="mt-2 space-y-2">
                          {verifiedFamily.members.map((member) => (
                            <div key={member.member_id} className="flex justify-between items-center p-2 border rounded">
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {member.relation_to_head} • {member.age} years • {member.gender}
                                </p>
                              </div>
                              <Badge variant="secondary">{member.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="distribute" className="space-y-6">
              {verifiedFamily && quota ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5" />
                      <span>Distribution Items</span>
                    </CardTitle>
                    <CardDescription>Adjust quantities and distribute ration items</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Entitled Quantity</TableHead>
                          <TableHead>Distribute Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {distributionItems.map((item, index) => (
                          <TableRow key={item.name}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              {quota[item.name.toLowerCase() as keyof RationQuota]} {item.unit}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(index, Number(e.target.value))}
                                min="0"
                                max={quota[item.name.toLowerCase() as keyof RationQuota]}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>₹{item.price}</TableCell>
                            <TableCell>₹{item.quantity * item.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="text-lg font-medium">Total Amount:</span>
                      <span className="text-xl font-bold">
                        ₹{distributionItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)}
                      </span>
                    </div>

                    <div className="flex space-x-4">
                      <Button onClick={handleDistribute} disabled={isLoading} className="flex-1">
                        {isLoading ? "Distributing..." : "Complete Distribution"}
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setVerifiedFamily(null)
                        setQuota(null)
                        setDistributionItems([])
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <UserCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Customer Verified</h3>
                      <p className="text-muted-foreground">
                        Please verify a customer first to proceed with distribution
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Receipt className="h-5 w-5" />
                    <span>Recent Distributions</span>
                  </CardTitle>
                  <CardDescription>Today's distribution records</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Family ID</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentDistributions.map((distribution) => (
                        <TableRow key={distribution.id}>
                          <TableCell>
                            {new Date(distribution.date).toLocaleTimeString()}
                          </TableCell>
                          <TableCell>{distribution.family_id}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {distribution.items.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item.quantity} {item.unit} {item.name}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>₹{distribution.total_amount}</TableCell>
                          <TableCell>
                            <Badge variant={distribution.status === "completed" ? "default" : "secondary"}>
                              {distribution.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
