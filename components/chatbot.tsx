"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, HelpCircle, AlertCircle, MapPin, Calendar, User } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your Smart Ration assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    { icon: HelpCircle, text: "How to use", action: "How do I use this platform?" },
    { icon: AlertCircle, text: "File complaint", action: "I want to file a complaint" },
    { icon: MapPin, text: "Find shops", action: "How to find nearby ration shops?" },
    { icon: Calendar, text: "Book slot", action: "How to book a slot?" },
    { icon: User, text: "Register", action: "How do I register?" },
  ]

  const handleSend = (message?: string) => {
    const userMessage = message || input.trim()
    if (!userMessage) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: userMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 500)
  }

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (
      lowerMessage.includes("complaint") ||
      lowerMessage.includes("problem") ||
      lowerMessage.includes("issue")
    ) {
      return "To file a complaint, please go to the Support section or send an email to support@smartration.gov.in. You can also call our toll-free number: 1800-SMART-RATION. We'll address your concern within 24 hours."
    }

    if (lowerMessage.includes("register") || lowerMessage.includes("sign up")) {
      return "To register, click on the 'Register' button in the header. You'll need your Aadhaar number, mobile number, and address details. After registration, you'll receive an OTP for verification."
    }

    if (lowerMessage.includes("slot") || lowerMessage.includes("book")) {
      return "To book a slot, log in to your account, go to the 'Book Slot' section, select your preferred date and time, and confirm. You'll receive an SMS confirmation immediately."
    }

    if (lowerMessage.includes("track") || lowerMessage.includes("ration")) {
      return "You can track your ration delivery in the 'Track Ration' section. Simply enter your Aadhaar number or transaction ID to see the real-time status of your ration."
    }

    if (
      lowerMessage.includes("shop") ||
      lowerMessage.includes("location") ||
      lowerMessage.includes("nearby")
    ) {
      return "To find nearby ration shops, go to the 'Shop Locator' feature. It will show you all available shops in your area with their distance, stock availability, and directions to reach there."
    }

    if (lowerMessage.includes("inventory") || lowerMessage.includes("stock")) {
      return "Our inventory is updated in real-time. You can check stock availability for any ration shop before visiting. The system shows live updates of all available items."
    }

    if (
      lowerMessage.includes("rfid") ||
      lowerMessage.includes("card") ||
      lowerMessage.includes("smart card")
    ) {
      return "RFID Smart Cards allow quick and secure ration collection. Simply tap your card at the ration shop, and your transaction will be processed instantly with an SMS receipt."
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("navigation")) {
      return "I can help you navigate through the app! The main sections are: Home, Services, Track Ration, and Support. You can access your dashboard after login to see bookings, inventory, and more."
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! I'm here to help you with anything related to Smart Ration. What would you like to know?"
    }

    return "Thank you for your query. For more specific assistance, please visit our Support section or contact our customer care at support@smartration.gov.in. Is there anything else I can help you with?"
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl animate-slide-up">
          <CardHeader className="bg-primary text-primary-foreground flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <CardTitle className="text-lg">Smart Ration Assistant</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-medium mb-2 text-muted-foreground">Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleSend(action.action)}
                    >
                      <action.icon className="h-3 w-3 mr-1" />
                      {action.text}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button size="icon" onClick={() => handleSend()} className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Button */}
      {!isOpen && (
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:scale-110 transition-transform animate-pulse-slow"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}

