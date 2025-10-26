"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, MapPin, Users, Package, Clock } from "lucide-react"

const shops = [
  {
    id: "SH-127",
    name: "Shop #127",
    location: "Andheri West, Mumbai",
    operator: "Rajesh Kumar",
    status: "online",
    customers: 1247,
    inventory: 85,
    lastActive: "2 min ago",
    revenue: "₹8,450",
  },
  {
    id: "SH-089",
    name: "Shop #89",
    location: "Bandra East, Mumbai",
    operator: "Priya Sharma",
    status: "offline",
    customers: 892,
    inventory: 45,
    lastActive: "1 hour ago",
    revenue: "₹6,230",
  },
  {
    id: "SH-156",
    name: "Shop #156",
    location: "Thane West",
    operator: "Amit Patel",
    status: "online",
    customers: 1456,
    inventory: 92,
    lastActive: "5 min ago",
    revenue: "₹9,870",
  },
  {
    id: "SH-203",
    name: "Shop #203",
    location: "Borivali East, Mumbai",
    operator: "Sunita Devi",
    status: "maintenance",
    customers: 734,
    inventory: 0,
    lastActive: "3 hours ago",
    revenue: "₹4,120",
  },
]

export function ShopManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredShops = shops.filter(
    (shop) =>
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.operator.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shops by name, location, or operator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>Add New Shop</Button>
          </div>
        </CardContent>
      </Card>

      {/* Shop Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Total Shops</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">1,198</p>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">2.5M</p>
                <p className="text-sm text-muted-foreground">Customers Served</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-sm text-muted-foreground">Avg Inventory</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shops Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Directory</CardTitle>
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
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{shop.name}</p>
                      <p className="text-sm text-muted-foreground">{shop.location}</p>
                    </div>
                  </TableCell>
                  <TableCell>{shop.operator}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        shop.status === "online" ? "secondary" : shop.status === "offline" ? "destructive" : "default"
                      }
                      className={
                        shop.status === "online"
                          ? "bg-primary/10 text-primary"
                          : shop.status === "maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                      }
                    >
                      {shop.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{shop.customers.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{shop.inventory}%</span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          shop.inventory > 70 ? "bg-primary" : shop.inventory > 30 ? "bg-yellow-500" : "bg-destructive"
                        }`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{shop.revenue}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{shop.lastActive}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Shop</DropdownMenuItem>
                        <DropdownMenuItem>View Inventory</DropdownMenuItem>
                        <DropdownMenuItem>Contact Operator</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
