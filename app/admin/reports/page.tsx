"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Package,
  Store,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface ReportData {
  period: string
  totalDistributions: number
  totalFamilies: number
  totalShops: number
  totalRevenue: number
  avgInventory: number
  complaints: number
  resolvedComplaints: number
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadReportData()
  }, [selectedPeriod])

  const loadReportData = async () => {
    // Mock data - replace with actual API call
    const mockData: ReportData = {
      period: selectedPeriod,
      totalDistributions: 15420,
      totalFamilies: 8750,
      totalShops: 45,
      totalRevenue: 1250000,
      avgInventory: 78,
      complaints: 125,
      resolvedComplaints: 118
    }

    setReportData(mockData)
    setIsLoading(false)
  }

  const generateReport = (type: string) => {
    console.log(`Generating ${type} report for ${selectedPeriod} period`)
    // Implement actual report generation logic
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
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading report data...</p>
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
                <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                <p className="text-muted-foreground">Generate comprehensive reports and analytics</p>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Distributions</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData?.totalDistributions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This {selectedPeriod}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Families Served</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData?.totalFamilies.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Active beneficiaries</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(reportData?.totalRevenue || 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This {selectedPeriod}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Inventory</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData?.avgInventory}%</div>
                  <p className="text-xs text-muted-foreground">Stock levels</p>
                </CardContent>
              </Card>
            </div>

            {/* Report Types */}
            <Tabs defaultValue="distribution" className="w-full">
              <TabsList>
                <TabsTrigger value="distribution">Distribution Reports</TabsTrigger>
                <TabsTrigger value="inventory">Inventory Reports</TabsTrigger>
                <TabsTrigger value="financial">Financial Reports</TabsTrigger>
                <TabsTrigger value="complaints">Complaint Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="distribution" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5" />
                        <span>Monthly Distribution Report</span>
                      </CardTitle>
                      <CardDescription>Complete distribution summary for the month</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Includes: Total distributions, shop-wise breakdown, item-wise analysis
                      </div>
                      <Button className="w-full" onClick={() => generateReport("monthly-distribution")}>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Family Coverage Report</span>
                      </CardTitle>
                      <CardDescription>Analysis of family coverage and demographics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Includes: Family demographics, coverage statistics, card type analysis
                      </div>
                      <Button className="w-full" onClick={() => generateReport("family-coverage")}>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Store className="h-5 w-5" />
                        <span>Shop Performance Report</span>
                      </CardTitle>
                      <CardDescription>Performance metrics for all shops</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Includes: Shop rankings, efficiency metrics, customer satisfaction
                      </div>
                      <Button className="w-full" onClick={() => generateReport("shop-performance")}>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5" />
                        <span>Stock Level Report</span>
                      </CardTitle>
                      <CardDescription>Current stock levels across all shops</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Includes: Current stock, low stock alerts, restock recommendations
                      </div>
                      <Button className="w-full" onClick={() => generateReport("stock-levels")}>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Inventory Movement Report</span>
                      </CardTitle>
                      <CardDescription>Inventory movement and consumption patterns</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Includes: Consumption trends, seasonal patterns, forecasting
                      </div>
                      <Button className="w-full" onClick={() => generateReport("inventory-movement")}>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Shortage Report</span>
                      </CardTitle>
                      <CardDescription>Items with low stock or shortages</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Includes: Shortage alerts, impact analysis, mitigation plans
                      </div>
                      <Button className="w-full" onClick={() => generateReport("shortages")}>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Revenue Report</span>
                      </CardTitle>
                      <CardDescription>Financial performance and revenue analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Includes: Revenue trends, shop-wise earnings, payment methods
                      </div>
                      <Button className="w-full" onClick={() => generateReport("revenue")}>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5" />
                        <span>Monthly Financial Summary</span>
                      </CardTitle>
                      <CardDescription>Comprehensive monthly financial overview</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Includes: Income, expenses, profit margins, budget analysis
                      </div>
                      <Button className="w-full" onClick={() => generateReport("monthly-financial")}>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Store className="h-5 w-5" />
                        <span>Shop Financial Performance</span>
                      </CardTitle>
                      <CardDescription>Individual shop financial performance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Includes: Shop-wise revenue, cost analysis, profitability
                      </div>
                      <Button className="w-full" onClick={() => generateReport("shop-financial")}>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="complaints" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Complaint Summary Report</span>
                      </CardTitle>
                      <CardDescription>Overview of all complaints and resolutions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Includes: Complaint trends, resolution rates, category analysis
                      </div>
                      <Button className="w-full" onClick={() => generateReport("complaint-summary")}>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Resolution Performance Report</span>
                      </CardTitle>
                      <CardDescription>Analysis of complaint resolution performance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Includes: Resolution times, success rates, team performance
                      </div>
                      <Button className="w-full" onClick={() => generateReport("resolution-performance")}>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Store className="h-5 w-5" />
                        <span>Shop Complaint Analysis</span>
                      </CardTitle>
                      <CardDescription>Complaint patterns by shop and location</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Includes: Shop-wise complaints, common issues, improvement areas
                      </div>
                      <Button className="w-full" onClick={() => generateReport("shop-complaints")}>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
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
