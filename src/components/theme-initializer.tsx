"use client"

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useSettings } from '@/hooks/useSettings'

export function ThemeInitializer() {
  const { setTheme } = useTheme()
  const { settings, isLoading } = useSettings()

  useEffect(() => {
    if (!isLoading && settings.preferred_theme) {
      setTheme(settings.preferred_theme)
    }
  }, [settings.preferred_theme, isLoading, setTheme])

  return null
} 