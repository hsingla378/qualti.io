'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/features/auth/hooks';
import { useCreateTemplate } from '@/features/templates/hooks';
import { emptyTemplateValues } from '@/features/templates/schema';
import { TemplateBuilder } from '@/features/templates/template-builder';

export default function NewTemplatePage() {
  const router = useRouter();
  const { organization } = useAuth();
  const organizationId = organization?.id ?? '';
  const createTemplate = useCreateTemplate(organizationId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="New template"
        description="Start a draft furniture QC checklist. You can publish an immutable version after it has at least one section and item."
      >
        <Button variant="outline" asChild>
          <Link href="/app/templates">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      </PageHeader>

      <div className="max-w-4xl">
        <TemplateBuilder
          initialValues={emptyTemplateValues}
          submitLabel="Create draft"
          isSubmitting={createTemplate.isPending}
          error={createTemplate.error}
          onSubmit={(input) => {
            createTemplate.mutate(input, {
              onSuccess: (template) => {
                router.push(`/app/templates/${template.id}`);
              },
            });
          }}
        />
      </div>
    </div>
  );
}
