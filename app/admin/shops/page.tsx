"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Store, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Package, 
  TrendingUp,
  Edit,
  Trash2,
  Eye
} from "lucide-react"

interface Shop {
  id: string
  name: string
  operator: string
  location: string
  status: "online" | "offline" | "maintenance"
  customers: number
  inventory: number
  revenue: number
  lastActive: string
}

export default function ShopManagementPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadShops()
  }, [])

  const loadShops = async () => {
    // Mock data - replace with actual API call
    const mockShops: Shop[] = [
      {
        id: "1",
        name: "Vashivali Ration Shop",
        operator: "Rajesh Kumar",
        location: "Vashivali, Khalapur, Raigad",
        status: "online",
        customers: 1250,
        inventory: 85,
        revenue: 45000,
        lastActive: "2024-01-15T10:30:00Z"
      },
      {
        id: "2",
        name: "Khalapur Central Shop",
        operator: "Priya Sharma",
        location: "Khalapur, Raigad",
        status: "online",
        customers: 980,
        inventory: 72,
        revenue: 38000,
        lastActive: "2024-01-15T09:15:00Z"
      },
      {
        id: "3",
        name: "Pen Ration Center",
        operator: "Amit Patel",
        location: "Pen, Raigad",
        status: "offline",
        customers: 750,
        inventory: 45,
        revenue: 28000,
        lastActive: "2024-01-14T16:45:00Z"
      },
      {
        id: "4",
        name: "Alibaug Distribution Center",
        operator: "Sunita Singh",
        location: "Alibaug, Raigad",
        status: "maintenance",
        customers: 1100,
        inventory: 0,
        revenue: 42000,
        lastActive: "2024-01-13T14:20:00Z"
      }
    ]

    setShops(mockShops)
    setIsLoading(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>
      case "offline":
        return <Badge variant="secondary">Offline</Badge>
      case "maintenance":
        return <Badge variant="destructive">Maintenance</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalShops = shops.length
  const onlineShops = shops.filter(shop => shop.status === "online").length
  const totalCustomers = shops.reduce((sum, shop) => sum + shop.customers, 0)
  const avgInventory = Math.round(shops.reduce((sum, shop) => sum + shop.inventory, 0) / shops.length)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading shop data...</p>
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
            <div>
              <h1 className="text-3xl font-bold">Shop Management</h1>
              <p className="text-muted-foreground">Monitor and manage all ration shops across the network</p>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search shops by name, location, or operator..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Shop
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalShops.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Active shops in network</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Online</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{onlineShops}</div>
                  <p className="text-xs text-muted-foreground">Currently operational</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customers Served</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(totalCustomers / 1000).toFixed(1)}M</div>
                  <p className="text-xs text-muted-foreground">Total beneficiaries</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Inventory</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{avgInventory}%</div>
                  <p className="text-xs text-muted-foreground">Stock levels</p>
                </CardContent>
              </Card>
            </div>

            {/* Shop Directory */}
            <Card>
              <CardHeader>
                <CardTitle>Shop Directory</CardTitle>
                <CardDescription>Complete list of all ration shops in the network</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shop Details</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Customers</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShops.map((shop) => (
                      <TableRow key={shop.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{shop.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {shop.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{shop.operator}</TableCell>
                        <TableCell>{getStatusBadge(shop.status)}</TableCell>
                        <TableCell>{shop.customers.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  shop.inventory > 70 ? 'bg-green-500' : 
                                  shop.inventory > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${shop.inventory}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{shop.inventory}%</span>
                          </div>
                        </TableCell>
                        <TableCell>₹{shop.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          {new Date(shop.lastActive).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
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
          </div>
        </main>
      </div>
    </div>
  )
}