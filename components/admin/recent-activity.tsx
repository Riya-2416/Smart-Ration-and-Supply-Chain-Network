import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Store, User, Package, AlertTriangle, CheckCircle } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "shop_status",
    message: "Shop #127 (Andheri West) went offline",
    timestamp: "2 minutes ago",
    status: "warning",
    icon: Store,
  },
  {
    id: 2,
    type: "inventory",
    message: "Low stock alert: Sugar at Shop #89 (Bandra East)",
    timestamp: "15 minutes ago",
    status: "alert",
    icon: Package,
  },
  {
    id: 3,
    type: "user_registration",
    message: "125 new user registrations in Mumbai region",
    timestamp: "1 hour ago",
    status: "info",
    icon: User,
  },
  {
    id: 4,
    type: "system",
    message: "Daily backup completed successfully",
    timestamp: "2 hours ago",
    status: "success",
    icon: CheckCircle,
  },
  {
    id: 5,
    type: "complaint",
    message: "New complaint filed: Shop #156 (Thane)",
    timestamp: "3 hours ago",
    status: "warning",
    icon: AlertTriangle,
  },
  {
    id: 6,
    type: "distribution",
    message: "Peak distribution hours: 2:00 PM - 4:00 PM",
    timestamp: "4 hours ago",
    status: "info",
    icon: Activity,
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
        <Button variant="outline" size="sm" className="bg-transparent">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-lg">
              <div
                className={`p-2 rounded-lg ${
                  activity.status === "success"
                    ? "bg-primary/10 text-primary"
                    : activity.status === "warning"
                      ? "bg-yellow-100 text-yellow-800"
                      : activity.status === "alert"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                }`}
              >
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
              <Badge
                variant={
                  activity.status === "success"
                    ? "secondary"
                    : activity.status === "warning"
                      ? "default"
                      : activity.status === "alert"
                        ? "destructive"
                        : "secondary"
                }
                className={
                  activity.status === "success"
                    ? "bg-primary/10 text-primary"
                    : activity.status === "warning"
                      ? "bg-yellow-100 text-yellow-800"
                      : ""
                }
              >
                {activity.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
