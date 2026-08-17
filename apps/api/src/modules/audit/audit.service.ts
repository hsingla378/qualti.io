import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type RecordAuditEventInput = {
  organizationId: string;
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
};

type AuditWriter = {
  auditEvent: {
    create: PrismaService['auditEvent']['create'];
  };
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  // Callers that already hold a transaction pass it here so the audit write
  // rolls back with the business change instead of landing on the root client.
  record(input: RecordAuditEventInput, db: AuditWriter = this.prisma) {
    return db.auditEvent.create({
      data: {
        organizationId: input.organizationId,
        actorId: input.actorId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata,
      },
    });
  }

  findAll(organizationId: string) {
    return this.prisma.auditEvent.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
