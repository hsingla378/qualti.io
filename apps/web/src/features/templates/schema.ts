import z from 'zod';

import { templateItemTypes, type TemplateDetail, type TemplateVersion, type TemplateWriteInput } from './api';

const optionalNumberString = z.string().refine(
  (value) => value.trim() === '' || Number.isFinite(Number(value)),
  'Enter a valid number',
);

export const templateItemSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Item name is required')
      .max(200, 'Item name must be 200 characters or less'),
    type: z.enum(templateItemTypes),
    unit: z.string().max(32, 'Unit must be 32 characters or less'),
    minValue: optionalNumberString,
    maxValue: optionalNumberString,
  })
  .superRefine((item, ctx) => {
    if (item.type !== 'NUMERIC') {
      return;
    }

    const min = parseOptionalNumber(item.minValue);
    const max = parseOptionalNumber(item.maxValue);

    if (min != null && max != null && min > max) {
      ctx.addIssue({
        code: 'custom',
        message: 'Minimum must be less than or equal to maximum',
        path: ['minValue'],
      });
    }
  });

export const templateSectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Section name is required')
    .max(120, 'Section name must be 120 characters or less'),
  items: z.array(templateItemSchema).min(1, 'Add at least one item'),
});

export const templateFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Template name is required')
    .max(120, 'Template name must be 120 characters or less'),
  sections: z.array(templateSectionSchema),
});

export type TemplateFormValues = z.infer<typeof templateFormSchema>;

export const emptyTemplateItem: TemplateFormValues['sections'][number]['items'][number] = {
  name: '',
  type: 'PASS_FAIL',
  unit: '',
  minValue: '',
  maxValue: '',
};

export const emptyTemplateSection: TemplateFormValues['sections'][number] = {
  name: '',
  items: [{ ...emptyTemplateItem }],
};

export const emptyTemplateValues: TemplateFormValues = {
  name: '',
  sections: [{ ...emptyTemplateSection, items: [{ ...emptyTemplateItem }] }],
};

export function parseOptionalNumber(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function toTemplateWriteInput(values: TemplateFormValues): TemplateWriteInput {
  return {
    name: values.name.trim(),
    sections: values.sections.map((section) => ({
      name: section.name.trim(),
      items: section.items.map((item) => {
        const isNumeric = item.type === 'NUMERIC';

        return {
          name: item.name.trim(),
          type: item.type,
          unit: isNumeric ? item.unit.trim() || undefined : undefined,
          minValue: isNumeric ? parseOptionalNumber(item.minValue) : undefined,
          maxValue: isNumeric ? parseOptionalNumber(item.maxValue) : undefined,
        };
      }),
    })),
  };
}

export function toTemplateFormValues(
  template: TemplateDetail,
  version: TemplateVersion,
): TemplateFormValues {
  return {
    name: template.name,
    sections:
      version.sections.length > 0
        ? version.sections.map((section) => ({
            name: section.name,
            items:
              section.items.length > 0
                ? section.items.map((item) => ({
                    name: item.name,
                    type: item.type,
                    unit: item.unit ?? '',
                    minValue: item.minValue == null ? '' : String(item.minValue),
                    maxValue: item.maxValue == null ? '' : String(item.maxValue),
                  }))
                : [{ ...emptyTemplateItem }],
          }))
        : [{ ...emptyTemplateSection, items: [{ ...emptyTemplateItem }] }],
  };
}
