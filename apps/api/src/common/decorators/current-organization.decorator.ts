import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';
import type { Request } from 'express';

import type { Permission } from '../authorization/permissions';

export type OrganizationContext = {
  id: string;
  name: string;
  slug: string;
  role: Role;
  userId: string;
  permissions: Permission[];
};

export const CurrentOrganization = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): OrganizationContext => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.organization;
  },
);
