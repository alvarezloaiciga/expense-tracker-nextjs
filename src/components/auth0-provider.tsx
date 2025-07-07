'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from '@/lib/auth0';

export function Auth0ProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider {...auth0Config}>
      {children}
    </Auth0Provider>
  );
} 