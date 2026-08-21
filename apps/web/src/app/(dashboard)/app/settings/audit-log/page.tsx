'use client';

import { RefreshCcw, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { useAuth, useHasPermission } from '@/features/auth/hooks';
import { Permission } from '@/features/auth/permissions';
import type { AuditEvent } from '@/features/audit/api';
import { useAuditEvents } from '@/features/audit/hooks';

export default function AuditLogPage() {
  const { organization } = useAuth();
  const organizationId = organization?.id;
  const canReadAudit = useHasPermission(Permission.AuditRead);

  const auditQuery = useAuditEvents(canReadAudit ? organizationId : undefined);
  const events = auditQuery.data ?? [];

  if (!canReadAudit) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Audit log"
          description="Review security and data changes across your organization."
        />
        <div className="rounded-lg border bg-muted/30 p-6 text-sm text-muted-foreground">
          You do not have permission to view the audit log. Ask an owner, admin, or reviewer if
          you need access.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit log"
        description="Review security and data changes across your organization."
      />

      {auditQuery.isLoading ? (
        <AuditLogLoadingState />
      ) : auditQuery.isError ? (
        <AuditLogErrorState onRetry={() => void auditQuery.refetch()} />
      ) : events.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No audit events yet"
          description="Important actions like logins, site changes, and organization creation will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border bg-background">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Entity</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b align-top last:border-0">
                  <td className="px-4 py-3 font-medium">{formatAction(event.action)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div>{event.entityType}</div>
                    {event.entityId ? (
                      <div className="mt-1 max-w-36 truncate font-mono text-xs">
                        {event.entityId}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatActor(event)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDateTime(event.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <pre className="max-w-md overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
                      {formatMetadata(event.metadata)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AuditLogLoadingState() {
  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <div className="space-y-3 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-12 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    </div>
  );
}

function AuditLogErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-destructive">Audit log could not be loaded</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Try again. If it keeps failing, check that the API server is running.
          </p>
        </div>
        <Button variant="outline" onClick={onRetry}>
          <RefreshCcw className="size-4" />
          Retry
        </Button>
      </div>
    </div>
  );
}

function formatAction(action: string) {
  return action
    .split('.')
    .map((part) => part.replace(/_/g, ' '))
    .join(' ');
}

function formatActor(event: AuditEvent) {
  if (!event.actor) {
    return 'System';
  }

  return event.actor.name || event.actor.email;
}

function formatMetadata(metadata: unknown) {
  if (!metadata) {
    return 'No metadata';
  }

  return JSON.stringify(metadata, null, 2);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
