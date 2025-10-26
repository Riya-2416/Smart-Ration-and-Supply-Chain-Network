"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Store,
  Users,
  Package,
  BarChart3,
  MessageSquare,
  Settings,
  FileText,
  AlertTriangle,
} from "lucide-react"

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard, current: true },
  { name: "Shop Management", href: "/admin/shops", icon: Store, current: false },
  { name: "Inventory Control", href: "/admin/inventory", icon: Package, current: false },
  { name: "Complaints", href: "/admin/complaints", icon: MessageSquare, current: false },
  { name: "Reports", href: "/admin/reports", icon: FileText, current: false },
  { name: "System Alerts", href: "/admin/alerts", icon: AlertTriangle, current: false },
  { name: "Settings", href: "/admin/settings", icon: Settings, current: false },
]

export function AdminSidebar() {
  const [currentPath, setCurrentPath] = useState("/admin")

  return (
    <div className="w-64 bg-card border-r min-h-screen">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <Link key={item.name} href={item.href}>
            <Button
              variant={currentPath === item.href ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                currentPath === item.href ? "bg-primary text-primary-foreground" : "hover:bg-accent",
              )}
              onClick={() => setCurrentPath(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  )
}
