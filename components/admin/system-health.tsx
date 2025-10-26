import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Server, Database, Wifi, Shield, AlertTriangle, CheckCircle } from "lucide-react"

const systemMetrics = [
  {
    name: "Server Uptime",
    value: 99.8,
    status: "healthy",
    icon: Server,
    description: "All systems operational",
  },
  {
    name: "Database Performance",
    value: 95.2,
    status: "healthy",
    icon: Database,
    description: "Response time: 45ms",
  },
  {
    name: "Network Connectivity",
    value: 98.5,
    status: "healthy",
    icon: Wifi,
    description: "1,247 shops connected",
  },
  {
    name: "Security Status",
    value: 100,
    status: "healthy",
    icon: Shield,
    description: "No security incidents",
  },
]

export function SystemHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          <span>System Health</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {systemMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{metric.name}</span>
                </div>
                <Badge
                  variant={metric.status === "healthy" ? "secondary" : "destructive"}
                  className={metric.status === "healthy" ? "bg-primary/10 text-primary" : ""}
                >
                  {metric.status === "healthy" ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 mr-1" />
                  )}
                  {metric.status}
                </Badge>
              </div>
              <Progress value={metric.value} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{metric.description}</span>
                <span>{metric.value}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-lg">
          <div className="flex items-center space-x-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">All Systems Operational</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Last system check: 2 minutes ago</p>
        </div>
      </CardContent>
    </Card>
  )
}
