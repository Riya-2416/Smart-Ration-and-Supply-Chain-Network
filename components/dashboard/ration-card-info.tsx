import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Users, MapPin, Calendar } from "lucide-react"

export function RationCardInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Ration Card Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Card Number</label>
              <p className="text-lg font-mono">MH-12-3456-7890</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Card Type</label>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  APL
                </Badge>
                <span className="text-sm text-muted-foreground">Above Poverty Line</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Head of Family</label>
              <p className="font-medium">Riya Biswas</p>
            </div>
          </div>

          {/* Family & Location */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Family Members:</span>
              <span className="font-medium">4</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Assigned Shop:</span>
              <span className="font-medium">Shop #127, Andheri West</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Valid Until:</span>
              <span className="font-medium">March 2026</span>
            </div>
          </div>
        </div>

        {/* Monthly Entitlement */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-3">Monthly Entitlement</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">20kg</p>
              <p className="text-sm text-muted-foreground">Rice</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">15kg</p>
              <p className="text-sm text-muted-foreground">Wheat</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">2kg</p>
              <p className="text-sm text-muted-foreground">Sugar</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
