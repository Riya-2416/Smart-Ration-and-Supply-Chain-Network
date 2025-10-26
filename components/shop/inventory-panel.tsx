"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, Plus, Minus, AlertTriangle, TrendingUp } from "lucide-react"

const initialInventory = [
  { id: 1, item: "Rice", current: 850, capacity: 1000, unit: "kg", price: 3, status: "good" },
  { id: 2, item: "Wheat", current: 450, capacity: 1000, unit: "kg", price: 3, status: "medium" },
  { id: 3, item: "Sugar", current: 150, capacity: 500, unit: "kg", price: 20, status: "low" },
  { id: 4, item: "Oil", current: 250, capacity: 300, unit: "L", price: 50, status: "good" },
]

export function InventoryPanel() {
  const [inventory, setInventory] = useState(initialInventory)
  const [updateMode, setUpdateMode] = useState<number | null>(null)

  const updateStock = (id: number, newAmount: number) => {
    setInventory((prev) => prev.map((item) => (item.id === id ? { ...item, current: Math.max(0, newAmount) } : item)))
    setUpdateMode(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Inventory Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inventory.map((item) => (
            <div key={item.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{item.item}</span>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUpdateMode(updateMode === item.id ? null : item.id)}
                >
                  Update
                </Button>
              </div>

              <div className="space-y-2">
                <Progress value={(item.current / item.capacity) * 100} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {item.current}
                    {item.unit} available
                  </span>
                  <span>
                    {item.capacity}
                    {item.unit} capacity
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Price: ₹{item.price}/{item.unit}
                </div>
              </div>

              {updateMode === item.id && (
                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <Label className="text-sm font-medium">Update Stock Level</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStock(item.id, item.current - 50)}
                      className="bg-transparent"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.current}
                      onChange={(e) => updateStock(item.id, Number.parseInt(e.target.value) || 0)}
                      className="text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStock(item.id, item.current + 50)}
                      className="bg-transparent"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Use +/- buttons for quick adjustments or enter exact amount
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4 bg-transparent">
          <Package className="h-4 w-4 mr-2" />
          Generate Inventory Report
        </Button>
      </CardContent>
    </Card>
  )
}
