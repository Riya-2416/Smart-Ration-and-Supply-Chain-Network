// Data service for managing family and member data from CSV files

export interface FamilyData {
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

export interface FamilyMember {
  member_id: number
  family_id: number
  name: string
  age: number
  gender: string
  aadhaar_number: string
  status: string
  relation_to_head: string
}

export interface RationQuota {
  rice: number
  wheat: number
  sugar: number
  kerosene: number
}

export interface RationTransaction {
  transaction_id: string
  family_id: number
  member_id: number
  date: string
  items: Array<{
    name: string
    quantity: number
    unit: string
    price: number
  }>
  total_amount: number
  blockchain_hash: string
}

class DataService {
  private families: FamilyData[] = []
  private members: FamilyMember[] = []
  private transactions: RationTransaction[] = []
  private monthlyQuotas: Map<number, RationQuota> = new Map()

  // CSV URLs
  private readonly FAMILY_CSV_URL =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DOC-20251001-WA0005-a8gjX72Q5V5tzXe4lJFRVWXUrIwk3j.csv"
  private readonly MEMBERS_CSV_URL =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/family_members-eaqbHmUIQHB5mFDGnAMn0pgPSI9Nih.csv"

  constructor() {
    this.initializeData()
  }

  private async initializeData() {
    try {
      await Promise.all([this.loadFamilyData(), this.loadMemberData()])
      this.calculateMonthlyQuotas()
    } catch (error) {
      console.error("[v0] Failed to initialize data:", error)
    }
  }

  private async loadFamilyData() {
    try {
      const response = await fetch(this.FAMILY_CSV_URL)
      const csvText = await response.text()
      const lines = csvText.split("\n").filter((line) => line.trim())

      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i])
        if (values.length >= 10) {
          this.families.push({
            family_id: Number(values[0]),
            head_name: values[1],
            head_age: Number(values[2]),
            head_gender: values[3],
            head_mobile: values[4],
            head_aadhaar_number: values[5],
            ration_card_number: values[6],
            ration_card_type: values[7],
            address: values[8],
            family_members: Number(values[9]),
          })
        }
      }
      console.log("[v0] Loaded family data:", this.families.length, "families")
    } catch (error) {
      console.error("[v0] Error loading family data:", error)
    }
  }

  private async loadMemberData() {
    try {
      const response = await fetch(this.MEMBERS_CSV_URL)
      const csvText = await response.text()
      const lines = csvText.split("\n").filter((line) => line.trim())

      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i])
        if (values.length >= 8) {
          this.members.push({
            member_id: Number(values[0]),
            family_id: Number(values[1]),
            name: values[2],
            age: Number(values[3]),
            gender: values[4],
            aadhaar_number: values[5],
            status: values[6],
            relation_to_head: values[7],
          })
        }
      }
      console.log("[v0] Loaded member data:", this.members.length, "members")
    } catch (error) {
      console.error("[v0] Error loading member data:", error)
    }
  }

  private parseCSVLine(line: string): string[] {
    const values: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        values.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    values.push(current.trim())

    return values
  }

  private calculateMonthlyQuotas() {
    // Calculate monthly quotas based on family size and card type
    this.families.forEach((family) => {
      const baseQuota = this.getBaseQuota(family.ration_card_type)
      const multiplier = Math.min(family.family_members, 6) // Cap at 6 members

      this.monthlyQuotas.set(family.family_id, {
        rice: baseQuota.rice * multiplier,
        wheat: baseQuota.wheat * multiplier,
        sugar: baseQuota.sugar * multiplier,
        kerosene: baseQuota.kerosene * multiplier,
      })
    })
  }

  private getBaseQuota(cardType: string): RationQuota {
    // Base quota per person based on card type
    switch (cardType.toLowerCase()) {
      case "aay": // Antyodaya Anna Yojana
        return { rice: 5, wheat: 5, sugar: 1, kerosene: 2 }
      case "bpl": // Below Poverty Line
        return { rice: 4, wheat: 4, sugar: 1, kerosene: 1.5 }
      case "white":
      case "apl": // Above Poverty Line
        return { rice: 3, wheat: 3, sugar: 0.5, kerosene: 1 }
      default:
        return { rice: 3, wheat: 3, sugar: 0.5, kerosene: 1 }
    }
  }

  // Authentication methods
  public authenticateByAadhaar(aadhaar: string): FamilyMember | null {
    return this.members.find((m) => m.aadhaar_number === aadhaar && m.status === "Active") || null
  }

  public authenticateByMobile(mobile: string): FamilyData | null {
    return this.families.find((f) => f.head_mobile === mobile) || null
  }

  public authenticateByRationCard(cardNumber: string): FamilyData | null {
    return this.families.find((f) => f.ration_card_number === cardNumber) || null
  }

  // Family and member queries
  public getFamilyById(familyId: number): FamilyData | null {
    return this.families.find((f) => f.family_id === familyId) || null
  }

  public getFamilyMembers(familyId: number): FamilyMember[] {
    return this.members.filter((m) => m.family_id === familyId && m.status === "Active")
  }

  public getMemberById(memberId: number): FamilyMember | null {
    return this.members.find((m) => m.member_id === memberId) || null
  }

  public getFamilyByMember(memberId: number): FamilyData | null {
    const member = this.getMemberById(memberId)
    if (!member) return null
    return this.getFamilyById(member.family_id)
  }

  // Quota management
  public getMonthlyQuota(familyId: number): RationQuota | null {
    return this.monthlyQuotas.get(familyId) || null
  }

  public getRemainingQuota(familyId: number): RationQuota | null {
    const quota = this.getMonthlyQuota(familyId)
    if (!quota) return null

    // Calculate consumed quota from this month's transactions
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const monthTransactions = this.transactions.filter(
      (t) => t.family_id === familyId && t.date.startsWith(currentMonth),
    )

    const consumed = {
      rice: 0,
      wheat: 0,
      sugar: 0,
      kerosene: 0,
    }

    monthTransactions.forEach((transaction) => {
      transaction.items.forEach((item) => {
        const itemName = item.name.toLowerCase()
        if (itemName in consumed) {
          consumed[itemName as keyof RationQuota] += item.quantity
        }
      })
    })

    return {
      rice: Math.max(0, quota.rice - consumed.rice),
      wheat: Math.max(0, quota.wheat - consumed.wheat),
      sugar: Math.max(0, quota.sugar - consumed.sugar),
      kerosene: Math.max(0, quota.kerosene - consumed.kerosene),
    }
  }

  // Transaction management
  public recordTransaction(transaction: Omit<RationTransaction, "transaction_id">): string {
    const transactionId = this.generateTransactionId()
    const fullTransaction: RationTransaction = {
      ...transaction,
      transaction_id: transactionId,
    }
    this.transactions.push(fullTransaction)
    return transactionId
  }

  public getTransactionHistory(familyId: number): RationTransaction[] {
    return this.transactions
      .filter((t) => t.family_id === familyId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  private generateTransactionId(): string {
    return "TXN" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase()
  }

  // Registration
  public registerNewFamily(familyData: Omit<FamilyData, "family_id">): number {
    const newFamilyId = Math.max(...this.families.map((f) => f.family_id), 0) + 1
    const newFamily: FamilyData = {
      ...familyData,
      family_id: newFamilyId,
    }
    this.families.push(newFamily)
    this.calculateMonthlyQuotas()
    return newFamilyId
  }

  public registerFamilyMember(memberData: Omit<FamilyMember, "member_id">): number {
    const newMemberId = Math.max(...this.members.map((m) => m.member_id), 0) + 1
    const newMember: FamilyMember = {
      ...memberData,
      member_id: newMemberId,
    }
    this.members.push(newMember)

    // Update family member count
    const family = this.getFamilyById(memberData.family_id)
    if (family) {
      family.family_members += 1
      this.calculateMonthlyQuotas()
    }

    return newMemberId
  }

  // Get all data for admin
  public getAllFamilies(): FamilyData[] {
    return [...this.families]
  }

  public getAllMembers(): FamilyMember[] {
    return [...this.members]
  }

  public getAllTransactions(): RationTransaction[] {
    return [...this.transactions]
  }
}

// Singleton instance
export const dataService = new DataService()
