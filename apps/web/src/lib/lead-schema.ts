import z from 'zod';

export const companyTypes = [
  'Furniture manufacturer',
  'Furniture exporter',
  'Furniture brand',
  'Buying house or sourcing company',
  'Contract/project furniture company',
  'Inspection or quality consultancy',
  'Other',
] as const;

export const qcProcesses = [
  'Paper',
  'Excel',
  'WhatsApp',
  'Existing inspection software',
  'Combination',
] as const;

export const monthlyInspectionRanges = [
  'Fewer than 20',
  '20-100',
  '101-500',
  'More than 500',
  'Not sure',
] as const;

export const leadFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name is required')
      .max(80, 'Full name must be 80 characters or less'),
    workEmail: z
      .string()
      .trim()
      .max(120, 'Email must be 120 characters or less')
      .refine((value) => value === '' || z.email().safeParse(value).success, {
        message: 'Enter a valid work email',
      }),
    phone: z
      .string()
      .trim()
      .max(32, 'Phone number must be 32 characters or less')
      .refine((value) => value === '' || value.length >= 7, {
        message: 'Phone number must be at least 7 characters',
      }),
    companyName: z
      .string()
      .trim()
      .min(2, 'Company name is required')
      .max(120, 'Company name must be 120 characters or less'),
    role: z
      .string()
      .trim()
      .min(2, 'Role is required')
      .max(80, 'Role must be 80 characters or less'),
    companyType: z.enum(companyTypes, 'Select a company type'),
    currentQcProcess: z.string().trim().optional(),
    monthlyInspections: z.string().trim().optional(),
    message: z.string().trim().max(600, 'Message must be 600 characters or less').optional(),
    consent: z.boolean().refine((value) => value, 'Consent is required before submitting'),
  })
  .superRefine((values, context) => {
    if (!values.workEmail && !values.phone) {
      context.addIssue({
        code: 'custom',
        path: ['workEmail'],
        message: 'Enter a work email or phone/WhatsApp number',
      });
    }
  });

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export type LeadSubmissionInput = Omit<
  LeadFormValues,
  'workEmail' | 'phone' | 'currentQcProcess' | 'monthlyInspections' | 'message'
> & {
  workEmail?: string;
  phone?: string;
  currentQcProcess?: string;
  monthlyInspections?: string;
  message?: string;
  source: 'qualti-waitlist';
  intent: 'waitlist';
};

export function toLeadSubmissionInput(values: LeadFormValues): LeadSubmissionInput {
  return {
    ...values,
    workEmail: values.workEmail || undefined,
    phone: values.phone || undefined,
    currentQcProcess: values.currentQcProcess || undefined,
    monthlyInspections: values.monthlyInspections || undefined,
    message: values.message || undefined,
    source: 'qualti-waitlist',
    intent: 'waitlist',
  };
}
