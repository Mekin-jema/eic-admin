// app/components/AppSidebar.tsx
"use client"

import * as React from "react"
import {
  Users,
  CheckCircle,
  BarChart3,
  FileText,
  Mail,
  Filter,
  Settings,
  Download,
  Eye,
  QrCode,
  UserPlus,
  Globe,
  Tag,
  Bell,
  Phone,
  Calendar,
  PieChart,
  TrendingUp,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

export const data = {
  user: {
    name: "Forum Admin",
    email: "admin@ethiopiaforum.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: BarChart3,
    },
    {
      title: "All Attendees",
      url: "/admin/attendees",
      icon: Users,
      badge: "1,247",
    },
    {
      title: "Check-in",
      url: "/admin/checkin",
      icon: CheckCircle,
      badge: "892",
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: PieChart,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: FileText,
    },
    {
      title: "Communications",
      url: "/admin/communications",
      icon: Mail,
    },
  ],
  
  // // Sub-navigation items (shown in main content)
  // subNav: {
  //   attendees: [
  //     { title: "All Attendees", url: "/admin/attendees", icon: Users },
  //     { title: "New Registrations", url: "/admin/attendees/new", icon: UserPlus, badge: "32" },
  //     { title: "View Details", url: "/admin/attendees/view", icon: Eye },
  //   ],
  //   checkin: [
  //     { title: "Check-in Console", url: "/admin/checkin", icon: CheckCircle },
  //     { title: "QR Scanner", url: "/admin/checkin/scanner", icon: QrCode },
  //     { title: "Pending Check-ins", url: "/admin/checkin/pending", icon: Calendar, badge: "355" },
  //   ],
  //   analytics: [
  //     { title: "Overview", url: "/admin/analytics", icon: PieChart },
  //     { title: "By Country", url: "/admin/analytics/country", icon: Globe },
  //     { title: "By Type", url: "/admin/analytics/type", icon: Tag },
  //     { title: "Trends", url: "/admin/analytics/trends", icon: TrendingUp },
  //   ],
  //   reports: [
  //     { title: "Attendee List", url: "/admin/reports/attendees", icon: Users },
  //     { title: "Check-in Report", url: "/admin/reports/checkin", icon: CheckCircle },
  //     { title: "Export Data", url: "/admin/reports/export", icon: Download },
  //   ],
  //   communications: [
  //     { title: "Send Email", url: "/admin/communications/email", icon: Mail },
  //     { title: "SMS", url: "/admin/communications/sms", icon: Phone },
  //     { title: "Notifications", url: "/admin/communications/notify", icon: Bell },
  //   ],
  //   tools: [
  //     { title: "Filter", url: "/admin/tools/filter", icon: Filter },
  //     { title: "Settings", url: "/admin/tools/settings", icon: Settings },
  //   ],
  // },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="rounded-md">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">IE</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold">Invest Ethiopia</span>
                  <span className="text-xs text-muted-foreground">Forum 2026</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}