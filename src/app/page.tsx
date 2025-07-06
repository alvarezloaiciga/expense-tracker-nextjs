"use client"

import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/forms/LoginForm'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const { user, isLoading, error } = useAuth()

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If user is authenticated and no error, redirect to dashboard
  if (user && !error) {
    redirect('/dashboard')
  }

  // Check if it's a network error (backend not running)
  const isNetworkError = error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')

  // If not authenticated or there's an error (like 401), show login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Track your expenses with AI-powered categorization
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 dark:text-gray-100 py-8 px-6 shadow rounded-lg">
          {isNetworkError ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Backend Server Not Running
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Please start your backend server on port 3000 to use this application.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-xs text-gray-600 dark:text-gray-300">
                <code>npm run dev</code> (in your backend directory)
              </div>
            </div>
          ) : (
            <>
              <LoginForm />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Don't have an account?{' '}
                  <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign up here
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 