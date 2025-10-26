"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Receipt, Scale, AlertCircle, Users } from "lucide-react"
import { blockchainService } from "@/lib/blockchain-service"
import { smsService } from "@/lib/sms-service"
import { dataService, type FamilyData, type FamilyMember, type RationQuota } from "@/lib/data-service"

export function DistributionInterface() {
  const [currentStep, setCurrentStep] = useState(1)
  const [aadhaarInput, setAadhaarInput] = useState("")
  const [verifiedMember, setVerifiedMember] = useState<FamilyMember | null>(null)
  const [familyData, setFamilyData] = useState<FamilyData | null>(null)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [remainingQuota, setRemainingQuota] = useState<RationQuota | null>(null)
  const [distributionData, setDistributionData] = useState({
    items: [
      { name: "Rice", entitled: 0, dispensed: 0, unit: "kg", price: 3 },
      { name: "Wheat", entitled: 0, dispensed: 0, unit: "kg", price: 3 },
      { name: "Sugar", entitled: 0, dispensed: 0, unit: "kg", price: 20 },
      { name: "Kerosene", entitled: 0, dispensed: 0, unit: "L", price: 25 },
    ],
  })
  const [transactionId, setTransactionId] = useState<string>("")
  const [blockchainHash, setBlockchainHash] = useState<string>("")

  const handleVerification = () => {
    const member = dataService.authenticateByAadhaar(aadhaarInput)

    if (!member) {
      alert("Aadhaar number not found or inactive")
      return
    }

    const family = dataService.getFamilyByMember(member.member_id)
    if (!family) {
      alert("Family data not found")
      return
    }

    const members = dataService.getFamilyMembers(family.family_id)
    const quota = dataService.getRemainingQuota(family.family_id)

    if (!quota) {
      alert("Unable to fetch quota information")
      return
    }

    setVerifiedMember(member)
    setFamilyData(family)
    setFamilyMembers(members)
    setRemainingQuota(quota)

    // Update entitled amounts based on remaining quota
    setDistributionData({
      items: [
        { name: "Rice", entitled: quota.rice, dispensed: 0, unit: "kg", price: 3 },
        { name: "Wheat", entitled: quota.wheat, dispensed: 0, unit: "kg", price: 3 },
        { name: "Sugar", entitled: quota.sugar, dispensed: 0, unit: "kg", price: 20 },
        { name: "Kerosene", entitled: quota.kerosene, dispensed: 0, unit: "L", price: 25 },
      ],
    })

    setCurrentStep(2)
  }

  const updateDispensed = (index: number, amount: number) => {
    setDistributionData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, dispensed: Math.max(0, amount) } : item)),
    }))
  }

  const totalAmount = distributionData.items.reduce((total, item) => total + item.dispensed * item.price, 0)

  const completeDistribution = async () => {
    if (!verifiedMember || !familyData) return

    setCurrentStep(4)

    // Record transaction in data service
    const txId = dataService.recordTransaction({
      family_id: familyData.family_id,
      member_id: verifiedMember.member_id,
      date: new Date().toISOString(),
      items: distributionData.items
        .filter((item) => item.dispensed > 0)
        .map((item) => ({
          name: item.name.toLowerCase(),
          quantity: item.dispensed,
          unit: item.unit,
          price: item.price,
        })),
      total_amount: totalAmount,
      blockchain_hash: "",
    })

    // Create blockchain transaction
    blockchainService.createTransaction({
      customerAadhaar: verifiedMember.aadhaar_number,
      shopId: "SH-127",
      items: distributionData.items
        .filter((item) => item.dispensed > 0)
        .map((item) => ({
          name: item.name,
          quantity: item.dispensed,
          unit: item.unit,
          price: item.price,
        })),
      totalAmount: totalAmount,
      previousHash: "",
      nonce: 0,
    })

    const block = blockchainService.mineTransactions()
    const transaction = blockchainService.getTransactionById(txId)

    if (transaction) {
      setBlockchainHash(transaction.hash)
      setTransactionId(txId)

      try {
        await smsService.sendRationReceipt({
          phoneNumber: familyData.head_mobile,
          customerName: verifiedMember.name,
          date: new Date().toLocaleDateString("en-IN"),
          shopName: "Shop #127, Vashivali",
          items: distributionData.items
            .filter((item) => item.dispensed > 0)
            .map((item) => ({
              name: item.name,
              quantity: item.dispensed,
              unit: item.unit,
              amount: item.dispensed * item.price,
            })),
          totalAmount: totalAmount,
          blockchainHash: transaction.hash,
          transactionId: txId,
        })

        console.log("[v0] SMS receipt sent to:", familyData.head_mobile)
      } catch (error) {
        console.error("[v0] Failed to send SMS receipt:", error)
      }
    }
  }

  // Step 1: Verification
  if (currentStep === 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Customer Verification</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aadhaar">Enter Aadhaar Number</Label>
            <Input
              id="aadhaar"
              placeholder="XXXX XXXX XXXX"
              maxLength={12}
              value={aadhaarInput}
              onChange={(e) => setAadhaarInput(e.target.value)}
            />
          </div>
          <Button onClick={handleVerification} className="w-full" disabled={aadhaarInput.length !== 12}>
            Verify Customer
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: "Customer Verified", icon: CheckCircle },
              { step: 2, title: "Dispense Items", icon: Scale },
              { step: 3, title: "Payment & Confirmation", icon: Package },
              { step: 4, title: "Receipt Generated", icon: Receipt },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= item.step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{item.title}</p>
                </div>
                {index < 3 && <div className="flex-1 h-px bg-border mx-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {familyData && verifiedMember && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Family Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm text-muted-foreground">Collected By</Label>
                <p className="font-medium">{verifiedMember.name}</p>
                <p className="text-sm text-muted-foreground">{verifiedMember.relation_to_head}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Head of Family</Label>
                <p className="font-medium">{familyData.head_name}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Ration Card Number</Label>
                <p className="font-mono">{familyData.ration_card_number}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Card Type</Label>
                <Badge>{familyData.ration_card_type.toUpperCase()}</Badge>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <Label className="text-sm text-muted-foreground">Family Members ({familyMembers.length})</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {familyMembers.map((member) => (
                  <Badge key={member.member_id} variant="outline">
                    {member.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Item Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="h-5 w-5" />
            <span>Ration Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {distributionData.items.map((item, index) => (
              <div key={item.name} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Remaining: {item.entitled}
                      {item.unit} | Price: ₹{item.price}/{item.unit}
                    </p>
                  </div>
                  <Badge variant={item.dispensed === item.entitled ? "default" : "secondary"}>
                    {item.dispensed === item.entitled ? "Complete" : "Pending"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 items-end">
                  <div>
                    <Label htmlFor={`dispense-${index}`} className="text-sm">
                      Dispense Amount ({item.unit})
                    </Label>
                    <Input
                      id={`dispense-${index}`}
                      type="number"
                      value={item.dispensed}
                      onChange={(e) => updateDispensed(index, Number.parseFloat(e.target.value) || 0)}
                      max={item.entitled}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Amount</Label>
                    <p className="text-lg font-bold">₹{(item.dispensed * item.price).toFixed(2)}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => updateDispensed(index, item.entitled)}
                    disabled={item.dispensed === item.entitled || item.entitled === 0}
                    className="bg-transparent"
                  >
                    Fill Complete
                  </Button>
                </div>

                {item.dispensed > item.entitled && (
                  <div className="flex items-center space-x-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Amount exceeds remaining quota</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {distributionData.items
              .filter((item) => item.dispensed > 0)
              .map((item) => (
                <div key={item.name} className="flex justify-between">
                  <span>
                    {item.name} ({item.dispensed}
                    {item.unit})
                  </span>
                  <span>₹{(item.dispensed * item.price).toFixed(2)}</span>
                </div>
              ))}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={completeDistribution}
              disabled={currentStep >= 4 || totalAmount === 0}
            >
              {currentStep >= 4 ? "Distribution Completed" : "Complete Distribution & Generate Receipt"}
            </Button>

            {currentStep >= 4 && (
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center space-x-2 text-primary">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Transaction Completed Successfully</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    SMS receipt sent to {familyData?.head_mobile}. Quota updated for all family members.
                  </p>
                </div>

                {transactionId && (
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">Transaction ID</Label>
                      <p className="font-mono text-sm">{transactionId}</p>
                    </div>
                    {blockchainHash && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Blockchain Hash</Label>
                        <p className="font-mono text-xs break-all">{blockchainHash}</p>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setCurrentStep(1)
                    setAadhaarInput("")
                    setVerifiedMember(null)
                    setFamilyData(null)
                    setFamilyMembers([])
                    setRemainingQuota(null)
                    setTransactionId("")
                    setBlockchainHash("")
                  }}
                >
                  Process Next Customer
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
