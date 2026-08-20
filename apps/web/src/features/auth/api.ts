import { apiRequest } from '@/lib/api-client';

import type { Permission } from './permissions';

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
};

export type AuthOrganization = {
  id: string;
  name: string;
  slug: string;
};

export type AuthSession = {
  user: AuthUser;
  organization: AuthOrganization;
  role: string;
  permissions: Permission[];
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  companyName: string;
};

export function login(input: LoginInput) {
  return apiRequest<AuthSession>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function register(input: RegisterInput) {
  return apiRequest<AuthSession>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function logout() {
  return apiRequest<{ success: true }>('/auth/logout', {
    method: 'POST',
  });
}

export async function getCurrentSession() {
  try {
    const session = await apiRequest<AuthSession>('/auth/me');
    return {
      ...session,
      permissions: session.permissions ?? [],
    };
  } catch {
    return null;
  }
}
