import { SignupForm } from '@/components/forms/SignupForm';
import Link from 'next/link';
import { PublicAuthGuard } from '@/components/public-auth-guard'

export default function SignupPage() {
  return (
    <PublicAuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
              Start tracking your expenses with AI-powered categorization
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 dark:text-gray-100 py-8 px-6 shadow rounded-lg">
            <SignupForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
                <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicAuthGuard>
  );
} 