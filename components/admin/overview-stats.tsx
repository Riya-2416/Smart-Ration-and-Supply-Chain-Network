import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Users, Package, IndianRupee, TrendingUp, TrendingDown } from "lucide-react"

const stats = [
  {
    title: "Active Shops",
    value: "1,247",
    change: "+12 this month",
    changeType: "positive" as const,
    icon: Store,
  },
  {
    title: "Registered Users",
    value: "2.5M",
    change: "+15.2% from last month",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Monthly Distribution",
    value: "45,230 tons",
    change: "-2.1% from last month",
    changeType: "negative" as const,
    icon: Package,
  },
  {
    title: "Revenue Generated",
    value: "₹12.4 Cr",
    change: "+8.7% from last month",
    changeType: "positive" as const,
    icon: IndianRupee,
  },
]

export function OverviewStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {stat.changeType === "positive" ? (
                <TrendingUp className="h-3 w-3 text-primary" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span className={stat.changeType === "positive" ? "text-primary" : "text-destructive"}>
                {stat.change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
