'use client';

import { ArrowLeft, RefreshCcw, X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/features/auth/hooks';
import { getCurrentVersion, getDraftVersion, type TemplateWriteInput } from '@/features/templates/api';
import {
  useCreateTemplateVersion,
  usePublishTemplateVersion,
  useTemplate,
  useUpdateTemplateVersion,
} from '@/features/templates/hooks';
import { toTemplateFormValues } from '@/features/templates/schema';
import { TemplateBuilder } from '@/features/templates/template-builder';

export default function TemplateDetailPage() {
  const params = useParams<{ templateId: string }>();
  const templateId = params.templateId;
  const { organization } = useAuth();
  const organizationId = organization?.id;

  const [pendingPublish, setPendingPublish] = useState<{
    versionId: string;
    input: TemplateWriteInput;
  } | null>(null);

  const templateQuery = useTemplate(organizationId, templateId);
  const template = templateQuery.data;
  const currentVersion = template ? getCurrentVersion(template) : null;
  const draftVersion = template ? getDraftVersion(template) : null;
  const readOnly = !draftVersion;

  const updateVersion = useUpdateTemplateVersion(organizationId ?? '', templateId);
  const publishVersion = usePublishTemplateVersion(organizationId ?? '', templateId);
  const createVersion = useCreateTemplateVersion(organizationId ?? '', templateId);
  const isPublishing = Boolean(pendingPublish) && (updateVersion.isPending || publishVersion.isPending);

  const initialValues = useMemo(() => {
    if (!template || !currentVersion) {
      return undefined;
    }

    return toTemplateFormValues(template, currentVersion);
  }, [template, currentVersion]);

  const publishedCount = template?.versions.filter((version) => version.status === 'PUBLISHED').length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={template?.name ?? 'Template'}
        description={
          currentVersion
            ? readOnly
              ? 'This published version is frozen. Create a new draft to make changes.'
              : 'Edit the draft, then publish it to freeze an immutable inspection snapshot.'
            : 'Load a versioned inspection template.'
        }
      >
        <Button variant="outline" asChild>
          <Link href="/app/templates">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      </PageHeader>

      {templateQuery.isLoading ? (
        <TemplateLoadingState />
      ) : templateQuery.isError ? (
        <TemplateErrorState onRetry={() => void templateQuery.refetch()} />
      ) : template && currentVersion && initialValues ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={currentVersion.status === 'PUBLISHED' ? 'success' : 'secondary'}>
              {currentVersion.status.toLowerCase()} v{currentVersion.versionNumber}
            </Badge>
            {publishedCount > 0 && draftVersion ? (
              <span className="text-sm text-muted-foreground">
                Latest published version is v{template.versions.find((version) => version.status === 'PUBLISHED')?.versionNumber}
              </span>
            ) : null}
          </div>

          <div className="max-w-4xl">
            <TemplateBuilder
              key={`${template.id}-${currentVersion.id}-${currentVersion.updatedAt}`}
              initialValues={initialValues}
              readOnly={readOnly}
              locked={Boolean(pendingPublish)}
              submitLabel="Save draft"
              isSubmitting={updateVersion.isPending && !pendingPublish}
              error={updateVersion.error ?? publishVersion.error ?? createVersion.error}
              onSubmit={(input) => {
                updateVersion.mutate({
                  versionId: currentVersion.id,
                  input,
                });
              }}
              extraActions={
                readOnly ? (
                  <Button
                    type="button"
                    disabled={createVersion.isPending}
                    onClick={() => createVersion.mutate()}
                  >
                    {createVersion.isPending ? 'Creating draft...' : 'Create new version'}
                  </Button>
                ) : null
              }
              publishAction={
                readOnly
                  ? undefined
                  : {
                      label: `Publish v${currentVersion.versionNumber}`,
                      isPending: isPublishing,
                      onRequest: (input) => {
                        setPendingPublish({
                          versionId: currentVersion.id,
                          input,
                        });
                      },
                    }
              }
            />
          </div>

          <ConfirmModal
            open={Boolean(pendingPublish)}
            title="Publish this version?"
            description={`This saves the checklist on screen, then freezes v${currentVersion.versionNumber}. Future inspections can use this snapshot, and you can create a new draft later.`}
            confirmLabel={isPublishing ? 'Publishing...' : 'Publish version'}
            isConfirming={isPublishing}
            error={pendingPublish ? (updateVersion.error ?? publishVersion.error) : undefined}
            onClose={() => {
              if (isPublishing) {
                return;
              }

              setPendingPublish(null);
            }}
            onConfirm={() => {
              if (!pendingPublish) {
                return;
              }

              void (async () => {
                try {
                  await updateVersion.mutateAsync({
                    versionId: pendingPublish.versionId,
                    input: pendingPublish.input,
                  });
                  await publishVersion.mutateAsync(pendingPublish.versionId);
                  setPendingPublish(null);
                } catch {
                  // Mutation error state is shown in the dialog.
                }
              })();
            }}
          />
        </>
      ) : (
        <TemplateErrorState onRetry={() => void templateQuery.refetch()} />
      )}
    </div>
  );
}

function TemplateLoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-24 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}

function TemplateErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-destructive">Template could not be loaded</h2>
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

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  isConfirming,
  error,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  isConfirming: boolean;
  error?: Error | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="publish-modal-title"
        className="w-full max-w-md rounded-lg border bg-background p-5 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="publish-modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close"
            disabled={isConfirming}
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        {error ? <p className="mt-3 text-sm text-destructive">{error.message}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" disabled={isConfirming} onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" disabled={isConfirming} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
