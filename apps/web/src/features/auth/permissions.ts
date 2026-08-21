export const Permission = {
  TemplateRead: 'template.read',
  TemplateCreate: 'template.create',
  TemplateUpdate: 'template.update',
  TemplatePublish: 'template.publish',
  SiteRead: 'site.read',
  SiteCreate: 'site.create',
  SiteUpdate: 'site.update',
  SiteDelete: 'site.delete',
  AuditRead: 'audit.read',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];
