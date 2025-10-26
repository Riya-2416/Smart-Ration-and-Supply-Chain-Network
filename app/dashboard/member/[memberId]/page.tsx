import { cookies } from "next/headers"
import RationBackground from "@/components/background/ration-background"
import AssignShopForm from "@/components/dashboard/assign-shop-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function MemberDetailsPage({ params }: { params: { memberId: string } }) {
  const cookieStore = await cookies()
  const session = cookieStore.get("smart_ration_session")?.value
  const memberId = Number(params.memberId)
  let member: any = null
  let family: any = null
  let shops: any[] = []

  try {
    if (session) {
      const parsed = JSON.parse(session)
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
      const famRes = await fetch(`${API_BASE}/families/${parsed.familyId}`, { cache: "no-store" })
      if (famRes.ok) {
        const data = await famRes.json()
        family = data.family
        member = (data.members || []).find((m: any) => Number(m.member_id) === memberId) || null
      }
      const shopsRes = await fetch(`${API_BASE}/shops`, { cache: "no-store" })
      if (shopsRes.ok) {
        const s = await shopsRes.json()
        shops = s.shops || []
      }
    }
  } catch {}

  return (
    <div className="min-h-screen bg-background">
      <RationBackground />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-3">
          <a href="/dashboard" className="text-sm text-primary">← Back to dashboard</a>
        </div>

        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-transparent to-transparent p-6 sm:p-8 mt-4">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{member ? member.name : "Member"}</h1>
            {family && (
              <p className="text-sm sm:text-base text-muted-foreground mt-2">Family: {family.head_name} <span className="mx-2">•</span> Card: <span className="font-mono font-semibold">{family.ration_card_number}</span></p>
            )}
          </div>
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute right-4 bottom-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
        </section>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border p-4 sm:p-6 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm">
            <h2 className="font-semibold mb-3">Member Details</h2>
            {member ? (
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Relation: {member.relation_to_head}</li>
                <li>Gender: {member.gender}</li>
                <li>Age: {member.age ?? "-"}</li>
                <li>Aadhaar: {member.aadhaar_number}</li>
                <li>Status: {member.status}</li>
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Member not found.</p>
            )}
          </div>

          <RationItems family={family} />
          <div className="rounded-xl border p-4 sm:p-6 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm">
            <h2 className="font-semibold mb-3">Assign Nearby Shop</h2>
            <AssignShopForm memberId={memberId} current={member?.preferred_fps_id} shops={shops} />
          </div>
        </div>
      </main>
    </div>
  )
}

// client form moved to components/dashboard/assign-shop-form


function RationItems({ family }: { family: any }) {
  // Derive demo entitlements by card type + family size.
  const size = Number(family?.family_members || 1)
  const type = String(family?.ration_card_type || '').toLowerCase()
  // Simple illustrative mapping (keep consistent with seed):
  function getQuota() {
    if (!type) return { rice: 0, wheat: 0, sugar: 0, kerosene: 0 }
    if (type === 'white' || type === 'orange' || type === 'apl') {
      if (size <= 2) return { rice: 5, wheat: 5, sugar: 0.5, kerosene: 1 }
      if (size <= 4) return { rice: 10, wheat: 10, sugar: 0.5, kerosene: 2 }
      return { rice: 15, wheat: 15, sugar: 0.5, kerosene: 3 }
    }
    if (type === 'yellow' || type === 'bpl') {
      if (size <= 2) return { rice: 10, wheat: 5, sugar: 1, kerosene: 2 }
      if (size <= 4) return { rice: 15, wheat: 10, sugar: 1, kerosene: 3 }
      return { rice: 20, wheat: 15, sugar: 1, kerosene: 4 }
    }
    // AAY / pink
    return { rice: 35, wheat: 0, sugar: 1, kerosene: 2 + Math.max(0, Math.ceil((size - 2) / 2)) }
  }
  const quota = getQuota()

  const items = [
    { name: 'Rice', qty: `${quota.rice} kg`, key: 'rice' },
    { name: 'Wheat', qty: `${quota.wheat} kg`, key: 'wheat' },
    { name: 'Sugar', qty: `${quota.sugar} kg`, key: 'sugar' },
    { name: 'Kerosene', qty: `${quota.kerosene} L`, key: 'kerosene' },
  ]

  return (
    <Card className="rounded-xl border p-0 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm">
      <CardHeader>
        <CardTitle className="font-semibold">Ration Entitlements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((it) => (
            <div key={it.key} className="text-center rounded-lg border p-4 bg-background">
              <p className="text-2xl font-bold text-primary leading-none">{it.qty}</p>
              <p className="text-sm text-muted-foreground mt-1">{it.name}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">These monthly quotas are derived from card type ({family?.ration_card_type || '-'}) and family size ({size}).</p>
      </CardContent>
    </Card>
  )
}

