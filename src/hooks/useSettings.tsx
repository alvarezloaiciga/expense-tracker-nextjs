"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getUserSettings, updateUserSettings } from '@/services/api'
import { type UserSettings } from '@/types'
import { type CurrencyCode } from '@/lib/currency'

interface SettingsContextType {
  settings: UserSettings | null
  loading: boolean
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>
  defaultCurrency: CurrencyCode
  setDefaultCurrency: (currency: CurrencyCode) => Promise<void>
  preferredTheme: string
  setPreferredTheme: (theme: string) => Promise<void>
  enabledCurrencies: CurrencyCode[]
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)

  // Load settings on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const userSettings = await getUserSettings()
      setSettings(userSettings)
    } catch (error) {
      console.error('Failed to load user settings:', error)
      // Set default settings if API fails
      setSettings({
        name: '',
        default_currency: 'USD',
        preferred_theme: 'light',
        enabled_currencies: ['USD']
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!settings) return

    try {
      const updatedSettings = { ...settings, ...newSettings }
      const response = await updateUserSettings(updatedSettings)
      setSettings(response)
    } catch (error) {
      console.error('Failed to update settings:', error)
      throw error
    }
  }

  const setDefaultCurrency = async (currency: CurrencyCode) => {
    await updateSettings({ default_currency: currency })
  }

  const setPreferredTheme = async (theme: string) => {
    await updateSettings({ preferred_theme: theme })
  }

  const value: SettingsContextType = {
    settings,
    loading,
    updateSettings,
    defaultCurrency: (settings?.default_currency as CurrencyCode) || 'USD',
    setDefaultCurrency,
    preferredTheme: settings?.preferred_theme || 'light',
    setPreferredTheme,
    enabledCurrencies: (settings?.enabled_currencies as CurrencyCode[]) || ['USD'],
  }

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
} 