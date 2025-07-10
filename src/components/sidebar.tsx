"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { BarChart3, CreditCard, FileText, Home, Settings, Tag, Menu, X, LogOut, User } from "lucide-react"
import { useAuth } from "@/hooks/useAuth0"
import { useTranslation } from "@/hooks/useTranslation"

const navItems = [
  {
    name: "sidebar.dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "sidebar.transactions",
    href: "/transactions",
    icon: CreditCard,
  },
  {
    name: "sidebar.categories",
    href: "/categories",
    icon: Tag,
  },
  {
    name: "sidebar.creditCards",
    href: "/credit-cards",
    icon: CreditCard,
  },
  {
    name: "sidebar.analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "sidebar.settings",
    href: "/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isLoading, isAuthenticated } = useAuth()
  const { t } = useTranslation()

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-[60] md:hidden bg-background/80 backdrop-blur-sm border shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar for both mobile and desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-background border-r border-border transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">NeuroSpend</span>
            </Link>
            <div className="md:hidden">
              <ModeToggle />
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {t(item.name)}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t p-4 space-y-4">
            <div className="flex flex-row items-center gap-2 ms-3">
              <ModeToggle />
              <LocaleSwitcher />
            </div>
            {!isLoading && isAuthenticated && user && (
              <div className="space-y-3 w-full">
                <div className="flex items-center space-x-3 px-2">
                  <div className="flex-shrink-0">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.name || user.email || t('sidebar.user')}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  {t('sidebar.signOut')}
                </Button>
              </div>
            )}
            {!isLoading && !isAuthenticated && (
              <div className="space-y-3 w-full">
                <div className="flex items-center space-x-3 px-2">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('sidebar.notSignedIn')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('sidebar.pleaseLogin')}
                    </p>
                  </div>
                </div>
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    {t('sidebar.signIn')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
