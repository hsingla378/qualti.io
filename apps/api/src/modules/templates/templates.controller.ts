import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentOrganization } from '../../common/decorators/current-organization.decorator';
import type { OrganizationContext } from '../../common/decorators/current-organization.decorator';
import { OrganizationContextGuard } from '../../common/guards/organization-context.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateVersionDto } from './dto/update-template-version.dto';
import { TemplatesService } from './templates.service';

@Controller('templates')
@UseGuards(JwtAuthGuard, OrganizationContextGuard)
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  findAll(@CurrentOrganization() organization: OrganizationContext) {
    return this.templatesService.findAll(organization.id);
  }

  @Post()
  create(
    @CurrentOrganization() organization: OrganizationContext,
    @Body() dto: CreateTemplateDto,
  ) {
    return this.templatesService.create(
      organization.id,
      dto,
      organization.userId,
    );
  }

  @Get(':templateId')
  findOne(
    @CurrentOrganization() organization: OrganizationContext,
    @Param('templateId') templateId: string,
  ) {
    return this.templatesService.findOne(organization.id, templateId);
  }

  @Patch(':templateId/versions/:versionId')
  updateVersion(
    @CurrentOrganization() organization: OrganizationContext,
    @Param('templateId') templateId: string,
    @Param('versionId') versionId: string,
    @Body() dto: UpdateTemplateVersionDto,
  ) {
    return this.templatesService.updateVersion(
      organization.id,
      templateId,
      versionId,
      dto,
      organization.userId,
    );
  }

  @Post(':templateId/versions/:versionId/publish')
  publish(
    @CurrentOrganization() organization: OrganizationContext,
    @Param('templateId') templateId: string,
    @Param('versionId') versionId: string,
  ) {
    return this.templatesService.publish(
      organization.id,
      templateId,
      versionId,
      organization.userId,
    );
  }

  @Post(':templateId/versions')
  createVersion(
    @CurrentOrganization() organization: OrganizationContext,
    @Param('templateId') templateId: string,
  ) {
    return this.templatesService.createVersion(
      organization.id,
      templateId,
      organization.userId,
    );
  }
}
