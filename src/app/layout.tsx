import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { Providers } from '../lib/providers'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeInitializer } from '@/components/theme-initializer'
import { Auth0ProviderWrapper } from '@/components/auth0-provider'
import { LocaleProvider } from "@/contexts/LocaleContext";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NeuroSpend - Smart Expense Tracker",
  description: "Track smarter. Spend better.",
  generator: 'Neurovia Labs'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Auth0ProviderWrapper>
          <Providers>
            <LocaleProvider>
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
            </LocaleProvider>
          </Providers>
        </Auth0ProviderWrapper>
      </body>
    </html>
  )
} 