import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { Providers } from '../lib/providers'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeInitializer } from '@/components/theme-initializer'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FinanceAI - Smart Expense Tracker",
  description: "AI-powered personal expense tracker",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="finance-ai-theme"
          >
            <ThemeInitializer />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
} 