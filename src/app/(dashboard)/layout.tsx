import type React from "react"
import Sidebar from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto w-full md:ml-64">
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
} 