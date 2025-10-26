import { ShopHeader } from "@/components/shop/shop-header"
import { VerificationPanel } from "@/components/shop/verification-panel"
import { InventoryPanel } from "@/components/shop/inventory-panel"
import { TransactionHistory } from "@/components/shop/transaction-history"
import { DailyStats } from "@/components/shop/daily-stats"

export default function ShopDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <ShopHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Operations */}
          <div className="lg:col-span-2 space-y-8">
            <VerificationPanel />
            <TransactionHistory />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <DailyStats />
            <InventoryPanel />
          </div>
        </div>
      </main>
    </div>
  )
}
