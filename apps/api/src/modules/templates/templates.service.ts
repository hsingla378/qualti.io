import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  TemplateItemType,
  TemplateVersionStatus,
} from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplateItemDto, TemplateSectionDto } from './dto/template-content.dto';
import { UpdateTemplateVersionDto } from './dto/update-template-version.dto';

const versionInclude = {
  sections: {
    orderBy: { sortOrder: 'asc' as const },
    include: {
      items: {
        orderBy: { sortOrder: 'asc' as const },
      },
    },
  },
};

type TemplateClient = Pick<PrismaService, 'inspectionTemplate'>;

@Injectable()
export class TemplatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(organizationId: string) {
    const templates = await this.prisma.inspectionTemplate.findMany({
      where: { organizationId },
      orderBy: { updatedAt: 'desc' },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          include: {
            sections: {
              select: {
                _count: {
                  select: { items: true },
                },
              },
            },
          },
        },
      },
    });

    return templates.map((template) => {
      const currentVersion = template.versions[0];
      const publishedVersion = template.versions.find(
        (version) => version.status === TemplateVersionStatus.PUBLISHED,
      );
      const draftVersion = template.versions.find(
        (version) => version.status === TemplateVersionStatus.DRAFT,
      );

      return {
        id: template.id,
        name: template.name,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        currentVersion: currentVersion
          ? this.toListVersion(currentVersion)
          : null,
        draftVersionId: draftVersion?.id ?? null,
        publishedVersionNumber: publishedVersion?.versionNumber ?? null,
      };
    });
  }

  async findOne(organizationId: string, templateId: string) {
    const template = await this.getTemplateOrThrow(organizationId, templateId);

    return this.toDetail(template);
  }

  async create(
    organizationId: string,
    dto: CreateTemplateDto,
    actorId?: string,
  ) {
    const sections = this.normalizeSections(dto.sections ?? []);

    try {
      const template = await this.prisma.$transaction(async (tx) => {
        const created = await tx.inspectionTemplate.create({
          data: {
            organizationId,
            name: dto.name.trim(),
          },
        });

        await tx.templateVersion.create({
          data: {
            organizationId,
            templateId: created.id,
            draftTemplateId: created.id,
            versionNumber: 1,
            status: TemplateVersionStatus.DRAFT,
            sections: {
              create: this.toSectionCreates(sections),
            },
          },
        });

        await this.auditService.record(
          {
            organizationId,
            actorId,
            action: 'template.created',
            entityType: 'template',
            entityId: created.id,
            metadata: {
              name: created.name,
              versionNumber: 1,
            },
          },
          tx,
        );

        return this.loadTemplate(tx, organizationId, created.id);
      });

      return this.toDetail(template);
    } catch (error) {
      return this.rethrowUniqueDraftConflict(error);
    }
  }

  async updateVersion(
    organizationId: string,
    templateId: string,
    versionId: string,
    dto: UpdateTemplateVersionDto,
    actorId?: string,
  ) {
    const version = await this.getVersionOrThrow(
      organizationId,
      templateId,
      versionId,
    );

    const sections =
      dto.sections === undefined
        ? undefined
        : this.normalizeSections(dto.sections);

    const template = await this.prisma.$transaction(async (tx) => {
      await this.claimDraftVersion(
        tx,
        organizationId,
        templateId,
        versionId,
        'Only draft versions can be edited',
      );

      await tx.inspectionTemplate.update({
        where: {
          id_organizationId: {
            id: templateId,
            organizationId,
          },
        },
        data: {
          ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
          updatedAt: new Date(),
        },
      });

      if (sections) {
        await tx.templateSection.deleteMany({
          where: {
            versionId,
            organizationId,
          },
        });

        if (sections.length > 0) {
          for (const [sectionIndex, section] of sections.entries()) {
            await tx.templateSection.create({
              data: {
                organizationId,
                versionId,
                name: section.name,
                sortOrder: sectionIndex,
                items: {
                  create: section.items.map((item, itemIndex) =>
                    this.toItemCreate(item, itemIndex),
                  ),
                },
              },
            });
          }
        }
      }

      const updated = await this.loadTemplate(tx, organizationId, templateId);

      await this.auditService.record(
        {
          organizationId,
          actorId,
          action: 'template.updated',
          entityType: 'template',
          entityId: templateId,
          metadata: {
            name: updated.name,
            versionId,
            versionNumber: version.versionNumber,
          },
        },
        tx,
      );

      return updated;
    });

    return this.toDetail(template);
  }

  async publish(
    organizationId: string,
    templateId: string,
    versionId: string,
    actorId?: string,
  ) {
    const version = await this.getVersionOrThrow(
      organizationId,
      templateId,
      versionId,
    );

    const template = await this.prisma.$transaction(async (tx) => {
      await this.claimDraftVersion(
        tx,
        organizationId,
        templateId,
        version.id,
        'Only draft versions can be published',
      );

      const locked = await tx.templateVersion.findFirstOrThrow({
        where: {
          id: version.id,
          organizationId,
        },
        include: versionInclude,
      });

      this.assertPublishable(locked.sections);

      await tx.templateVersion.update({
        where: {
          id_organizationId: {
            id: version.id,
            organizationId,
          },
        },
        data: {
          status: TemplateVersionStatus.PUBLISHED,
          publishedAt: new Date(),
          draftTemplateId: null,
        },
      });

      await tx.inspectionTemplate.update({
        where: {
          id_organizationId: {
            id: templateId,
            organizationId,
          },
        },
        data: {
          updatedAt: new Date(),
        },
      });

      const published = await this.loadTemplate(tx, organizationId, templateId);
      const itemCount = locked.sections.reduce(
        (total, section) => total + section.items.length,
        0,
      );

      await this.auditService.record(
        {
          organizationId,
          actorId,
          action: 'template.published',
          entityType: 'template',
          entityId: templateId,
          metadata: {
            name: published.name,
            versionId: version.id,
            versionNumber: version.versionNumber,
            sectionCount: locked.sections.length,
            itemCount,
          },
        },
        tx,
      );

      return published;
    });

    return this.toDetail(template);
  }

  async createVersion(
    organizationId: string,
    templateId: string,
    actorId?: string,
  ) {
    await this.getTemplateOrThrow(organizationId, templateId);

    try {
      const template = await this.prisma.$transaction(async (tx) => {
        const existingDraft = await tx.templateVersion.findFirst({
          where: {
            templateId,
            organizationId,
            status: TemplateVersionStatus.DRAFT,
          },
        });

        if (existingDraft) {
          throw new ConflictException('A draft version already exists');
        }

        const latestPublished = await tx.templateVersion.findFirst({
          where: {
            templateId,
            organizationId,
            status: TemplateVersionStatus.PUBLISHED,
          },
          orderBy: { versionNumber: 'desc' },
          include: versionInclude,
        });

        if (!latestPublished) {
          throw new BadRequestException(
            'A published version is required before creating a new draft',
          );
        }

        const created = await tx.templateVersion.create({
          data: {
            organizationId,
            templateId,
            draftTemplateId: templateId,
            versionNumber: latestPublished.versionNumber + 1,
            status: TemplateVersionStatus.DRAFT,
            sections: {
              create: latestPublished.sections.map((section) => ({
                name: section.name,
                sortOrder: section.sortOrder,
                items: {
                  create: section.items.map((item) => ({
                    name: item.name,
                    type: item.type,
                    sortOrder: item.sortOrder,
                    unit: item.unit,
                    minValue: item.minValue,
                    maxValue: item.maxValue,
                  })),
                },
              })),
            },
          },
        });

        await tx.inspectionTemplate.update({
          where: {
            id_organizationId: {
              id: templateId,
              organizationId,
            },
          },
          data: {
            updatedAt: new Date(),
          },
        });

        const next = await this.loadTemplate(tx, organizationId, templateId);

        await this.auditService.record(
          {
            organizationId,
            actorId,
            action: 'template.version_created',
            entityType: 'template',
            entityId: templateId,
            metadata: {
              name: next.name,
              versionId: created.id,
              versionNumber: created.versionNumber,
              sourceVersionNumber: latestPublished.versionNumber,
            },
          },
          tx,
        );

        return next;
      });

      return this.toDetail(template);
    } catch (error) {
      return this.rethrowUniqueDraftConflict(error);
    }
  }

  private async getTemplateOrThrow(organizationId: string, templateId: string) {
    const template = await this.prisma.inspectionTemplate.findFirst({
      where: { id: templateId, organizationId },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          include: versionInclude,
        },
      },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  private async getVersionOrThrow(
    organizationId: string,
    templateId: string,
    versionId: string,
  ) {
    await this.getTemplateOrThrow(organizationId, templateId);

    const version = await this.prisma.templateVersion.findFirst({
      where: {
        id: versionId,
        templateId,
        organizationId,
      },
      include: versionInclude,
    });

    if (!version) {
      throw new NotFoundException('Template not found');
    }

    return version;
  }

  private async claimDraftVersion(
    tx: Pick<PrismaService, 'templateVersion'>,
    organizationId: string,
    templateId: string,
    versionId: string,
    failureMessage: string,
  ) {
    const claimed = await tx.templateVersion.updateMany({
      where: {
        id: versionId,
        templateId,
        organizationId,
        status: TemplateVersionStatus.DRAFT,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    if (claimed.count === 0) {
      throw new BadRequestException(failureMessage);
    }
  }

  private loadTemplate(
    db: TemplateClient,
    organizationId: string,
    templateId: string,
  ) {
    return db.inspectionTemplate.findFirstOrThrow({
      where: { id: templateId, organizationId },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
          include: versionInclude,
        },
      },
    });
  }

  private normalizeSections(sections: TemplateSectionDto[]) {
    return sections.map((section) => ({
      name: section.name.trim(),
      items: section.items.map((item) => this.normalizeItem(item)),
    }));
  }

  private normalizeItem(item: TemplateItemDto) {
    const name = item.name.trim();

    if (item.type !== TemplateItemType.NUMERIC) {
      return {
        name,
        type: item.type,
        unit: null as string | null,
        minValue: null as number | null,
        maxValue: null as number | null,
      };
    }

    if (
      item.minValue != null &&
      item.maxValue != null &&
      item.minValue > item.maxValue
    ) {
      throw new BadRequestException(
        'Minimum must be less than or equal to maximum',
      );
    }

    return {
      name,
      type: item.type,
      unit: item.unit?.trim() || null,
      minValue: item.minValue ?? null,
      maxValue: item.maxValue ?? null,
    };
  }

  private toSectionCreates(
    sections: ReturnType<TemplatesService['normalizeSections']>,
  ) {
    return sections.map((section, sectionIndex) => ({
      name: section.name,
      sortOrder: sectionIndex,
      items: {
        create: section.items.map((item, itemIndex) =>
          this.toItemCreate(item, itemIndex),
        ),
      },
    }));
  }

  private toItemCreate(
    item: ReturnType<TemplatesService['normalizeItem']>,
    sortOrder: number,
  ) {
    return {
      name: item.name,
      type: item.type,
      sortOrder,
      unit: item.unit,
      minValue: item.minValue,
      maxValue: item.maxValue,
    };
  }

  private assertPublishable(
    sections: Array<{ name: string; items: Array<{ name: string }> }>,
  ) {
    const hasContent = sections.some(
      (section) => section.name.trim() && section.items.some((item) => item.name.trim()),
    );

    if (!hasContent) {
      throw new BadRequestException(
        'Publishing requires at least one section with at least one item',
      );
    }
  }

  private toListVersion(version: {
    id: string;
    versionNumber: number;
    status: TemplateVersionStatus;
    publishedAt: Date | null;
    sections: Array<{ _count: { items: number } }>;
  }) {
    return {
      id: version.id,
      versionNumber: version.versionNumber,
      status: version.status,
      publishedAt: version.publishedAt,
      sectionCount: version.sections.length,
      itemCount: version.sections.reduce(
        (total, section) => total + section._count.items,
        0,
      ),
    };
  }

  private toDetail(template: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    versions: Array<{
      id: string;
      versionNumber: number;
      status: TemplateVersionStatus;
      publishedAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
      sections: Array<{
        id: string;
        name: string;
        sortOrder: number;
        items: Array<{
          id: string;
          name: string;
          type: TemplateItemType;
          sortOrder: number;
          unit: string | null;
          minValue: number | null;
          maxValue: number | null;
        }>;
      }>;
    }>;
  }) {
    return {
      id: template.id,
      name: template.name,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      versions: template.versions.map((version) => ({
        id: version.id,
        versionNumber: version.versionNumber,
        status: version.status,
        publishedAt: version.publishedAt,
        createdAt: version.createdAt,
        updatedAt: version.updatedAt,
        sections: version.sections.map((section) => ({
          id: section.id,
          name: section.name,
          sortOrder: section.sortOrder,
          items: section.items.map((item) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            sortOrder: item.sortOrder,
            unit: item.unit,
            minValue: item.minValue,
            maxValue: item.maxValue,
          })),
        })),
      })),
    };
  }

  private rethrowUniqueDraftConflict(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('A draft version already exists');
    }

    throw error;
  }
}
