import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Shield, Clock, MessageSquare, BarChart3, CreditCard, MapPin, Bell } from "lucide-react"

const features = [
  {
    icon: CreditCard,
    title: "Aadhaar Authentication",
    description: "Secure login using Aadhaar number with OTP verification for authorized access only.",
  },
  {
    icon: Clock,
    title: "Slot Booking System",
    description: "Book your preferred time slot to avoid queues and get SMS confirmation.",
  },
  {
    icon: Shield,
    title: "RFID Smart Cards",
    description: "Quick and secure ration collection using RFID-enabled smart cards.",
  },
  {
    icon: BarChart3,
    title: "Real-time Inventory",
    description: "Live tracking of stock levels and automatic inventory updates.",
  },
  {
    icon: MessageSquare,
    title: "SMS Receipts",
    description: "Instant SMS receipts with blockchain-secured transaction records.",
  },
  {
    icon: MapPin,
    title: "Shop Locator",
    description: "Find nearby ration shops with availability status and directions.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get alerts for new stock arrivals, booking confirmations, and updates.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Fully responsive design that works seamlessly on all devices.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Features for Modern Distribution</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of public distribution with cutting-edge technology designed for transparency,
            efficiency, and user convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
