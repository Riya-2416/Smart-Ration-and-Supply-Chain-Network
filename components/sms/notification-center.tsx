"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Send, Clock, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { smsService, type SMSNotification } from "@/lib/sms-service"

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<SMSNotification[]>([])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = () => {
    const history = smsService.getNotificationHistory()
    setNotifications(history)
  }

  const sendCustomNotification = async () => {
    if (!phoneNumber || !customMessage) return

    setIsLoading(true)
    try {
      await smsService.sendSystemNotification({
        phoneNumber,
        message: customMessage,
      })
      setPhoneNumber("")
      setCustomMessage("")
      loadNotifications()
    } catch (error) {
      console.error("Failed to send notification:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const retryNotification = async (id: string) => {
    const success = await smsService.retryFailedNotification(id)
    if (success) {
      loadNotifications()
    }
  }

  const getStatusIcon = (status: SMSNotification["status"]) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: SMSNotification["status"]) => {
    switch (status) {
      case "sent":
        return "bg-primary/10 text-primary"
      case "failed":
        return ""
      case "pending":
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>SMS Notification Center</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Notification History</TabsTrigger>
              <TabsTrigger value="send">Send Custom SMS</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recent Notifications</h3>
                  <Button variant="outline" size="sm" onClick={loadNotifications} className="bg-transparent">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No notifications sent yet</div>
                  ) : (
                    notifications.map((notification) => (
                      <Card key={notification.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge
                                  variant={
                                    notification.status === "sent"
                                      ? "secondary"
                                      : notification.status === "failed"
                                        ? "destructive"
                                        : "default"
                                  }
                                  className={getStatusColor(notification.status)}
                                >
                                  {getStatusIcon(notification.status)}
                                  {notification.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {notification.type.replace("_", " ")}
                                </span>
                                <span className="text-sm font-mono text-muted-foreground">{notification.id}</span>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-muted-foreground">To:</span>
                                  <span className="font-mono text-sm">{notification.phoneNumber}</span>
                                </div>
                                <div className="text-sm bg-muted/50 p-3 rounded whitespace-pre-wrap">
                                  {notification.message}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Sent: {new Date(notification.timestamp).toLocaleString()}
                                  {notification.retryCount > 0 && ` • Retries: ${notification.retryCount}`}
                                </div>
                              </div>
                            </div>

                            {notification.status === "failed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => retryNotification(notification.id)}
                                className="ml-4 bg-transparent"
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Retry
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="send" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Custom Message</Label>
                  <textarea
                    id="message"
                    className="w-full min-h-[120px] p-3 border rounded-md resize-none"
                    placeholder="Enter your custom notification message..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    maxLength={160}
                  />
                  <div className="text-xs text-muted-foreground text-right">{customMessage.length}/160 characters</div>
                </div>

                <Button
                  onClick={sendCustomNotification}
                  disabled={isLoading || !phoneNumber || !customMessage}
                  className="w-full"
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Notification
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
