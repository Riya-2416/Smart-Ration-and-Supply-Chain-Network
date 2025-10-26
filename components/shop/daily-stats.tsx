import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Package, IndianRupee, Clock } from "lucide-react"

export function DailyStats() {
  const stats = [
    {
      title: "Customers Served",
      value: "47",
      icon: Users,
      change: "+12 from yesterday",
      changeType: "positive" as const,
    },
    {
      title: "Items Distributed",
      value: "1,240kg",
      icon: Package,
      change: "Rice: 580kg, Wheat: 420kg",
      changeType: "neutral" as const,
    },
    {
      title: "Revenue Generated",
      value: "₹8,450",
      icon: IndianRupee,
      change: "+₹1,200 from yesterday",
      changeType: "positive" as const,
    },
    {
      title: "Avg. Service Time",
      value: "3.2 min",
      icon: Clock,
      change: "-0.5 min improvement",
      changeType: "positive" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Shop Status</span>
            <Badge className="bg-primary">
              <Clock className="h-3 w-3 mr-1" />
              Open
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Operating hours: 9:00 AM - 6:00 PM</p>
        </div>
      </CardContent>
    </Card>
  )
}
