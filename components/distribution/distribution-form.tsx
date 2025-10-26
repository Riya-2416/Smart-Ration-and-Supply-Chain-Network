"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle } from "lucide-react"

interface DistributionFormProps {
  familyId: number
  shopId: number
  members: any[]
  balance: any
  onSuccess?: () => void
}

export function DistributionForm({ familyId, shopId, members, balance, onSuccess }: DistributionFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [memberId, setMemberId] = useState("")
  const [rice, setRice] = useState(0)
  const [wheat, setWheat] = useState(0)
  const [sugar, setSugar] = useState(0)
  const [kerosene, setKerosene] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("Cash")

  const ricePrice = 3 // Rs per kg
  const wheatPrice = 2 // Rs per kg
  const sugarPrice = 13.5 // Rs per kg
  const kerosenePrice = 35 // Rs per liter

  const totalAmount = rice * ricePrice + wheat * wheatPrice + sugar * sugarPrice + kerosene * kerosenePrice

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/distribution/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyId,
          shopId,
          memberId: memberId ? Number.parseInt(memberId) : null,
          rice,
          wheat,
          sugar,
          kerosene,
          totalAmount,
          paymentMethod,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        // Reset form
        setRice(0)
        setWheat(0)
        setSugar(0)
        setKerosene(0)
        setMemberId("")
        if (onSuccess) onSuccess()
      } else {
        setError(data.error || "Failed to record distribution")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Distribution</CardTitle>
        <CardDescription>Enter the quantities being distributed</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member">Family Member (Optional)</Label>
            <Select value={memberId} onValueChange={setMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.member_id} value={member.member_id.toString()}>
                    {member.name} ({member.relation_to_head})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rice">Rice (kg)</Label>
              <Input
                id="rice"
                type="number"
                min="0"
                max={balance?.rice_remaining || 0}
                step="0.1"
                value={rice}
                onChange={(e) => setRice(Number.parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Available: {balance?.rice_remaining || 0} kg</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wheat">Wheat (kg)</Label>
              <Input
                id="wheat"
                type="number"
                min="0"
                max={balance?.wheat_remaining || 0}
                step="0.1"
                value={wheat}
                onChange={(e) => setWheat(Number.parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Available: {balance?.wheat_remaining || 0} kg</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sugar">Sugar (kg)</Label>
              <Input
                id="sugar"
                type="number"
                min="0"
                max={balance?.sugar_remaining || 0}
                step="0.1"
                value={sugar}
                onChange={(e) => setSugar(Number.parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Available: {balance?.sugar_remaining || 0} kg</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kerosene">Kerosene (L)</Label>
              <Input
                id="kerosene"
                type="number"
                min="0"
                max={balance?.kerosene_remaining || 0}
                step="0.1"
                value={kerosene}
                onChange={(e) => setKerosene(Number.parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Available: {balance?.kerosene_remaining || 0} L</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">Total Amount: ₹{totalAmount.toFixed(2)}</p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {success && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <p className="text-sm">Distribution recorded successfully!</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recording...
              </>
            ) : (
              "Record Distribution"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
