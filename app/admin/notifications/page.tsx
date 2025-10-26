import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { NotificationCenter } from "@/components/sms/notification-center"

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">SMS Notifications</h1>
              <p className="text-muted-foreground">Manage and monitor SMS notifications across the network</p>
            </div>
            <NotificationCenter />
          </div>
        </main>
      </div>
    </div>
  )
}
