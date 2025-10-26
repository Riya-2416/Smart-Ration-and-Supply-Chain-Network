import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, MessageSquare, FileText } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href="/book-slot" className="block">
          <Button className="w-full justify-start" size="lg">
            <Calendar className="mr-2 h-4 w-4" />
            Book New Slot
          </Button>
        </Link>

        <Link href="/find-shops" className="block">
          <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
            <MapPin className="mr-2 h-4 w-4" />
            Find Nearby Shops
          </Button>
        </Link>

        <Link href="/complaints" className="block">
          <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
            <MessageSquare className="mr-2 h-4 w-4" />
            File Complaint
          </Button>
        </Link>

        <Link href="/transactions" className="block">
          <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
            <FileText className="mr-2 h-4 w-4" />
            View Transactions
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
