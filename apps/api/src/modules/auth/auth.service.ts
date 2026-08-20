import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuditService } from '../audit/audit.service';

import {
  permissionsForRole,
  type Permission,
} from '../../common/authorization/permissions';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type SessionUser = {
  id: string;
  name: string | null;
  email: string;
};

type SessionOrganization = {
  id: string;
  name: string;
  slug: string;
};

export type AuthSession = {
  user: SessionUser;
  organization: SessionOrganization;
  role: Role;
  permissions: Permission[];
};

export type SignedAuthSession = AuthSession & {
  accessToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  async register(dto: RegisterDto): Promise<SignedAuthSession> {
    const email = dto.email.toLowerCase().trim();

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const organizationSlug = await this.createUniqueOrganizationSlug(
      dto.companyName,
    );

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: dto.name.trim(),
          email,
          password: passwordHash,
        },
      });

      const organization = await tx.organization.create({
        data: {
          name: dto.companyName.trim(),
          slug: organizationSlug,
        },
      });

      const membership = await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: 'OWNER',
        },
      });

      return {
        user,
        organization,
        membership,
      };
    });

    await this.auditService.record({
      organizationId: result.organization.id,
      actorId: result.user.id,
      action: 'organization.created',
      entityType: 'organization',
      entityId: result.organization.id,
      metadata: {
        name: result.organization.name,
        slug: result.organization.slug,
      },
    });

    return this.signSession({
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
      organization: {
        id: result.organization.id,
        name: result.organization.name,
        slug: result.organization.slug,
      },
      role: result.membership.role,
      permissions: permissionsForRole(result.membership.role),
    });
  }

  async login(dto: LoginDto): Promise<SignedAuthSession> {
    const email = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            organization: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const membership = user.memberships[0];

    if (!membership) {
      throw new UnauthorizedException(
        'User does not belong to an organization',
      );
    }

    await this.auditService.record({
      organizationId: membership.organization.id,
      actorId: user.id,
      action: 'user.logged_in',
      entityType: 'user',
      entityId: user.id,
      metadata: {
        email: user.email,
      },
    });

    return this.signSession({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      organization: {
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
      },
      role: membership.role,
      permissions: permissionsForRole(membership.role),
    });
  }

  async getSession(userId: string): Promise<AuthSession> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            organization: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const membership = user.memberships[0];

    if (!membership) {
      throw new UnauthorizedException(
        'User does not belong to an organization',
      );
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      organization: {
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
      },
      role: membership.role,
      permissions: permissionsForRole(membership.role),
    };
  }

  private async signSession(session: AuthSession): Promise<SignedAuthSession> {
    const accessToken = await this.jwtService.signAsync({
      sub: session.user.id,
      email: session.user.email,
    });

    return {
      ...session,
      accessToken,
    };
  }

  private async createUniqueOrganizationSlug(companyName: string) {
    const baseSlug = this.slugify(companyName);
    let slug = baseSlug;
    let suffix = 1;

    while (
      await this.prisma.organization.findUnique({
        where: { slug },
        select: { id: true },
      })
    ) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    return slug;
  }

  private slugify(value: string) {
    return (
      value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'organization'
    );
  }
}
