'use client';

import { FileStack, Plus, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/features/auth/hooks';
import { useTemplates } from '@/features/templates/hooks';

const statusVariant: Record<string, 'secondary' | 'success'> = {
  DRAFT: 'secondary',
  PUBLISHED: 'success',
};

export default function TemplatesPage() {
  const router = useRouter();
  const { organization } = useAuth();
  const organizationId = organization?.id;
  const templatesQuery = useTemplates(organizationId);
  const templates = templatesQuery.data ?? [];
  const publishedCount = templates.filter(
    (template) => template.publishedVersionNumber != null,
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Templates"
        description="Create and manage versioned inspection templates."
      >
        <Button asChild>
          <Link href="/app/templates/new">
            <Plus className="size-4" />
            New template
          </Link>
        </Button>
      </PageHeader>

      {templatesQuery.isLoading ? (
        <TemplatesLoadingState />
      ) : templatesQuery.isError ? (
        <TemplatesErrorState onRetry={() => void templatesQuery.refetch()} />
      ) : templates.length === 0 ? (
        <EmptyState
          icon={FileStack}
          title="No templates yet"
          description="Create a furniture QC checklist, keep it as a draft, then publish an immutable version for inspections."
          actionLabel="New template"
          onAction={() => router.push('/app/templates/new')}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border bg-background">
          <div className="border-b px-4 py-3 text-sm text-muted-foreground">
            {templates.length} templates · {publishedCount} published
          </div>
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Template</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Version</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Items</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => {
                const status = template.currentVersion?.status ?? 'DRAFT';

                return (
                  <tr key={template.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link href={`/app/templates/${template.id}`} className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                          <FileStack className="size-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">
                            v{template.currentVersion?.versionNumber ?? 1}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      v{template.currentVersion?.versionNumber ?? 1}
                      {template.draftVersionId && template.publishedVersionNumber != null ? (
                        <span className="ml-2 text-xs text-muted-foreground">
                          published v{template.publishedVersionNumber}
                        </span>
                      ) : null}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {template.currentVersion?.itemCount ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[status]}>{status.toLowerCase()}</Badge>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {formatDate(template.updatedAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TemplatesLoadingState() {
  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-10 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    </div>
  );
}

function TemplatesErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-destructive">Templates could not be loaded</h2>
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(value));
}
