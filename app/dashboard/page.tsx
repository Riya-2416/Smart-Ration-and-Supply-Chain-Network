"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Package, 
  Bell, 
  History, 
  TrendingUp, 
  MapPin, 
  Phone,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react"
import RationBackground from "@/components/background/ration-background"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

interface FamilyData {
  family_id: number
  head_name: string
  head_mobile: string
  ration_card_number: string
  ration_card_type: string
  address: string
  family_members: number
}

interface FamilyMember {
  member_id: number
  name: string
  age: number
  gender: string
  aadhaar_number: string
  relation_to_head: string
  status: string
}

interface RationQuota {
  rice: number
  wheat: number
  sugar: number
  kerosene: number
}

interface DistributionRecord {
  id: string
  date: string
  items: Array<{
    name: string
    quantity: number
    unit: string
    price: number
  }>
  total_amount: number
  shop_name: string
  status: "completed" | "pending"
}

interface InventoryStatus {
  item: string
  available: boolean
  stock_level: "high" | "medium" | "low" | "out"
  last_updated: string
}

interface Notification {
  id: string
  type: "stock_available" | "distribution_ready" | "receipt" | "reminder"
  title: string
  message: string
  date: string
  read: boolean
}

export default function DashboardPage() {
  const [family, setFamily] = useState<FamilyData | null>(null)
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [quota, setQuota] = useState<RationQuota | null>(null)
  const [distributions, setDistributions] = useState<DistributionRecord[]>([])
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const currentUser = localStorage.getItem("currentUser")
      if (currentUser) {
        const userData = JSON.parse(currentUser)
        setFamily(userData.family)
        setMembers(userData.members || [])
        setQuota(userData.balance)

        // Load additional data
        await Promise.all([
          loadDistributionHistory(),
          loadInventoryStatus(),
          loadNotifications()
        ])
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDistributionHistory = async () => {
    // Mock data - replace with actual API call
    const mockDistributions: DistributionRecord[] = [
      {
        id: "1",
        date: "2024-01-15T10:30:00Z",
        items: [
          { name: "Rice", quantity: 5, unit: "kg", price: 25 },
          { name: "Wheat", quantity: 4, unit: "kg", price: 20 },
          { name: "Sugar", quantity: 1, unit: "kg", price: 40 }
        ],
        total_amount: 245,
        shop_name: "Vashivali Ration Shop",
        status: "completed"
      },
      {
        id: "2",
        date: "2024-01-01T09:15:00Z",
        items: [
          { name: "Rice", quantity: 5, unit: "kg", price: 25 },
          { name: "Wheat", quantity: 4, unit: "kg", price: 20 },
          { name: "Sugar", quantity: 1, unit: "kg", price: 40 },
          { name: "Kerosene", quantity: 2, unit: "liters", price: 60 }
        ],
        total_amount: 365,
        shop_name: "Vashivali Ration Shop",
        status: "completed"
      }
    ]
    setDistributions(mockDistributions)
  }

  const loadInventoryStatus = async () => {
    // Mock data - replace with actual API call
    const mockInventory: InventoryStatus[] = [
      { item: "Rice", available: true, stock_level: "high", last_updated: "2024-01-15T10:00:00Z" },
      { item: "Wheat", available: true, stock_level: "high", last_updated: "2024-01-15T10:00:00Z" },
      { item: "Sugar", available: true, stock_level: "medium", last_updated: "2024-01-15T10:00:00Z" },
      { item: "Kerosene", available: false, stock_level: "out", last_updated: "2024-01-14T15:30:00Z" }
    ]
    setInventoryStatus(mockInventory)
  }

  const loadNotifications = async () => {
    // Mock data - replace with actual API call
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "receipt",
        title: "Distribution Receipt",
        message: "Your ration distribution for January 2024 has been completed. Receipt sent via SMS.",
        date: "2024-01-15T10:35:00Z",
        read: false
      },
      {
        id: "2",
        type: "stock_available",
        title: "Stock Available",
        message: "Rice and Wheat are now available at Vashivali Ration Shop. You can collect your ration.",
        date: "2024-01-15T08:00:00Z",
        read: true
      },
      {
        id: "3",
        type: "reminder",
        title: "Monthly Reminder",
        message: "Don't forget to collect your monthly ration quota. Last day: January 31, 2024",
        date: "2024-01-10T12:00:00Z",
        read: true
      }
    ]
    setNotifications(mockNotifications)
  }

  const getStockBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge variant="default" className="bg-green-100 text-green-800">High Stock</Badge>
      case "medium":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Medium Stock</Badge>
      case "low":
        return <Badge variant="default" className="bg-orange-100 text-orange-800">Low Stock</Badge>
      case "out":
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "stock_available":
        return <Package className="h-4 w-4 text-green-500" />
      case "distribution_ready":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "receipt":
        return <Bell className="h-4 w-4 text-purple-500" />
      case "reminder":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <RationBackground />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <RationBackground />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-transparent to-transparent p-6 sm:p-8 mb-8">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome{family ? `, ${family.head_name}` : ""}
            </h1>
            {family && (
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Ration Card: <span className="font-mono font-semibold">{family.ration_card_number}</span>{" "}
                <span className="mx-2">•</span> Type:{" "}
                <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm">
                  {family.ration_card_type}
                </span>
              </p>
            )}
          </div>
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute right-4 bottom-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
        </section>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Family Members */}
        {members && members.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Family Members</span>
                  </CardTitle>
                  <CardDescription>Total: {members.length} members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {members.map((member) => (
                      <div
                        key={member.member_id}
                        className="rounded-xl border p-4 bg-background/60 backdrop-blur hover:bg-background transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-base">{member.name}</div>
                            <div className="text-sm text-muted-foreground mt-0.5">
                              {member.relation_to_head} • {member.gender} • {member.age} years
                            </div>
                          </div>
                          <Badge variant="secondary">#{member.member_id}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-3 font-mono">
                          Aadhaar: {member.aadhaar_number}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Monthly Quota */}
            {quota && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Monthly Quota</span>
                  </CardTitle>
                  <CardDescription>Your entitled ration for this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{quota.rice}</div>
                      <div className="text-sm text-muted-foreground">kg Rice</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{quota.wheat}</div>
                      <div className="text-sm text-muted-foreground">kg Wheat</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{quota.sugar}</div>
                      <div className="text-sm text-muted-foreground">kg Sugar</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{quota.kerosene}</div>
                      <div className="text-sm text-muted-foreground">L Kerosene</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Inventory Status</span>
                </CardTitle>
                <CardDescription>Current stock availability at your assigned ration shop</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryStatus.map((item) => (
                      <TableRow key={item.item}>
                        <TableCell className="font-medium">{item.item}</TableCell>
                        <TableCell>
                          <Badge variant={item.available ? "default" : "destructive"}>
                            {item.available ? "Available" : "Not Available"}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStockBadge(item.stock_level)}</TableCell>
                        <TableCell>
                          {new Date(item.last_updated).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Alert>
              <Bell className="h-4 w-4" />
              <AlertDescription>
                You will receive SMS notifications when ration items become available at your assigned shop.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Distribution History</span>
                </CardTitle>
                <CardDescription>Your recent ration distributions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Shop</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {distributions.map((distribution) => (
                      <TableRow key={distribution.id}>
                        <TableCell>
                          {new Date(distribution.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{distribution.shop_name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {distribution.items.map((item, index) => (
                              <div key={index} className="text-sm">
                                {item.quantity} {item.unit} {item.name}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>₹{distribution.total_amount}</TableCell>
                        <TableCell>
                          <Badge variant={distribution.status === "completed" ? "default" : "secondary"}>
                            {distribution.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </CardTitle>
                <CardDescription>Your recent notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-3 p-4 border rounded-lg ${
                        !notification.read ? "bg-primary/5 border-primary/20" : ""
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
            </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-primary rounded-full"></div>
          </div>
        )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

