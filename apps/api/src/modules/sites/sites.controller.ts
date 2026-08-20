import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Permission } from '../../common/authorization/permissions';
import { PermissionsGuard } from '../../common/authorization/permissions.guard';
import { RequirePermission } from '../../common/authorization/require-permission.decorator';
import { CurrentOrganization } from '../../common/decorators/current-organization.decorator';
import type { OrganizationContext } from '../../common/decorators/current-organization.decorator';
import { OrganizationContextGuard } from '../../common/guards/organization-context.guard';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SitesService } from './sites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sites')
@UseGuards(JwtAuthGuard, OrganizationContextGuard, PermissionsGuard)
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  @RequirePermission(Permission.SiteRead)
  findAll(@CurrentOrganization() organization: OrganizationContext) {
    return this.sitesService.findAll(organization.id);
  }

  @Post()
  @RequirePermission(Permission.SiteCreate)
  create(
    @CurrentOrganization() organization: OrganizationContext,
    @Body() dto: CreateSiteDto,
  ) {
    return this.sitesService.create(organization.id, dto, organization.userId);
  }

  @Patch(':id')
  @RequirePermission(Permission.SiteUpdate)
  update(
    @CurrentOrganization() organization: OrganizationContext,
    @Param('id') id: string,
    @Body() dto: UpdateSiteDto,
  ) {
    return this.sitesService.update(
      organization.id,
      id,
      dto,
      organization.userId,
    );
  }

  @Delete(':id')
  @RequirePermission(Permission.SiteDelete)
  remove(
    @CurrentOrganization() organization: OrganizationContext,
    @Param('id') id: string,
  ) {
    return this.sitesService.remove(organization.id, id, organization.userId);
  }
}
