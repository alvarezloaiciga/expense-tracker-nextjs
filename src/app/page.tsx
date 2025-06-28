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
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 