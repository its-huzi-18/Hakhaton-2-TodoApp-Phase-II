'use client';

import { AuthProvider } from '@/src/lib/auth';
import { TasksProvider } from '@/src/lib/tasks';
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