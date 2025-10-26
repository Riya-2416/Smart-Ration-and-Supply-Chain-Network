// SMS service for notifications and receipts
export interface SMSTemplate {
  type: "booking_confirmation" | "ration_receipt" | "stock_alert" | "system_notification"
  template: string
}

export interface SMSNotification {
  id: string
  phoneNumber: string
  message: string
  type: SMSTemplate["type"]
  timestamp: number
  status: "pending" | "sent" | "failed"
  retryCount: number
}

class SMSService {
  private notifications: SMSNotification[] = []
  private templates: Record<SMSTemplate["type"], string> = {
    booking_confirmation: `
🎫 Smart Ration Booking Confirmed
📅 Date: {date}
⏰ Time: {timeSlot}
🏪 Shop: {shopName}
📦 Items: {items}
💰 Amount: ₹{amount}
📱 Show this SMS at collection
Ref: {transactionId}
    `.trim(),

    ration_receipt: `
✅ Ration Collection Complete
📅 Date: {date}
🏪 Shop: {shopName}
📦 Items Collected:
{itemsList}
💰 Total Paid: ₹{amount}
🔐 Blockchain Hash: {blockchainHash}
📱 Digital Receipt: {receiptUrl}
Ref: {transactionId}
    `.trim(),

    stock_alert: `
📦 Stock Update - Smart Ration
🏪 {shopName}
⚠️ {itemName} stock is {status}
📊 Current Level: {currentStock}
📞 Contact: {contactNumber}
    `.trim(),

    system_notification: `
🔔 Smart Ration System Alert
📢 {message}
📅 {date}
ℹ️ For support: 1800-XXX-XXXX
    `.trim(),
  }

  public async sendBookingConfirmation(data: {
    phoneNumber: string
    customerName: string
    date: string
    timeSlot: string
    shopName: string
    items: string
    amount: number
    transactionId: string
  }): Promise<string> {
    const message = this.templates.booking_confirmation
      .replace("{date}", data.date)
      .replace("{timeSlot}", data.timeSlot)
      .replace("{shopName}", data.shopName)
      .replace("{items}", data.items)
      .replace("{amount}", data.amount.toString())
      .replace("{transactionId}", data.transactionId)

    return this.sendSMS(data.phoneNumber, message, "booking_confirmation")
  }

  public async sendRationReceipt(data: {
    phoneNumber: string
    customerName: string
    date: string
    shopName: string
    items: Array<{ name: string; quantity: number; unit: string; amount: number }>
    totalAmount: number
    blockchainHash: string
    transactionId: string
  }): Promise<string> {
    const itemsList = data.items
      .map((item) => `• ${item.name}: ${item.quantity}${item.unit} - ₹${item.amount}`)
      .join("\n")

    const receiptUrl = `https://smartration.gov.in/receipt/${data.transactionId}`

    const message = this.templates.ration_receipt
      .replace("{date}", data.date)
      .replace("{shopName}", data.shopName)
      .replace("{itemsList}", itemsList)
      .replace("{amount}", data.totalAmount.toString())
      .replace("{blockchainHash}", data.blockchainHash.substring(0, 16) + "...")
      .replace("{receiptUrl}", receiptUrl)
      .replace("{transactionId}", data.transactionId)

    return this.sendSMS(data.phoneNumber, message, "ration_receipt")
  }

  public async sendStockAlert(data: {
    phoneNumber: string
    shopName: string
    itemName: string
    status: "low" | "out of stock" | "restocked"
    currentStock: string
    contactNumber: string
  }): Promise<string> {
    const message = this.templates.stock_alert
      .replace("{shopName}", data.shopName)
      .replace("{itemName}", data.itemName)
      .replace("{status}", data.status)
      .replace("{currentStock}", data.currentStock)
      .replace("{contactNumber}", data.contactNumber)

    return this.sendSMS(data.phoneNumber, message, "stock_alert")
  }

  public async sendSystemNotification(data: {
    phoneNumber: string
    message: string
  }): Promise<string> {
    const message = this.templates.system_notification
      .replace("{message}", data.message)
      .replace("{date}", new Date().toLocaleDateString("en-IN"))

    return this.sendSMS(data.phoneNumber, message, "system_notification")
  }

  private async sendSMS(phoneNumber: string, message: string, type: SMSTemplate["type"]): Promise<string> {
    const notification: SMSNotification = {
      id: this.generateNotificationId(),
      phoneNumber: this.formatPhoneNumber(phoneNumber),
      message,
      type,
      timestamp: Date.now(),
      status: "pending",
      retryCount: 0,
    }

    this.notifications.push(notification)

    // Simulate SMS sending (in production, integrate with SMS gateway)
    try {
      await this.simulateSMSSending(notification)
      notification.status = "sent"
      console.log(`SMS sent to ${phoneNumber}:`, message)
      return notification.id
    } catch (error) {
      notification.status = "failed"
      console.error(`Failed to send SMS to ${phoneNumber}:`, error)
      throw error
    }
  }

  private async simulateSMSSending(notification: SMSNotification): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Simulate 95% success rate
    if (Math.random() < 0.95) {
      return Promise.resolve()
    } else {
      throw new Error("SMS delivery failed")
    }
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digits
    const digits = phoneNumber.replace(/\D/g, "")

    // Add country code if not present
    if (digits.length === 10) {
      return "+91" + digits
    } else if (digits.length === 12 && digits.startsWith("91")) {
      return "+" + digits
    }

    return phoneNumber
  }

  private generateNotificationId(): string {
    return "SMS" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase()
  }

  public getNotificationHistory(phoneNumber?: string): SMSNotification[] {
    let history = [...this.notifications]

    if (phoneNumber) {
      const formattedNumber = this.formatPhoneNumber(phoneNumber)
      history = history.filter((n) => n.phoneNumber === formattedNumber)
    }

    return history.sort((a, b) => b.timestamp - a.timestamp)
  }

  public getNotificationById(id: string): SMSNotification | null {
    return this.notifications.find((n) => n.id === id) || null
  }

  public async retryFailedNotification(id: string): Promise<boolean> {
    const notification = this.getNotificationById(id)
    if (!notification || notification.status !== "failed" || notification.retryCount >= 3) {
      return false
    }

    notification.retryCount++
    notification.status = "pending"

    try {
      await this.simulateSMSSending(notification)
      notification.status = "sent"
      return true
    } catch (error) {
      notification.status = "failed"
      return false
    }
  }
}

// Singleton instance
export const smsService = new SMSService()
