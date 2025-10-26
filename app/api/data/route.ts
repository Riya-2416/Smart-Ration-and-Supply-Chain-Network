import { NextResponse } from "next/server"
import { dataService } from "@/lib/data-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  try {
    switch (action) {
      case "families":
        return NextResponse.json(dataService.getAllFamilies())

      case "members":
        return NextResponse.json(dataService.getAllMembers())

      case "family":
        const familyId = searchParams.get("id")
        if (!familyId) {
          return NextResponse.json({ error: "Family ID required" }, { status: 400 })
        }
        const family = dataService.getFamilyById(Number(familyId))
        const members = dataService.getFamilyMembers(Number(familyId))
        const quota = dataService.getMonthlyQuota(Number(familyId))
        const remaining = dataService.getRemainingQuota(Number(familyId))
        return NextResponse.json({ family, members, quota, remaining })

      case "authenticate":
        const aadhaar = searchParams.get("aadhaar")
        const mobile = searchParams.get("mobile")

        if (aadhaar) {
          const member = dataService.authenticateByAadhaar(aadhaar)
          if (member) {
            const family = dataService.getFamilyByMember(member.member_id)
            return NextResponse.json({ success: true, member, family })
          }
        }

        if (mobile) {
          const family = dataService.authenticateByMobile(mobile)
          if (family) {
            const members = dataService.getFamilyMembers(family.family_id)
            return NextResponse.json({ success: true, family, members })
          }
        }

        return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 401 })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case "register_family":
        const familyId = dataService.registerNewFamily(body.familyData)
        return NextResponse.json({ success: true, familyId })

      case "register_member":
        const memberId = dataService.registerFamilyMember(body.memberData)
        return NextResponse.json({ success: true, memberId })

      case "record_transaction":
        const transactionId = dataService.recordTransaction(body.transaction)
        return NextResponse.json({ success: true, transactionId })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
