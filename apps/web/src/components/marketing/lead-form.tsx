'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { cloneElement, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trackMarketingEvent } from '@/lib/analytics';
import {
  companyTypes,
  leadFormSchema,
  monthlyInspectionRanges,
  qcProcesses,
  toLeadSubmissionInput,
  type LeadFormValues,
  type LeadSubmissionInput,
} from '@/lib/lead-schema';
import { submitLead, type SubmitLeadResult } from '@/lib/lead-submission';
import { cn } from '@/lib/utils';

const defaultValues: LeadFormValues = {
  fullName: '',
  workEmail: '',
  phone: '',
  companyName: '',
  role: '',
  companyType: 'Furniture manufacturer',
  currentQcProcess: '',
  monthlyInspections: '',
  message: '',
  consent: false,
};

export function LeadForm() {
  const [result, setResult] = useState<SubmitLeadResult | null>(null);
  const started = useRef(false);
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues,
  });

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackMarketingEvent('lead_form_started');
  }

  async function onSubmit(values: LeadFormValues) {
    setResult(null);
    const input = toLeadSubmissionInput(values);
    const submission = await submitLead(input);
    setResult(submission);

    if (submission.ok) {
      trackMarketingEvent('lead_form_submitted', {
        companyType: input.companyType,
        monthlyInspections: input.monthlyInspections ?? 'not_provided',
        intent: 'waitlist',
      });
      form.reset(defaultValues);
    } else {
      trackMarketingEvent('lead_form_failed', { reason: submission.reason });
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form
      id="waitlist-form"
      className="rounded-xl border border-marketing-line bg-white p-4 sm:p-6"
      onFocusCapture={markStarted}
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-marketing-primary">
          Waitlist
        </p>
        <h3 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-marketing-ink">
          Join the early access list
        </h3>
        <p className="mt-2 text-[15px] leading-6 text-marketing-muted">
          Tell us who you are and we&apos;ll reserve your spot. Takes under a minute.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field id="fullName" label="Full name" error={form.formState.errors.fullName?.message}>
          <Input
            id="fullName"
            autoComplete="name"
            className="h-11 text-[15px]"
            disabled={isSubmitting}
            {...form.register('fullName')}
          />
        </Field>
        <Field
          id="workEmail"
          label="Work email"
          error={form.formState.errors.workEmail?.message}
        >
          <Input
            id="workEmail"
            type="email"
            autoComplete="email"
            disabled={isSubmitting}
            className="h-11 text-[15px]"
            placeholder="name@company.com"
            {...form.register('workEmail')}
          />
        </Field>
        <Field
          id="phone"
          label="Phone/WhatsApp number"
          error={form.formState.errors.phone?.message}
        >
          <Input
            id="phone"
            autoComplete="tel"
            disabled={isSubmitting}
            className="h-11 text-[15px]"
            placeholder="+91..."
            {...form.register('phone')}
          />
        </Field>
        <Field
          id="companyName"
          label="Company name"
          error={form.formState.errors.companyName?.message}
        >
          <Input
            id="companyName"
            autoComplete="organization"
            className="h-11 text-[15px]"
            disabled={isSubmitting}
            {...form.register('companyName')}
          />
        </Field>
        <Field id="role" label="Role" error={form.formState.errors.role?.message}>
          <Input
            id="role"
            autoComplete="organization-title"
            className="h-11 text-[15px]"
            disabled={isSubmitting}
            {...form.register('role')}
          />
        </Field>
        <SelectField
          id="companyType"
          label="Company type"
          disabled={isSubmitting}
          error={form.formState.errors.companyType?.message}
          {...form.register('companyType')}
        >
          {companyTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </SelectField>
        <SelectField
          id="currentQcProcess"
          label="Current QC process (optional)"
          disabled={isSubmitting}
          error={form.formState.errors.currentQcProcess?.message}
          {...form.register('currentQcProcess')}
        >
          <option value="">Select if useful</option>
          {qcProcesses.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </SelectField>
        <SelectField
          id="monthlyInspections"
          label="Approximate monthly inspections (optional)"
          disabled={isSubmitting}
          error={form.formState.errors.monthlyInspections?.message}
          {...form.register('monthlyInspections')}
        >
          <option value="">Select if useful</option>
          {monthlyInspectionRanges.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </SelectField>
      </div>

      <Field
        id="message"
        label="Anything we should know? (optional)"
        error={form.formState.errors.message?.message}
        className="mt-4"
      >
        <textarea
          id="message"
          rows={3}
          disabled={isSubmitting}
          className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-[15px] shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Biggest QC pain, products you inspect, or when you’d want to start."
          {...form.register('message')}
        />
      </Field>

      <div className="mt-4">
        <label className="flex items-start gap-3 rounded-md border border-marketing-line bg-marketing-bg p-3 text-[15px] leading-6 text-marketing-muted">
          <input
            type="checkbox"
            className="mt-1 size-4 rounded border-marketing-line text-marketing-primary focus:ring-marketing-primary"
            disabled={isSubmitting}
            aria-invalid={Boolean(form.formState.errors.consent)}
            aria-describedby={form.formState.errors.consent ? 'consent-error' : undefined}
            {...form.register('consent')}
          />
          <span>
            I agree that Qualti.io may contact me about waitlist status and early access. No spam —
            just product updates when they matter.
          </span>
        </label>
        {form.formState.errors.consent?.message ? (
          <p id="consent-error" className="mt-2 text-sm text-destructive" role="alert">
            {form.formState.errors.consent.message}
          </p>
        ) : null}
      </div>

      {result ? <SubmissionMessage result={result} /> : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 h-12 w-full bg-marketing-primary text-base text-marketing-primary-foreground hover:bg-marketing-primary/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Joining waitlist...
          </>
        ) : (
          'Join the waitlist'
        )}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
  className,
}: {
  id: keyof LeadFormValues;
  label: string;
  error?: string;
  children: React.ReactElement<{
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
  }>;
  className?: string;
}) {
  const errorId = `${id}-error`;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      {cloneElement(children, {
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? errorId : undefined,
      })}
      {error ? (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type SelectFieldProps = React.ComponentProps<'select'> & {
  id: keyof LeadFormValues;
  label: string;
  error?: string;
};

function SelectField({ id, label, error, children, className, ...props }: SelectFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'flex h-11 w-full rounded-lg border border-input bg-background px-3 py-1 text-[15px] shadow-xs transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SubmissionMessage({ result }: { result: SubmitLeadResult }) {
  if (result.ok) {
    return (
      <div
        className="mt-4 flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>You&apos;re on the waitlist. We&apos;ll email you when early access opens.</p>
      </div>
    );
  }

  return (
    <div
      className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>{result.message}</p>
      </div>
      {result.developmentPayload ? (
        <DevelopmentFallback payload={result.developmentPayload} />
      ) : null}
    </div>
  );
}

function DevelopmentFallback({ payload }: { payload: LeadSubmissionInput }) {
  return (
    <details className="mt-3">
      <summary className="cursor-pointer font-semibold">Development fallback payload</summary>
      <pre className="mt-2 max-h-64 overflow-auto rounded bg-white/70 p-3 text-xs leading-5">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </details>
  );
}
