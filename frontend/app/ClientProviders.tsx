'use client';

import { AuthProvider } from '@/lib/auth';
import { TasksProvider } from '@/lib/tasks';
import { ReactNode } from 'react';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TasksProvider>
        {children}
      </TasksProvider>
    </AuthProvider>
  );
}