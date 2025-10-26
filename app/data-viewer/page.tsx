"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface FamilyData {
  family_id: number
  head_name: string
  head_age: number
  head_gender: string
  head_mobile: string
  head_aadhaar_number: string
  ration_card_number: string
  ration_card_type: string
  address: string
  family_members: number
}

interface FamilyMember {
  member_id: number
  family_id: number
  name: string
  age: number
  gender: string
  aadhaar_number: string
  status: string
  relation_to_head: string
}

export default function DataViewerPage() {
  const [families, setFamilies] = useState<FamilyData[]>([])
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [familiesRes, membersRes] = await Promise.all([
        fetch("/api/data?action=families"),
        fetch("/api/data?action=members"),
      ])

      const familiesData = await familiesRes.json()
      const membersData = await membersRes.json()

      console.log("[v0] Loaded families:", familiesData)
      console.log("[v0] Loaded members:", membersData)

      setFamilies(familiesData)
      setMembers(membersData)
    } catch (error) {
      console.error("[v0] Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMembersByFamily = (familyId: number) => {
    return members.filter((m) => m.family_id === familyId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ration Card Data Viewer</h1>
        <p className="text-muted-foreground">Viewing data from Vashivali village, Khalapur taluka, Raigad district</p>
      </div>

      <div className="grid gap-6">
        {families.map((family) => {
          const familyMembers = getMembersByFamily(family.family_id)

          return (
            <Card key={family.family_id} className="hover-lift">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{family.head_name}</CardTitle>
                    <CardDescription className="mt-1">Ration Card: {family.ration_card_number}</CardDescription>
                  </div>
                  <Badge variant="secondary">{family.ration_card_type.toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">{family.head_mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aadhaar</p>
                    <p className="font-medium">{family.head_aadhaar_number}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{family.address}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Family Members ({familyMembers.length})</h3>
                  <div className="grid gap-3">
                    {familyMembers.map((member) => (
                      <div
                        key={member.member_id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.relation_to_head} • {member.age} years • {member.gender}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Aadhaar</p>
                          <p className="text-sm font-mono">{member.aadhaar_number}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {families.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No family data found. Please check the CSV files.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
