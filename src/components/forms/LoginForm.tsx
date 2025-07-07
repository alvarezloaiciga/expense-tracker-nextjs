'use client';

import { useAuth } from '@/hooks/useAuth0';

export function LoginForm() {
  const { login, isLoading } = useAuth();

  const handleLogin = () => {
    login();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Sign in with your Auth0 account to access your expense tracker
        </p>
      </div>
      
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2 text-white font-semibold transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign in with Auth0'}
      </button>
    </div>
  );
} 