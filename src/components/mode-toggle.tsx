"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSettings } from "@/hooks/useSettings"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const { settings, updateSettings } = useSettings()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isDark = theme === "dark"
  const nextTheme = isDark ? "light" : "dark"

  const handleThemeChange = async () => {
    setTheme(nextTheme)
    try {
      await updateSettings({
        ...settings,
        preferred_theme: nextTheme
      })
    } catch (error) {
      console.error("Failed to save theme preference:", error)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleThemeChange}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
