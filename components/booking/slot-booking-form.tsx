"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Clock, MapPin, Package, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const timeSlots = [
  { time: "9:00 AM - 10:00 AM", available: true, capacity: "5/10" },
  { time: "10:00 AM - 11:00 AM", available: true, capacity: "8/10" },
  { time: "11:00 AM - 12:00 PM", available: false, capacity: "10/10" },
  { time: "2:00 PM - 3:00 PM", available: true, capacity: "3/10" },
  { time: "3:00 PM - 4:00 PM", available: true, capacity: "6/10" },
  { time: "4:00 PM - 5:00 PM", available: true, capacity: "2/10" },
]

const rationItems = [
  { name: "Rice", quantity: "20kg", price: "₹60", selected: true },
  { name: "Wheat", quantity: "15kg", price: "₹45", selected: true },
  { name: "Sugar", quantity: "2kg", price: "₹40", selected: true },
  { name: "Oil", quantity: "1L", price: "₹50", selected: false },
]

export function SlotBookingForm() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [selectedItems, setSelectedItems] = useState<string[]>(["Rice", "Wheat", "Sugar"])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleItemToggle = (itemName: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemName) ? prev.filter((item) => item !== itemName) : [...prev, itemName],
    )
  }

  const handleBooking = async () => {
    setIsLoading(true)

    // Simulate booking API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/booking-confirmation")
    }, 2000)
  }

  const totalAmount = rationItems
    .filter((item) => selectedItems.includes(item.name))
    .reduce((total, item) => total + Number.parseInt(item.price.replace("₹", "")), 0)

  return (
    <div className="space-y-6">
      {/* Shop Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Assigned Ration Shop</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-medium">Shop 127, Vashivali</p>
            <p className="text-sm text-muted-foreground">
              Address: Plot No. 127, S.V. Road, Vashivali, Raigad - 402107, Maharashtra
            </p>
            <p className="text-sm text-muted-foreground">Contact: +91 98765 43210</p>
          </div>
        </CardContent>
      </Card>

      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Time Slot Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Available Time Slots</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {timeSlots.map((slot) => (
              <div
                key={slot.time}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  !slot.available
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : selectedSlot === slot.time
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                }`}
                onClick={() => slot.available && setSelectedSlot(slot.time)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{slot.time}</span>
                  <Badge variant={slot.available ? "secondary" : "destructive"}>
                    {slot.available ? "Available" : "Full"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Capacity: {slot.capacity}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Item Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Select Items</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rationItems.map((item) => (
              <div key={item.name} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={item.name}
                  checked={selectedItems.includes(item.name)}
                  onCheckedChange={() => handleItemToggle(item.name)}
                />
                <Label htmlFor={item.name} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground ml-2">({item.quantity})</span>
                    </div>
                    <span className="font-medium">{item.price}</span>
                  </div>
                </Label>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Amount:</span>
              <span className="text-lg font-bold text-primary">₹{totalAmount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Summary & Confirm */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Booking Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium">{selectedDate?.toDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Time Slot:</span>
              <span className="font-medium">{selectedSlot || "Not selected"}</span>
            </div>
            <div className="flex justify-between">
              <span>Items:</span>
              <span className="font-medium">{selectedItems.length} items</span>
            </div>
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-medium text-primary">₹{totalAmount}</span>
            </div>
          </div>

          <Button
            className="w-full mt-6"
            size="lg"
            disabled={!selectedDate || !selectedSlot || selectedItems.length === 0 || isLoading}
            onClick={handleBooking}
          >
            {isLoading ? "Booking..." : "Confirm Booking"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
