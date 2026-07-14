import type { LeadSubmissionInput } from './lead-schema';

type SubmitLeadOptions = {
  endpoint?: string;
};

export type SubmitLeadResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'missing_endpoint' | 'request_failed';
      message: string;
      developmentPayload?: LeadSubmissionInput;
    };

const missingEndpointMessage =
  'Waitlist signup is not configured yet. Please email the Qualti.io team or configure NEXT_PUBLIC_LEAD_ENDPOINT.';

export async function submitLead(
  input: LeadSubmissionInput,
  options: SubmitLeadOptions = {},
): Promise<SubmitLeadResult> {
  const endpoint = options.endpoint ?? process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? '';

  if (!endpoint) {
    return {
      ok: false,
      reason: 'missing_endpoint',
      message: missingEndpointMessage,
      ...(process.env.NODE_ENV === 'development' ? { developmentPayload: input } : {}),
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      return {
        ok: false,
        reason: 'request_failed',
        message:
          'The waitlist endpoint did not accept the request. Please try again or email the Qualti.io team.',
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      reason: 'request_failed',
      message:
        'Unable to reach the lead endpoint. Your details are still in the form; please try again.',
    };
  }
}
