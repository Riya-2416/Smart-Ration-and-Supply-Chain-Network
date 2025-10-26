"use client"

import { useEffect, useState } from "react"
import { DistributionForm } from "@/components/distribution/distribution-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DistributePage() {
  const [userData, setUserData] = useState<any>(null)
  const [balance, setBalance] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(user)
    setUserData(parsedUser)

    // Fetch current balance
    fetchBalance(parsedUser.family.family_id)
  }, [router])

  const fetchBalance = async (familyId: number) => {
    try {
      const response = await fetch(`/api/balance/current?familyId=${familyId}`)
      const data = await response.json()

      if (data.success) {
        setBalance(data.balance)
      }
    } catch (error) {
      console.error("[v0] Balance fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    // Refresh balance after successful distribution
    if (userData?.family?.family_id) {
      fetchBalance(userData.family.family_id)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Distribute Rations</h1>
          <p className="text-muted-foreground">Record ration distribution for {userData.family.head_name}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Family Information</CardTitle>
              <CardDescription>Ration card details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Card Number</p>
                <p className="font-medium">{userData.family.ration_card_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Card Type</p>
                <p className="font-medium uppercase">{userData.family.ration_card_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Family Members</p>
                <p className="font-medium">{userData.family.family_members_count}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Balance</CardTitle>
              <CardDescription>Remaining quota for this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Rice</p>
                  <p className="text-lg font-semibold">{balance?.rice_remaining || 0} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wheat</p>
                  <p className="text-lg font-semibold">{balance?.wheat_remaining || 0} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sugar</p>
                  <p className="text-lg font-semibold">{balance?.sugar_remaining || 0} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kerosene</p>
                  <p className="text-lg font-semibold">{balance?.kerosene_remaining || 0} L</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DistributionForm
          familyId={userData.family.family_id}
          shopId={1}
          members={userData.members || []}
          balance={balance}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  )
}
