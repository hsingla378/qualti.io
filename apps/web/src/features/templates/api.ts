import { apiRequest } from '@/lib/api-client';

export const templateItemTypes = ['PASS_FAIL', 'TEXT', 'NUMERIC'] as const;

export type TemplateItemType = (typeof templateItemTypes)[number];
export type TemplateVersionStatus = 'DRAFT' | 'PUBLISHED';

export type TemplateItem = {
  id: string;
  name: string;
  type: TemplateItemType;
  sortOrder: number;
  unit: string | null;
  minValue: number | null;
  maxValue: number | null;
};

export type TemplateSection = {
  id: string;
  name: string;
  sortOrder: number;
  items: TemplateItem[];
};

export type TemplateVersion = {
  id: string;
  versionNumber: number;
  status: TemplateVersionStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  sections: TemplateSection[];
};

export type TemplateDetail = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  versions: TemplateVersion[];
};

export type TemplateListItem = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currentVersion: {
    id: string;
    versionNumber: number;
    status: TemplateVersionStatus;
    publishedAt: string | null;
    sectionCount: number;
    itemCount: number;
  } | null;
  draftVersionId: string | null;
  publishedVersionNumber: number | null;
};

export type TemplateWriteInput = {
  name: string;
  sections: Array<{
    name: string;
    items: Array<{
      name: string;
      type: TemplateItemType;
      unit?: string;
      minValue?: number;
      maxValue?: number;
    }>;
  }>;
};

export function listTemplates(organizationId: string) {
  return apiRequest<TemplateListItem[]>('/templates', {
    organizationId,
  });
}

export function getTemplate(organizationId: string, templateId: string) {
  return apiRequest<TemplateDetail>(`/templates/${templateId}`, {
    organizationId,
  });
}

export function createTemplate(organizationId: string, input: TemplateWriteInput) {
  return apiRequest<TemplateDetail>('/templates', {
    method: 'POST',
    organizationId,
    body: JSON.stringify(input),
  });
}

export function updateTemplateVersion(
  organizationId: string,
  templateId: string,
  versionId: string,
  input: TemplateWriteInput,
) {
  return apiRequest<TemplateDetail>(`/templates/${templateId}/versions/${versionId}`, {
    method: 'PATCH',
    organizationId,
    body: JSON.stringify(input),
  });
}

export function publishTemplateVersion(
  organizationId: string,
  templateId: string,
  versionId: string,
) {
  return apiRequest<TemplateDetail>(`/templates/${templateId}/versions/${versionId}/publish`, {
    method: 'POST',
    organizationId,
  });
}

export function createTemplateVersion(organizationId: string, templateId: string) {
  return apiRequest<TemplateDetail>(`/templates/${templateId}/versions`, {
    method: 'POST',
    organizationId,
  });
}

export function getDraftVersion(template: TemplateDetail) {
  return template.versions.find((version) => version.status === 'DRAFT') ?? null;
}

export function getCurrentVersion(template: TemplateDetail) {
  return getDraftVersion(template) ?? template.versions[0] ?? null;
}

export function checklistIsPublishable(
  sections: Array<{ name: string; items: Array<{ name: string }> }>,
) {
  return sections.some(
    (section) => section.name.trim() && section.items.some((item) => item.name.trim()),
  );
}

export function versionIsPublishable(version: TemplateVersion) {
  return checklistIsPublishable(version.sections);
}
