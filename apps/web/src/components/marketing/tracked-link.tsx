'use client';

import type { ComponentProps } from 'react';

import { trackMarketingEvent, type MarketingEventName } from '@/lib/analytics';

type TrackedLinkProps = ComponentProps<'a'> & {
  event: MarketingEventName;
  eventProperties?: Record<string, string | number | boolean>;
};

export function TrackedLink({ event, eventProperties, onClick, ...props }: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(clickEvent) => {
        trackMarketingEvent(event, eventProperties);
        onClick?.(clickEvent);
      }}
    />
  );
}
