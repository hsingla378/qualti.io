'use client';

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { AuthSession, getCurrentSession, logout as logoutRequest } from './api';
import type { Permission } from './permissions';

type AuthContextValue = {
  user: AuthSession['user'] | null;
  organization: AuthSession['organization'] | null;
  role: string | null;
  permissions: Permission[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  requireAuth = false,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
}) {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const nextSession = await getCurrentSession();
    setSession(nextSession);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (requireAuth && !isLoading && !session) {
      router.replace('/login');
    }
  }, [isLoading, requireAuth, router, session]);

  const logout = useCallback(async () => {
    await logoutRequest();
    setSession(null);
    router.replace('/login');
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      organization: session?.organization ?? null,
      role: session?.role ?? null,
      permissions: session?.permissions ?? [],
      isLoading,
      refresh,
      logout,
    }),
    [isLoading, logout, refresh, session],
  );

  if (requireAuth && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (requireAuth && !session) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
