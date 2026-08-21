'use client';

import { useContext } from 'react';

import { AuthContext } from './auth-provider';
import type { Permission } from './permissions';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}

export function useHasPermission(permission: Permission) {
  const { permissions } = useAuth();
  return permissions.includes(permission);
}
