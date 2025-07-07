"use client"

import type React from "react"
import { useAuth } from "@/hooks/useAuth0"
import Sidebar from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, isAuthenticated } = useAuth()

  // Show loading state while Auth0 is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    window.location.href = '/'
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto w-full md:ml-64">
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
} 