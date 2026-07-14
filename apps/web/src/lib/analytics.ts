export type MarketingEventName =
  | 'hero_qc_review_clicked'
  | 'waitlist_join_clicked'
  | 'workflow_view_clicked'
  | 'lead_form_started'
  | 'lead_form_submitted'
  | 'lead_form_failed';

type DataLayerEvent = {
  event: MarketingEventName;
  properties?: Record<string, string | number | boolean>;
};

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function trackMarketingEvent(
  event: MarketingEventName,
  properties?: DataLayerEvent['properties'],
) {
  if (typeof window === 'undefined') return;

  window.dataLayer?.push({ event, properties });

  if (process.env.NODE_ENV === 'development') {
    console.info('[marketing-event]', event, properties ?? {});
  }
}
