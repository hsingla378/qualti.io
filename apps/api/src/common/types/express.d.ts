import type { AuthenticatedUser } from '../../modules/auth/types';
import type { OrganizationContext } from '../decorators/current-organization.decorator';

declare global {
  namespace Express {
    interface User {
      id: AuthenticatedUser['id'];
      email: AuthenticatedUser['email'];
    }

    interface Request {
      cookies?: Record<string, unknown>;
      organization: OrganizationContext;
    }
  }
}

export {};
