"use client"

import { useEffect } from "react";
import Link from "next/link";
import { IconBell } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminDashboardStore } from "@/store/useAdminDashboardStore";

export default function NotificationBell() {
  const fetchAdminNotifications = useAdminDashboardStore((s) => s.fetchAdminNotifications);
  const notifications = useAdminDashboardStore((s) => s.notifications) || [];

  useEffect(() => {
    // fetch once on mount
    fetchAdminNotifications?.();
  }, [fetchAdminNotifications]);

  // typed minimal notification shape
  type NotificationItem = { _id?: string; seen?: boolean };
  const unreadCount = (notifications as NotificationItem[]).filter((n) => !n.seen).length;

  return (
    <Link href="/dashboard/notifications" className="relative">
      <Button size="icon" variant="ghost" aria-label="Notifications">
        <IconBell className="size-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -right-1 -top-1 rounded-full bg-red-600 text-white px-1 py-0 text-[10px]">{unreadCount}</Badge>
        )}
      </Button>
    </Link>
  );
}
