"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useAuth } from "@/hooks/useAuth0"

export default function Navbar() {
  const { user, logout, isLoading, isAuthenticated } = useAuth()

  return (
    <nav className="w-full px-4 py-2 border-b bg-background flex items-center justify-between gap-4">
      {/* Left: App name or logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">NeuroSpend</span>
      </div>

      {/* Center: Theme and Language */}
      <div className="flex items-center gap-2">
        <ModeToggle />
        <LocaleSwitcher />
      </div>

      {/* Right: User info */}
      <div className="flex items-center gap-3 min-w-0">
        {!isLoading && isAuthenticated && user && (
          <>
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
            <div className="flex flex-col min-w-0 mr-2">
              <span className="text-sm font-medium truncate">{user.name || user.email || 'User'}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </>
        )}
        {!isLoading && !isAuthenticated && (
          <span className="text-sm text-muted-foreground">Not signed in</span>
        )}
      </div>
    </nav>
  )
} 