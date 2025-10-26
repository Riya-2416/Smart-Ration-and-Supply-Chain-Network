import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, AlertTriangle } from "lucide-react"

const inventory = [
  { item: "Rice", available: 85, total: 100, unit: "kg", status: "good" },
  { item: "Wheat", available: 45, total: 100, unit: "kg", status: "medium" },
  { item: "Sugar", available: 15, total: 50, unit: "kg", status: "low" },
  { item: "Oil", available: 25, total: 30, unit: "L", status: "good" },
]

export function InventoryStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Shop Inventory Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inventory.map((item) => (
            <div key={item.item} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.item}</span>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      item.status === "good" ? "secondary" : item.status === "medium" ? "default" : "destructive"
                    }
                    className={
                      item.status === "good"
                        ? "bg-primary/10 text-primary"
                        : item.status === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                    }
                  >
                    {item.status === "good" && <TrendingUp className="h-3 w-3 mr-1" />}
                    {item.status === "low" && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {item.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <Progress value={(item.available / item.total) * 100} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {item.available}
                    {item.unit} available
                  </span>
                  <span>
                    {item.total}
                    {item.unit} total
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
