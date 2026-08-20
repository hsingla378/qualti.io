import { Controller, Get, UseGuards } from '@nestjs/common';
import { Permission } from '../../common/authorization/permissions';
import { PermissionsGuard } from '../../common/authorization/permissions.guard';
import { RequirePermission } from '../../common/authorization/require-permission.decorator';
import { CurrentOrganization } from '../../common/decorators/current-organization.decorator';
import type { OrganizationContext } from '../../common/decorators/current-organization.decorator';
import { OrganizationContextGuard } from '../../common/guards/organization-context.guard';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('audit-events')
@UseGuards(JwtAuthGuard, OrganizationContextGuard, PermissionsGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermission(Permission.AuditRead)
  findAll(@CurrentOrganization() organization: OrganizationContext) {
    return this.auditService.findAll(organization.id);
  }
}
