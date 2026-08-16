'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { auditEventsQueryKey } from '@/features/audit/hooks';

import {
  createTemplate,
  createTemplateVersion,
  getTemplate,
  listTemplates,
  publishTemplateVersion,
  type TemplateWriteInput,
  updateTemplateVersion,
} from './api';

export function templatesQueryKey(organizationId: string) {
  return ['templates', organizationId] as const;
}

export function templateQueryKey(organizationId: string, templateId: string) {
  return ['templates', organizationId, templateId] as const;
}

export function useTemplates(organizationId: string | undefined) {
  return useQuery({
    queryKey: organizationId ? templatesQueryKey(organizationId) : ['templates', 'none'],
    queryFn: () => listTemplates(organizationId!),
    enabled: Boolean(organizationId),
  });
}

export function useTemplate(organizationId: string | undefined, templateId: string | undefined) {
  return useQuery({
    queryKey:
      organizationId && templateId
        ? templateQueryKey(organizationId, templateId)
        : ['templates', 'none', 'detail'],
    queryFn: () => getTemplate(organizationId!, templateId!),
    enabled: Boolean(organizationId && templateId),
  });
}

function useInvalidateTemplates(organizationId: string) {
  const queryClient = useQueryClient();

  return (templateId?: string) => {
    void queryClient.invalidateQueries({
      queryKey: templatesQueryKey(organizationId),
    });
    void queryClient.invalidateQueries({
      queryKey: auditEventsQueryKey(organizationId),
    });

    if (templateId) {
      void queryClient.invalidateQueries({
        queryKey: templateQueryKey(organizationId, templateId),
      });
    }
  };
}

export function useCreateTemplate(organizationId: string) {
  const invalidate = useInvalidateTemplates(organizationId);

  return useMutation({
    mutationFn: (input: TemplateWriteInput) => createTemplate(organizationId, input),
    onSuccess: (template) => {
      invalidate(template.id);
    },
  });
}

export function useUpdateTemplateVersion(organizationId: string, templateId: string) {
  const invalidate = useInvalidateTemplates(organizationId);

  return useMutation({
    mutationFn: ({ versionId, input }: { versionId: string; input: TemplateWriteInput }) =>
      updateTemplateVersion(organizationId, templateId, versionId, input),
    onSuccess: () => {
      invalidate(templateId);
    },
  });
}

export function usePublishTemplateVersion(organizationId: string, templateId: string) {
  const invalidate = useInvalidateTemplates(organizationId);

  return useMutation({
    mutationFn: (versionId: string) =>
      publishTemplateVersion(organizationId, templateId, versionId),
    onSuccess: () => {
      invalidate(templateId);
    },
  });
}

export function useCreateTemplateVersion(organizationId: string, templateId: string) {
  const invalidate = useInvalidateTemplates(organizationId);

  return useMutation({
    mutationFn: () => createTemplateVersion(organizationId, templateId),
    onSuccess: () => {
      invalidate(templateId);
    },
  });
}
