"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import api from '@/services/api'

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: api.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Don't refetch on window focus if we get a 401
    refetchOnWindowFocus: false,
    // Handle 401 errors gracefully
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        // Clear invalid token
        api.logout()
        // Redirect to login
        router.push('/')
      }
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => {
      api.logout()
      return Promise.resolve()
    },
    onSuccess: () => {
      // Immediately clear user data from cache
      queryClient.setQueryData(['user'], null)
      // Invalidate user query
      queryClient.invalidateQueries({ queryKey: ['user'] })
      // Redirect to home page
      router.push('/')
    },
  })

  const logout = () => {
    logoutMutation.mutate()
  }

  return {
    user,
    isLoading,
    logout,
    isAuthenticated: !!user && !error,
    error,
  }
} 