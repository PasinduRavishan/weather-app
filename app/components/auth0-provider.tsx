'use client';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ReactNode } from 'react';

export function Auth0Provider({ children }: { children: ReactNode }) {
  const AuthProvider = UserProvider as any;
  return <AuthProvider>{children}</AuthProvider>;
}
