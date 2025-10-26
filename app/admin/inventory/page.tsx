"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Plus, Edit, Trash2, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  minThreshold: number
  maxCapacity: number
  unit: string
  price: number
  lastUpdated: string
  status: "in_stock" | "low_stock" | "out_of_stock"
}

interface ShopInventory {
  shopId: string
  shopName: string
  items: InventoryItem[]
  lastReported: string
}

export default function InventoryManagementPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [shopInventories, setShopInventories] = useState<ShopInventory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockInventory: InventoryItem[] = [
      {
        id: "1",
        name: "Rice (Basmati)",
        category: "Grains",
        currentStock: 5000,
        minThreshold: 1000,
        maxCapacity: 10000,
        unit: "kg",
        price: 25,
        lastUpdated: "2024-01-15",
        status: "in_stock"
      },
      {
        id: "2",
        name: "Wheat Flour",
        category: "Grains",
        currentStock: 3000,
        minThreshold: 800,
        maxCapacity: 8000,
        unit: "kg",
        price: 20,
        lastUpdated: "2024-01-15",
        status: "in_stock"
      },
      {
        id: "3",
        name: "Sugar",
        category: "Sweeteners",
        currentStock: 200,
        minThreshold: 500,
        maxCapacity: 2000,
        unit: "kg",
        price: 40,
        lastUpdated: "2024-01-14",
        status: "low_stock"
      },
      {
        id: "4",
        name: "Kerosene",
        category: "Fuel",
        currentStock: 0,
        minThreshold: 100,
        maxCapacity: 1000,
        unit: "liters",
        price: 60,
        lastUpdated: "2024-01-13",
        status: "out_of_stock"
      }
    ]

    const mockShopInventories: ShopInventory[] = [
      {
        shopId: "1",
        shopName: "Vashivali Ration Shop",
        lastReported: "2024-01-15T10:30:00Z",
        items: mockInventory.map(item => ({
          ...item,
          currentStock: Math.floor(item.currentStock * 0.8),
          lastUpdated: "2024-01-15"
        }))
      },
      {
        shopId: "2",
        shopName: "Khalapur Central Shop",
        lastReported: "2024-01-15T09:15:00Z",
        items: mockInventory.map(item => ({
          ...item,
          currentStock: Math.floor(item.currentStock * 0.6),
          lastUpdated: "2024-01-15"
        }))
      }
    ]

    setInventory(mockInventory)
    setShopInventories(mockShopInventories)
    setIsLoading(false)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>
      case "low_stock":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStockPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100)
  }

  const getStockTrend = (item: InventoryItem) => {
    const percentage = getStockPercentage(item.currentStock, item.maxCapacity)
    if (percentage < 20) {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    } else if (percentage < 50) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    } else {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading inventory data...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Inventory Management</h1>
                <p className="text-muted-foreground">Monitor and manage ration inventory across all shops</p>
              </div>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inventory.length}</div>
                  <p className="text-xs text-muted-foreground">Active inventory items</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {inventory.filter(item => item.status === "in_stock").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Items with good stock</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {inventory.filter(item => item.status === "low_stock").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Items need restocking</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {inventory.filter(item => item.status === "out_of_stock").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Items need immediate attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="central" className="w-full">
              <TabsList>
                <TabsTrigger value="central">Central Inventory</TabsTrigger>
                <TabsTrigger value="shops">Shop Inventories</TabsTrigger>
                <TabsTrigger value="reports">Inventory Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="central" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Central Inventory</CardTitle>
                    <CardDescription>Main inventory warehouse stock levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Current Stock</TableHead>
                          <TableHead>Min Threshold</TableHead>
                          <TableHead>Max Capacity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span>{item.currentStock} {item.unit}</span>
                                {getStockTrend(item)}
                              </div>
                            </TableCell>
                            <TableCell>{item.minThreshold} {item.unit}</TableCell>
                            <TableCell>{item.maxCapacity} {item.unit}</TableCell>
                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                            <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shops" className="space-y-6">
                {shopInventories.map((shop) => (
                  <Card key={shop.shopId}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>{shop.shopName}</CardTitle>
                          <CardDescription>
                            Last reported: {new Date(shop.lastReported).toLocaleString()}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">
                          {shop.items.filter(item => item.status === "in_stock").length} / {shop.items.length} in stock
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Current Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Stock %</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {shop.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.currentStock} {item.unit}</TableCell>
                              <TableCell>{getStatusBadge(item.status)}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        getStockPercentage(item.currentStock, item.maxCapacity) < 20 
                                          ? 'bg-red-500' 
                                          : getStockPercentage(item.currentStock, item.maxCapacity) < 50 
                                          ? 'bg-yellow-500' 
                                          : 'bg-green-500'
                                      }`}
                                      style={{ 
                                        width: `${getStockPercentage(item.currentStock, item.maxCapacity)}%` 
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {getStockPercentage(item.currentStock, item.maxCapacity)}%
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Stock Alerts</CardTitle>
                      <CardDescription>Items requiring immediate attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {inventory.filter(item => item.status !== "in_stock").map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Current: {item.currentStock} {item.unit} | Min: {item.minThreshold} {item.unit}
                              </p>
                            </div>
                            {getStatusBadge(item.status)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Restock Recommendations</CardTitle>
                      <CardDescription>Suggested restock quantities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {inventory.filter(item => item.status !== "in_stock").map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Recommended: {item.maxCapacity - item.currentStock} {item.unit}
                              </p>
                            </div>
                            <Button size="sm">Order</Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
