import { Role } from '@prisma/client';

export const Permission = {
  TemplateRead: 'template.read',
  TemplateCreate: 'template.create',
  TemplateUpdate: 'template.update',
  TemplatePublish: 'template.publish',
  SiteRead: 'site.read',
  SiteCreate: 'site.create',
  SiteUpdate: 'site.update',
  SiteDelete: 'site.delete',
  AuditRead: 'audit.read',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

const ALL_CURRENT_PERMISSIONS: Permission[] = Object.values(Permission);

const REVIEWER_PERMISSIONS: Permission[] = [
  Permission.TemplateRead,
  Permission.SiteRead,
  Permission.AuditRead,
];

const INSPECTOR_PERMISSIONS: Permission[] = [
  Permission.TemplateRead,
  Permission.SiteRead,
];

// Owner and Admin share operational permissions until ownership-only
// actions such as billing exist.
const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  OWNER: ALL_CURRENT_PERMISSIONS,
  ADMIN: ALL_CURRENT_PERMISSIONS,
  REVIEWER: REVIEWER_PERMISSIONS,
  INSPECTOR: INSPECTOR_PERMISSIONS,
};

export function permissionsForRole(role: Role): Permission[] {
  return [...(ROLE_PERMISSIONS[role] ?? [])];
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return permissionsForRole(role).includes(permission);
}

export function isAllowed(
  role: Role | undefined,
  permission: Permission | undefined,
): boolean {
  if (!role || !permission) {
    return false;
  }

  return hasPermission(role, permission);
}
