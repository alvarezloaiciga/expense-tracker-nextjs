import { LoginForm } from '@/components/forms/LoginForm';
import { PublicAuthGuard } from '@/components/public-auth-guard'

export default function LoginPage() {
  return (
    <PublicAuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Track your expenses with AI-powered categorization
            </p>
          </div>
          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <LoginForm />
          </div>
        </div>
      </div>
    </PublicAuthGuard>
  );
} 