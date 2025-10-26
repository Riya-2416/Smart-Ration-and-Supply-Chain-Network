"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Search, CheckCircle, AlertTriangle, Copy } from "lucide-react"
import { blockchainService, type BlockchainTransaction } from "@/lib/blockchain-service"
import { useLanguage } from "@/lib/language-context"

export function TransactionVerification() {
  const [transactionId, setTransactionId] = useState("")
  const [transaction, setTransaction] = useState<BlockchainTransaction | null>(null)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

  const handleVerification = async () => {
    if (!transactionId.trim()) return

    setIsLoading(true)

    // Simulate verification delay
    setTimeout(() => {
      const tx = blockchainService.getTransactionById(transactionId.trim())
      setTransaction(tx)

      if (tx) {
        const verified = blockchainService.verifyTransaction(transactionId.trim())
        setIsVerified(verified)
      } else {
        setIsVerified(null)
      }

      setIsLoading(false)
    }, 1500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Blockchain Transaction Verification</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="txId">Transaction ID</Label>
              <div className="flex space-x-2">
                <Input
                  id="txId"
                  placeholder="Enter transaction ID (e.g., TX1234567890)"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
                <Button onClick={handleVerification} disabled={isLoading || !transactionId.trim()}>
                  {isLoading ? (
                    "Verifying..."
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Verify
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {transaction && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Transaction Details</span>
              <Badge
                variant={isVerified ? "secondary" : "destructive"}
                className={isVerified ? "bg-primary/10 text-primary" : ""}
              >
                {isVerified ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                {isVerified ? "Verified" : "Invalid"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Transaction ID</Label>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono text-sm">{transaction.id}</p>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(transaction.id)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Timestamp</Label>
                  <p className="font-medium">{new Date(transaction.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Customer Aadhaar</Label>
                  <p className="font-mono">****-****-{transaction.customerAadhaar.slice(-4)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Shop ID</Label>
                  <p className="font-medium">{transaction.shopId}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Items Purchased</Label>
                <div className="mt-2 space-y-2">
                  {transaction.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span>
                        {item.name} ({item.quantity}
                        {item.unit})
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                <span className="font-medium">Total Amount</span>
                <span className="text-lg font-bold text-primary">₹{transaction.totalAmount}</span>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Blockchain Hash</Label>
                <div className="flex items-center space-x-2">
                  <p className="font-mono text-xs break-all bg-muted p-2 rounded">{transaction.hash}</p>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(transaction.hash)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Previous Hash</Label>
                <p className="font-mono text-xs break-all bg-muted p-2 rounded">{transaction.previousHash}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {transactionId && !transaction && !isLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Transaction Not Found</h3>
            <p className="text-muted-foreground">
              The transaction ID you entered could not be found in the blockchain.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
