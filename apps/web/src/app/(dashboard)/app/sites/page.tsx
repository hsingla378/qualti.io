'use client';

import { MapPin, Pencil, Plus, RefreshCcw, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { useAuth, useHasPermission } from '@/features/auth/hooks';
import { Permission } from '@/features/auth/permissions';
import type { Site } from '@/features/sites/api';
import { SiteForm } from '@/features/sites/site-form';
import { useCreateSite, useDeleteSite, useSites, useUpdateSite } from '@/features/sites/hooks';

export default function SitesPage() {
  const { organization } = useAuth();
  const organizationId = organization?.id;
  const canCreateSite = useHasPermission(Permission.SiteCreate);
  const canUpdateSite = useHasPermission(Permission.SiteUpdate);
  const canDeleteSite = useHasPermission(Permission.SiteDelete);
  const canManageSites = canCreateSite || canUpdateSite || canDeleteSite;

  const [createOpen, setCreateOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);

  const sitesQuery = useSites(organizationId);
  const createSite = useCreateSite(organizationId ?? '');
  const updateSite = useUpdateSite(organizationId ?? '');
  const deleteSite = useDeleteSite(organizationId ?? '');

  const sites = sitesQuery.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Sites" description="Manage inspection locations across your organization.">
        {canCreateSite ? (
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Add site
          </Button>
        ) : null}
      </PageHeader>

      {sitesQuery.isLoading ? (
        <SitesLoadingState />
      ) : sitesQuery.isError ? (
        <SitesErrorState onRetry={() => void sitesQuery.refetch()} />
      ) : sites.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No sites yet"
          description="Create your first site so inspections can be organized by location."
          actionLabel={canCreateSite ? 'Add site' : undefined}
          onAction={canCreateSite ? () => setCreateOpen(true) : undefined}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border bg-background">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Created</th>
                {canManageSites ? (
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{site.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{site.code || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{site.location || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(site.createdAt)}</td>
                  {canManageSites ? (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {canUpdateSite ? (
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={`Edit ${site.name}`}
                            onClick={() => setEditingSite(site)}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        ) : null}
                        {canDeleteSite ? (
                          <Button
                            variant="destructive"
                            size="icon"
                            aria-label={`Delete ${site.name}`}
                            disabled={deleteSite.isPending}
                            onClick={() => deleteSite.mutate(site.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {canCreateSite ? (
      <SiteModal title="Create site" open={createOpen} onClose={() => setCreateOpen(false)}>
        <SiteForm
          submitLabel="Create site"
          isSubmitting={createSite.isPending}
          onSubmit={(input) => {
            createSite.mutate(input, {
              onSuccess: () => setCreateOpen(false),
            });
          }}
        />
        {createSite.error ? <MutationError error={createSite.error} /> : null}
      </SiteModal>
      ) : null}

      {canUpdateSite ? (
      <SiteModal title="Edit site" open={Boolean(editingSite)} onClose={() => setEditingSite(null)}>
        {editingSite ? (
          <>
            <SiteForm
              submitLabel="Save changes"
              isSubmitting={updateSite.isPending}
              initialValues={{
                name: editingSite.name,
                code: editingSite.code ?? '',
                location: editingSite.location ?? '',
              }}
              onSubmit={(input) => {
                updateSite.mutate(
                  {
                    siteId: editingSite.id,
                    input,
                  },
                  {
                    onSuccess: () => setEditingSite(null),
                  },
                );
              }}
            />
            {updateSite.error ? <MutationError error={updateSite.error} /> : null}
          </>
        ) : null}
      </SiteModal>
      ) : null}
    </div>
  );
}

function SitesLoadingState() {
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

function SitesErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-destructive">Sites could not be loaded</h2>
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

function SiteModal({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-modal-title"
        className="w-full max-w-md rounded-lg border bg-background p-5 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="site-modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

function MutationError({ error }: { error: Error }) {
  return <p className="mt-3 text-sm text-destructive">{error.message}</p>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(value));
}
