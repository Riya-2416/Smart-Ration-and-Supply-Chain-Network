import { TransactionVerification } from "@/components/blockchain/transaction-verification"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VerifyTransactionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Verify Transaction</h1>
            <p className="text-muted-foreground">
              Verify the authenticity of any ration distribution transaction using blockchain technology
            </p>
          </div>

          <TransactionVerification />
        </div>
      </div>
    </div>
  )
}
