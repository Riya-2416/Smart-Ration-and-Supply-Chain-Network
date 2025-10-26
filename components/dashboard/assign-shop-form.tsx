"use client"

export default function AssignShopForm({ memberId, current, shops }: { memberId: number | string; current?: string; shops: any[] }) {
  async function onSubmit(formData: FormData) {
    const fps_id = formData.get("fps_id") as string
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
	await fetch(`${API_BASE}/members/${memberId}/assign-shop`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fps_id }),
    })
	// After assigning, take user to slot booking page
	window.location.href = `/book-slot?memberId=${memberId}&fps=${encodeURIComponent(fps_id)}`
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <div className="text-sm text-muted-foreground">Current: {current || "Not set"}</div>
      <div className="grid sm:grid-cols-2 gap-3">
        <select name="fps_id" className="rounded-md border bg-background p-2">
          {shops.map((s: any) => (
            <option key={s.fps_id} value={s.fps_id}>{s.name} ({s.fps_id})</option>
          ))}
        </select>
        <button type="submit" className="rounded-md border px-4 py-2 bg-primary text-primary-foreground hover:opacity-90">Assign Shop</button>
      </div>
    </form>
  )
}


