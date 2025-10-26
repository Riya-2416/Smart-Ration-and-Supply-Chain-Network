import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const {
      distribution_id,
      family_id,
      items,
      total_amount,
      mobile
    } = await request.json()

    if (!distribution_id || !family_id || !items || !total_amount) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Generate receipt content
    const receiptContent = generateReceiptContent({
      distribution_id,
      family_id,
      items,
      total_amount,
      date: new Date().toISOString()
    })

    // Send SMS with receipt
    if (mobile) {
      try {
        const smsResponse = await fetch("/api/sms/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: mobile,
            message: receiptContent
          }),
        })

        if (!smsResponse.ok) {
          console.error("Failed to send SMS receipt")
        }
      } catch (error) {
        console.error("SMS sending error:", error)
      }
    }

    // Store receipt in database
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000"
    const response = await fetch(`${API_BASE}/receipts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        distribution_id,
        family_id,
        items,
        total_amount,
        receipt_content: receiptContent,
        sent_via_sms: !!mobile
      }),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

function generateReceiptContent({
  distribution_id,
  family_id,
  items,
  total_amount,
  date
}: {
  distribution_id: string
  family_id: number
  items: Array<{ name: string; quantity: number; unit: string; price: number }>
  total_amount: number
  date: string
}): string {
  const receiptDate = new Date(date).toLocaleDateString('en-IN')
  const receiptTime = new Date(date).toLocaleTimeString('en-IN')
  
  let content = `🏪 SMART RATION RECEIPT\n`
  content += `═══════════════════════\n`
  content += `Receipt ID: ${distribution_id}\n`
  content += `Family ID: ${family_id}\n`
  content += `Date: ${receiptDate}\n`
  content += `Time: ${receiptTime}\n\n`
  
  content += `📦 ITEMS DISTRIBUTED:\n`
  content += `─────────────────────\n`
  
  items.forEach(item => {
    const itemTotal = item.quantity * item.price
    content += `• ${item.name}: ${item.quantity} ${item.unit} × ₹${item.price} = ₹${itemTotal}\n`
  })
  
  content += `─────────────────────\n`
  content += `💰 TOTAL AMOUNT: ₹${total_amount}\n\n`
  
  content += `✅ Distribution completed successfully!\n`
  content += `Thank you for using Smart Ration System.\n\n`
  content += `For queries, contact: 1800-XXX-XXXX`
  
  return content
}
