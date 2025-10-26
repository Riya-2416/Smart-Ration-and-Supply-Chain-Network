"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Package, 
  Store, 
  Users,
  TrendingDown,
  X,
  Bell,
  BellOff
} from "lucide-react"

interface SystemAlert {
  id: string
  type: "stock_low" | "shop_offline" | "system_error" | "security" | "maintenance"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  source: string
  timestamp: string
  status: "active" | "acknowledged" | "resolved"
  acknowledgedBy?: string
  resolvedAt?: string
}

export default function SystemAlertsPage() {
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    // Mock data - replace with actual API call
    const mockAlerts: SystemAlert[] = [
      {
        id: "1",
        type: "stock_low",
        severity: "high",
        title: "Critical Stock Shortage",
        description: "Rice stock is critically low at Vashivali Ration Shop. Only 50kg remaining.",
        source: "Vashivali Ration Shop",
        timestamp: "2024-01-15T10:30:00Z",
        status: "active"
      },
      {
        id: "2",
        type: "shop_offline",
        severity: "medium",
        title: "Shop Offline",
        description: "Pen Ration Center has been offline for more than 2 hours.",
        source: "Pen Ration Center",
        timestamp: "2024-01-15T08:15:00Z",
        status: "acknowledged",
        acknowledgedBy: "Admin Team"
      },
      {
        id: "3",
        type: "system_error",
        severity: "critical",
        title: "Database Connection Error",
        description: "Unable to connect to the main database. Some features may be unavailable.",
        source: "System",
        timestamp: "2024-01-15T09:45:00Z",
        status: "resolved",
        acknowledgedBy: "IT Team",
        resolvedAt: "2024-01-15T10:15:00Z"
      },
      {
        id: "4",
        type: "security",
        severity: "high",
        title: "Multiple Failed Login Attempts",
        description: "Detected 5 failed login attempts from IP 192.168.1.100 in the last 10 minutes.",
        source: "Security System",
        timestamp: "2024-01-15T11:20:00Z",
        status: "active"
      },
      {
        id: "5",
        type: "maintenance",
        severity: "low",
        title: "Scheduled Maintenance",
        description: "System maintenance scheduled for tonight from 11 PM to 1 AM.",
        source: "System",
        timestamp: "2024-01-15T12:00:00Z",
        status: "acknowledged",
        acknowledgedBy: "Operations Team"
      },
      {
        id: "6",
        type: "stock_low",
        severity: "medium",
        title: "Wheat Stock Low",
        description: "Wheat stock is below 30% at Khalapur Central Shop.",
        source: "Khalapur Central Shop",
        timestamp: "2024-01-15T13:30:00Z",
        status: "active"
      }
    ]

    setAlerts(mockAlerts)
    setIsLoading(false)
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge variant="default" className="bg-red-100 text-red-800">High</Badge>
      case "medium":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>
      case "acknowledged":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Acknowledged</Badge>
      case "resolved":
        return <Badge variant="default" className="bg-green-100 text-green-800">Resolved</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "stock_low":
        return <Package className="h-4 w-4 text-orange-500" />
      case "shop_offline":
        return <Store className="h-4 w-4 text-red-500" />
      case "system_error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "security":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: "acknowledged" as const, acknowledgedBy: "Current User" }
        : alert
    ))
  }

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: "resolved" as const, resolvedAt: new Date().toISOString() }
        : alert
    ))
  }

  const activeAlerts = alerts.filter(alert => alert.status === "active")
  const acknowledgedAlerts = alerts.filter(alert => alert.status === "acknowledged")
  const resolvedAlerts = alerts.filter(alert => alert.status === "resolved")
  const criticalAlerts = alerts.filter(alert => alert.severity === "critical")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading system alerts...</p>
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
              <h1 className="text-3xl font-bold">System Alerts</h1>
              <p className="text-muted-foreground">Monitor system health and critical alerts</p>
            </div>

            {/* Critical Alerts Banner */}
            {criticalAlerts.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{criticalAlerts.length} Critical Alert(s)</strong> require immediate attention.
                </AlertDescription>
              </Alert>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                  <Bell className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Critical</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
                  <p className="text-xs text-muted-foreground">High priority</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{acknowledgedAlerts.length}</div>
                  <p className="text-xs text-muted-foreground">Being addressed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Alerts Tabs */}
            <Tabs defaultValue="active" className="w-full">
              <TabsList>
                <TabsTrigger value="active">Active Alerts</TabsTrigger>
                <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
                <TabsTrigger value="all">All Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Alerts</CardTitle>
                    <CardDescription>Alerts that require immediate attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(alert.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{alert.title}</h4>
                              <div className="flex items-center space-x-2">
                                {getSeverityBadge(alert.severity)}
                                {getStatusBadge(alert.status)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alert.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-xs text-muted-foreground">
                                Source: {alert.source} • {new Date(alert.timestamp).toLocaleString()}
                              </div>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Acknowledge
                                </Button>
                                <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                                  <X className="h-4 w-4 mr-1" />
                                  Resolve
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="acknowledged" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Acknowledged Alerts</CardTitle>
                    <CardDescription>Alerts that have been acknowledged and are being addressed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {acknowledgedAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(alert.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{alert.title}</h4>
                              <div className="flex items-center space-x-2">
                                {getSeverityBadge(alert.severity)}
                                {getStatusBadge(alert.status)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alert.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-xs text-muted-foreground">
                                Acknowledged by: {alert.acknowledgedBy} • {new Date(alert.timestamp).toLocaleString()}
                              </div>
                              <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mark Resolved
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resolved" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resolved Alerts</CardTitle>
                    <CardDescription>Alerts that have been successfully resolved</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {resolvedAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-start space-x-4 p-4 border rounded-lg bg-green-50">
                          <div className="flex-shrink-0 mt-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{alert.title}</h4>
                              <div className="flex items-center space-x-2">
                                {getSeverityBadge(alert.severity)}
                                {getStatusBadge(alert.status)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alert.description}
                            </p>
                            <div className="text-xs text-muted-foreground mt-2">
                              Resolved by: {alert.acknowledgedBy} • {alert.resolvedAt && new Date(alert.resolvedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="all" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Alerts</CardTitle>
                    <CardDescription>Complete history of all system alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alerts.map((alert) => (
                        <div key={alert.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0 mt-1">
                            {alert.status === "resolved" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              getTypeIcon(alert.type)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{alert.title}</h4>
                              <div className="flex items-center space-x-2">
                                {getSeverityBadge(alert.severity)}
                                {getStatusBadge(alert.status)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alert.description}
                            </p>
                            <div className="text-xs text-muted-foreground mt-2">
                              Source: {alert.source} • {new Date(alert.timestamp).toLocaleString()}
                              {alert.acknowledgedBy && ` • Acknowledged by: ${alert.acknowledgedBy}`}
                              {alert.resolvedAt && ` • Resolved: ${new Date(alert.resolvedAt).toLocaleString()}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
