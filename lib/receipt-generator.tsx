interface DistributionReceipt {
  distributionId: number
  familyName: string
  rationCardNumber: string
  date: string
  items: {
    name: string
    quantity: number
    unit: string
    price: number
    total: number
  }[]
  totalAmount: number
  paymentMethod: string
  shopName: string
  shopAddress: string
}

export function generateReceiptText(receipt: DistributionReceipt): string {
  const lines = [
    "========================================",
    "       SMART RATION DISTRIBUTION",
    "========================================",
    "",
    `Receipt No: ${receipt.distributionId}`,
    `Date: ${receipt.date}`,
    "",
    "----------------------------------------",
    "FAMILY DETAILS",
    "----------------------------------------",
    `Name: ${receipt.familyName}`,
    `Ration Card: ${receipt.rationCardNumber}`,
    "",
    "----------------------------------------",
    "ITEMS DISTRIBUTED",
    "----------------------------------------",
  ]

  receipt.items.forEach((item) => {
    if (item.quantity > 0) {
      lines.push(`${item.name}`)
      lines.push(`  ${item.quantity} ${item.unit} x ₹${item.price} = ₹${item.total.toFixed(2)}`)
    }
  })

  lines.push("")
  lines.push("----------------------------------------")
  lines.push(`TOTAL AMOUNT: ₹${receipt.totalAmount.toFixed(2)}`)
  lines.push(`Payment Method: ${receipt.paymentMethod}`)
  lines.push("----------------------------------------")
  lines.push("")
  lines.push(`Shop: ${receipt.shopName}`)
  lines.push(`${receipt.shopAddress}`)
  lines.push("")
  lines.push("Thank you for using Smart Ration!")
  lines.push("========================================")

  return lines.join("\n")
}

export function generateReceiptHTML(receipt: DistributionReceipt): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Courier New', monospace;
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .receipt {
      background: white;
      padding: 20px;
      border: 2px solid #333;
    }
    .header {
      text-align: center;
      border-bottom: 2px dashed #333;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .section {
      margin: 15px 0;
      border-bottom: 1px dashed #999;
      padding-bottom: 10px;
    }
    .item {
      margin: 8px 0;
    }
    .item-name {
      font-weight: bold;
    }
    .item-details {
      margin-left: 10px;
      color: #555;
    }
    .total {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      margin: 15px 0;
    }
    .footer {
      text-align: center;
      margin-top: 15px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h2>SMART RATION DISTRIBUTION</h2>
      <p>Receipt No: ${receipt.distributionId}</p>
      <p>${receipt.date}</p>
    </div>
    
    <div class="section">
      <strong>FAMILY DETAILS</strong>
      <p>Name: ${receipt.familyName}</p>
      <p>Ration Card: ${receipt.rationCardNumber}</p>
    </div>
    
    <div class="section">
      <strong>ITEMS DISTRIBUTED</strong>
      ${receipt.items
        .filter((item) => item.quantity > 0)
        .map(
          (item) => `
        <div class="item">
          <div class="item-name">${item.name}</div>
          <div class="item-details">${item.quantity} ${item.unit} x ₹${item.price} = ₹${item.total.toFixed(2)}</div>
        </div>
      `,
        )
        .join("")}
    </div>
    
    <div class="total">
      TOTAL: ₹${receipt.totalAmount.toFixed(2)}
    </div>
    
    <div class="section">
      <p>Payment Method: ${receipt.paymentMethod}</p>
    </div>
    
    <div class="footer">
      <p>${receipt.shopName}</p>
      <p>${receipt.shopAddress}</p>
      <p>Thank you for using Smart Ration!</p>
    </div>
  </div>
</body>
</html>
  `
}
