import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Role } from '@prisma/client';

import {
  Permission,
  hasPermission,
  isAllowed,
  permissionsForRole,
} from './permissions';

const expectedByRole: Record<Role, Permission[]> = {
  OWNER: [
    Permission.TemplateRead,
    Permission.TemplateCreate,
    Permission.TemplateUpdate,
    Permission.TemplatePublish,
    Permission.SiteRead,
    Permission.SiteCreate,
    Permission.SiteUpdate,
    Permission.SiteDelete,
    Permission.AuditRead,
  ],
  ADMIN: [
    Permission.TemplateRead,
    Permission.TemplateCreate,
    Permission.TemplateUpdate,
    Permission.TemplatePublish,
    Permission.SiteRead,
    Permission.SiteCreate,
    Permission.SiteUpdate,
    Permission.SiteDelete,
    Permission.AuditRead,
  ],
  REVIEWER: [
    Permission.TemplateRead,
    Permission.SiteRead,
    Permission.AuditRead,
  ],
  INSPECTOR: [Permission.TemplateRead, Permission.SiteRead],
};

describe('authorization policy', () => {
  for (const role of Object.values(Role)) {
    for (const permission of Object.values(Permission)) {
      const expected = expectedByRole[role].includes(permission);

      it(`${role} ${expected ? 'can' : 'cannot'} ${permission}`, () => {
        assert.equal(hasPermission(role, permission), expected);
      });
    }
  }

  it('lists only the permissions granted to a role', () => {
    for (const role of Object.values(Role)) {
      assert.deepEqual(permissionsForRole(role), expectedByRole[role]);
    }
  });

  it('denies access when role or permission is missing', () => {
    assert.equal(isAllowed(undefined, Permission.TemplateCreate), false);
    assert.equal(isAllowed(Role.OWNER, undefined), false);
    assert.equal(isAllowed(undefined, undefined), false);
  });
});
