"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { SettingsProvider } from '@/hooks/useSettings';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        {children}
      </SettingsProvider>
    </QueryClientProvider>
  );
} 