"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Smartphone, CreditCard, CheckCircle } from "lucide-react"

export function VerificationPanel() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [rfidScanning, setRfidScanning] = useState(false)

  const handleRfidScan = () => {
    setRfidScanning(true)
    setIsVerifying(true)

    // Simulate RFID scan
    setTimeout(() => {
      setVerificationResult({
        success: true,
        cardNumber: "MH-12-3456-7890",
        holderName: "Riya Biswas",
        familyMembers: 4,
        entitlement: { rice: "20kg", wheat: "15kg", sugar: "2kg" },
        lastCollection: "2024-12-18",
      })
      setIsVerifying(false)
      setRfidScanning(false)
    }, 3000)
  }

  const handleOtpVerification = () => {
    setIsVerifying(true)

    // Simulate OTP verification
    setTimeout(() => {
      setVerificationResult({
        success: true,
        cardNumber: "MH-12-3456-7890",
        holderName: "Riya Biswas",
        familyMembers: 4,
        entitlement: { rice: "20kg", wheat: "15kg", sugar: "2kg" },
        lastCollection: "2024-12-18",
      })
      setIsVerifying(false)
    }, 2000)
  }

  const resetVerification = () => {
    setVerificationResult(null)
    setRfidScanning(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Customer Verification</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!verificationResult ? (
          <Tabs defaultValue="rfid" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rfid" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>RFID Card</span>
              </TabsTrigger>
              <TabsTrigger value="otp" className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span>OTP Verification</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rfid" className="mt-6">
              <div className="text-center py-8">
                {rfidScanning ? (
                  <div className="space-y-4">
                    <Shield className="h-16 w-16 text-primary mx-auto animate-pulse" />
                    <p className="text-lg font-medium">Scanning RFID Card...</p>
                    <p className="text-muted-foreground">Please keep the card near the reader</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Shield className="h-16 w-16 text-muted-foreground mx-auto" />
                    <p className="text-lg font-medium">Ready to Scan</p>
                    <p className="text-muted-foreground">Ask customer to place RFID card on the reader</p>
                    <Button onClick={handleRfidScan} disabled={isVerifying} size="lg">
                      Start RFID Scan
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="otp" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input id="aadhaar" placeholder="XXXX XXXX XXXX" maxLength={12} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input id="mobile" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input id="otp" placeholder="6-digit OTP" maxLength={6} />
                </div>
                <Button onClick={handleOtpVerification} disabled={isVerifying} className="w-full">
                  {isVerifying ? "Verifying..." : "Verify Customer"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            {/* Verification Success */}
            <div className="flex items-center space-x-2 p-4 bg-primary/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">Customer Verified Successfully</span>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Ration Card Number</Label>
                  <p className="font-mono text-lg">{verificationResult.cardNumber}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Card Holder</Label>
                  <p className="font-medium">{verificationResult.holderName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Family Members</Label>
                  <p className="font-medium">{verificationResult.familyMembers}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Monthly Entitlement</Label>
                  <div className="space-y-1">
                    <p className="text-sm">Rice: {verificationResult.entitlement.rice}</p>
                    <p className="text-sm">Wheat: {verificationResult.entitlement.wheat}</p>
                    <p className="text-sm">Sugar: {verificationResult.entitlement.sugar}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Last Collection</Label>
                  <p className="font-medium">{verificationResult.lastCollection}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button className="flex-1" size="lg">
                Process Ration Distribution
              </Button>
              <Button variant="outline" onClick={resetVerification} className="bg-transparent">
                New Customer
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
