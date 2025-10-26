import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const bookings = [
  {
    id: "BK001",
    date: "2025-01-15",
    time: "10:00 AM - 11:00 AM",
    shop: "Shop #127, Andheri West",
    status: "confirmed",
    items: ["Rice: 20kg", "Wheat: 15kg", "Sugar: 2kg"],
  },
  {
    id: "BK002",
    date: "2024-12-18",
    time: "2:00 PM - 3:00 PM",
    shop: "Shop #127, Andheri West",
    status: "completed",
    items: ["Rice: 20kg", "Wheat: 15kg"],
  },
  {
    id: "BK003",
    date: "2024-11-20",
    time: "11:00 AM - 12:00 PM",
    shop: "Shop #127, Andheri West",
    status: "completed",
    items: ["Rice: 20kg", "Wheat: 15kg", "Sugar: 2kg"],
  },
]

export function RecentBookings() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Bookings</CardTitle>
        <Button variant="outline" size="sm" className="bg-transparent">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <Badge
                    variant={booking.status === "confirmed" ? "default" : "secondary"}
                    className={booking.status === "confirmed" ? "bg-primary" : ""}
                  >
                    {booking.status}
                  </Badge>
                  <span className="text-sm font-mono text-muted-foreground">{booking.id}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.date}</span>
                    <Clock className="h-4 w-4 text-muted-foreground ml-4" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.shop}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Items: {booking.items.join(", ")}</div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  {booking.status === "confirmed" && <DropdownMenuItem>Reschedule</DropdownMenuItem>}
                  <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
