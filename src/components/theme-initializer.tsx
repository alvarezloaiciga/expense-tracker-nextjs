"use client"

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useSettings } from '@/hooks/useSettings'

export function ThemeInitializer() {
  const { setTheme } = useTheme()
  const { preferredTheme, loading } = useSettings()

  useEffect(() => {
    if (!loading && preferredTheme) {
      setTheme(preferredTheme)
    }
  }, [preferredTheme, loading, setTheme])

  return null
} 