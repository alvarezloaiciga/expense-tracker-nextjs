"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useAuth } from './useAuth0'
import { getUserSettings, updateUserSettings } from '@/services/api'

export interface Settings {
  name: string
  default_currency: string
  preferred_theme: string
  enabled_currencies: string[]
}

const defaultSettings: Settings = {
  name: '',
  default_currency: 'USD',
  preferred_theme: 'system',
  enabled_currencies: ['USD'],
}

export function useSettings() {
  const { user, isAuthenticated, getAccessToken } = useAuth()
  const queryClient = useQueryClient()
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // Get access token when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      getAccessToken().then(token => {
        setAccessToken(token)
      }).catch(error => {
        console.error('Failed to get access token:', error)
      })
    }
  }, [isAuthenticated, user, getAccessToken])

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      if (!accessToken) throw new Error('No access token')
      return getUserSettings(accessToken)
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Settings) => {
      if (!accessToken) throw new Error('No access token')
      return updateUserSettings(newSettings, accessToken)
    },
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['settings'], updatedSettings)
    },
  })

  return {
    settings: settings || defaultSettings,
    isLoading,
    error,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isLoading,
  }
} 