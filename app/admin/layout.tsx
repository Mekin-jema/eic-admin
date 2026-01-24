"use client"

import { AppSidebar } from "@/components/app-sidebar"

import { SearchProvider } from "@/components/seach-context"
import Header from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import React from "react"
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 62)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
        {/* 🧭 Sidebar */}
        <AppSidebar variant="inset" />

        {/* 🧱 Main Layout Section */}
        <SidebarInset>
          <Header />
          <Toaster position="top-right" richColors />
          {children}

        </SidebarInset>
    </SidebarProvider>
      </SearchProvider>
  )
}
