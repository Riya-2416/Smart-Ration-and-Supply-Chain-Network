"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  MapPin,
  Phone,
  Mail,
  Eye,
  Reply
} from "lucide-react"

interface Complaint {
  id: string
  title: string
  description: string
  complainant: {
    name: string
    phone: string
    email: string
    aadhaar: string
  }
  shop: {
    name: string
    location: string
  }
  category: "stock_shortage" | "service_issue" | "fraud" | "other"
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_progress" | "resolved" | "closed"
  date: string
  assignedTo?: string
  resolution?: string
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadComplaints()
  }, [])

  const loadComplaints = async () => {
    // Mock data - replace with actual API call
    const mockComplaints: Complaint[] = [
      {
        id: "1",
        title: "Rice not available at Vashivali Shop",
        description: "The shop has been out of rice for the past 3 days. We need our monthly quota.",
        complainant: {
          name: "Rajesh Kumar",
          phone: "+91 98765 43210",
          email: "rajesh@email.com",
          aadhaar: "1234-5678-9012"
        },
        shop: {
          name: "Vashivali Ration Shop",
          location: "Vashivali, Khalapur, Raigad"
        },
        category: "stock_shortage",
        priority: "high",
        status: "pending",
        date: "2024-01-15T10:30:00Z"
      },
      {
        id: "2",
        title: "Rude behavior by shop operator",
        description: "The shop operator was very rude and refused to provide proper service.",
        complainant: {
          name: "Priya Sharma",
          phone: "+91 98765 43211",
          email: "priya@email.com",
          aadhaar: "1234-5678-9013"
        },
        shop: {
          name: "Khalapur Central Shop",
          location: "Khalapur, Raigad"
        },
        category: "service_issue",
        priority: "medium",
        status: "in_progress",
        date: "2024-01-14T15:20:00Z",
        assignedTo: "Admin Team"
      },
      {
        id: "3",
        title: "Suspected fraud in distribution",
        description: "The shop is charging extra money for ration items that should be free.",
        complainant: {
          name: "Amit Patel",
          phone: "+91 98765 43212",
          email: "amit@email.com",
          aadhaar: "1234-5678-9014"
        },
        shop: {
          name: "Pen Ration Center",
          location: "Pen, Raigad"
        },
        category: "fraud",
        priority: "urgent",
        status: "resolved",
        date: "2024-01-13T09:15:00Z",
        assignedTo: "Investigation Team",
        resolution: "Investigation completed. Shop operator suspended pending further inquiry."
      },
      {
        id: "4",
        title: "Long waiting time at shop",
        description: "Had to wait for 2 hours to get ration. Very poor service.",
        complainant: {
          name: "Sunita Singh",
          phone: "+91 98765 43213",
          email: "sunita@email.com",
          aadhaar: "1234-5678-9015"
        },
        shop: {
          name: "Alibaug Distribution Center",
          location: "Alibaug, Raigad"
        },
        category: "service_issue",
        priority: "low",
        status: "closed",
        date: "2024-01-12T14:45:00Z",
        assignedTo: "Operations Team",
        resolution: "Additional staff deployed to reduce waiting time."
      }
    ]

    setComplaints(mockComplaints)
    setIsLoading(false)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
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
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "in_progress":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "resolved":
        return <Badge variant="default" className="bg-green-100 text-green-800">Resolved</Badge>
      case "closed":
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "stock_shortage":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "service_issue":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "fraud":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const pendingComplaints = complaints.filter(c => c.status === "pending")
  const inProgressComplaints = complaints.filter(c => c.status === "in_progress")
  const resolvedComplaints = complaints.filter(c => c.status === "resolved")
  const urgentComplaints = complaints.filter(c => c.priority === "urgent")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading complaints...</p>
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
              <h1 className="text-3xl font-bold">Complaints Management</h1>
              <p className="text-muted-foreground">Monitor and resolve customer complaints and feedback</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{complaints.length}</div>
                  <p className="text-xs text-muted-foreground">All time complaints</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingComplaints.length}</div>
                  <p className="text-xs text-muted-foreground">Awaiting response</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{inProgressComplaints.length}</div>
                  <p className="text-xs text-muted-foreground">Being addressed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Urgent</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{urgentComplaints.length}</div>
                  <p className="text-xs text-muted-foreground">Require immediate attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Complaints Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Complaints</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>All Complaints</CardTitle>
                    <CardDescription>Complete list of all complaints received</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Complaint</TableHead>
                          <TableHead>Complainant</TableHead>
                          <TableHead>Shop</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {complaints.map((complaint) => (
                          <TableRow key={complaint.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getCategoryIcon(complaint.category)}
                                <div>
                                  <div className="font-medium">{complaint.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {complaint.description.substring(0, 50)}...
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{complaint.complainant.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {complaint.complainant.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{complaint.shop.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {complaint.shop.location}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                            <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                            <TableCell>
                              {new Date(complaint.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Reply className="h-4 w-4" />
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

              <TabsContent value="pending" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Complaints</CardTitle>
                    <CardDescription>Complaints awaiting initial response</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Complaint</TableHead>
                          <TableHead>Complainant</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingComplaints.map((complaint) => (
                          <TableRow key={complaint.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getCategoryIcon(complaint.category)}
                                <div>
                                  <div className="font-medium">{complaint.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {complaint.description.substring(0, 50)}...
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{complaint.complainant.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {complaint.complainant.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                            <TableCell>
                              {new Date(complaint.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm">
                                  <Reply className="h-4 w-4 mr-1" />
                                  Respond
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

              <TabsContent value="in_progress" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>In Progress Complaints</CardTitle>
                    <CardDescription>Complaints currently being addressed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Complaint</TableHead>
                          <TableHead>Assigned To</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inProgressComplaints.map((complaint) => (
                          <TableRow key={complaint.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getCategoryIcon(complaint.category)}
                                <div>
                                  <div className="font-medium">{complaint.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {complaint.description.substring(0, 50)}...
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{complaint.assignedTo}</Badge>
                            </TableCell>
                            <TableCell>{getPriorityBadge(complaint.priority)}</TableCell>
                            <TableCell>
                              {new Date(complaint.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Reply className="h-4 w-4" />
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

              <TabsContent value="resolved" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resolved Complaints</CardTitle>
                    <CardDescription>Complaints that have been resolved</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Complaint</TableHead>
                          <TableHead>Resolution</TableHead>
                          <TableHead>Resolved By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resolvedComplaints.map((complaint) => (
                          <TableRow key={complaint.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <div>
                                  <div className="font-medium">{complaint.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {complaint.description.substring(0, 50)}...
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {complaint.resolution?.substring(0, 60)}...
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{complaint.assignedTo}</Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(complaint.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
