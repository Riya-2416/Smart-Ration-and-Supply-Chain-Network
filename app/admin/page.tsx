import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { OverviewStats } from "@/components/admin/overview-stats"
import { SystemHealth } from "@/components/admin/system-health"
import { RecentActivity } from "@/components/admin/recent-activity"
import { DistributionChart } from "@/components/admin/distribution-chart"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Monitor and manage the Smart Ration Supply Chain Network</p>
            </div>

            <OverviewStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <DistributionChart />
              <SystemHealth />
            </div>

            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  )
}
