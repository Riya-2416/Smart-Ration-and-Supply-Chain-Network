import { SlotBookingForm } from "@/components/booking/slot-booking-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"

export default function BookSlotPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Book Your Slot</h1>
            <p className="text-muted-foreground">Select your preferred date and time for ration collection</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Slot Booking</CardTitle>
              <CardDescription>
                Choose a convenient time slot to avoid queues and ensure smooth collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SlotBookingForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
