import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Receipt, Download, Eye } from "lucide-react"

const transactions = [
  {
    id: "TXN-001",
    time: "14:30",
    customer: "Riya Biswas",
    cardNumber: "MH-12-3456-7890",
    items: ["Rice: 20kg", "Wheat: 15kg", "Sugar: 2kg"],
    amount: "₹195",
    status: "completed",
  },
  {
    id: "TXN-002",
    time: "14:15",
    customer: "Amit Sharma",
    cardNumber: "MH-12-3456-7891",
    items: ["Rice: 20kg", "Oil: 1L"],
    amount: "₹110",
    status: "completed",
  },
  {
    id: "TXN-003",
    time: "14:00",
    customer: "Priya Patel",
    cardNumber: "MH-12-3456-7892",
    items: ["Wheat: 15kg", "Sugar: 2kg"],
    amount: "₹85",
    status: "completed",
  },
  {
    id: "TXN-004",
    time: "13:45",
    customer: "Rajesh Kumar",
    cardNumber: "MH-12-3456-7893",
    items: ["Rice: 20kg", "Wheat: 15kg"],
    amount: "₹105",
    status: "completed",
  },
]

export function TransactionHistory() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Receipt className="h-5 w-5" />
          <span>Recent Transactions</span>
        </CardTitle>
        <Button variant="outline" size="sm" className="bg-transparent">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {transaction.status}
                  </Badge>
                  <span className="text-sm font-mono text-muted-foreground">{transaction.id}</span>
                  <span className="text-sm text-muted-foreground">{transaction.time}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{transaction.customer}</span>
                    <span className="font-bold text-primary">{transaction.amount}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Card: {transaction.cardNumber}</div>
                  <div className="text-sm text-muted-foreground">Items: {transaction.items.join(", ")}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
