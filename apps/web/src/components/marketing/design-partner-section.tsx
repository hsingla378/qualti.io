'use client';

import { CheckCircle2, MapPin } from 'lucide-react';

import { partnerReceives, qualtiNeeds } from '@/lib/marketing-content';

import { LeadForm } from './lead-form';
import { Reveal } from './reveal';
import { SectionContainer } from './section-container';

export function DesignPartnerSection() {
  return (
    <SectionContainer id="design-partner" className="marketing-atmosphere">
      <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
        <Reveal className="min-w-0" variant="left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-marketing-primary">
            Design partner program
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-marketing-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Shape Qualti.io with real furniture factories
          </h2>
          <p className="mt-5 text-base leading-7 text-marketing-muted sm:text-lg sm:leading-8">
            We are speaking with manufacturers, exporters, brands and sourcing teams about final
            inspections, photographic evidence, rework and buyer reporting — before we freeze the
            pilot.
          </p>

          <p className="mt-5 flex items-start gap-2 text-[15px] leading-6 text-marketing-muted">
            <MapPin className="mt-0.5 size-4 shrink-0 text-marketing-primary" aria-hidden="true" />
            Active conversations in Gurugram, Manesar, Delhi and across India.
          </p>

          <div className="mt-10 grid gap-9">
            <PartnerList title="What we ask for" items={qualtiNeeds} />
            <PartnerList title="What you receive" items={partnerReceives} />
          </div>

          <p className="mt-8 border-l-2 border-marketing-primary/50 pl-4 text-[15px] font-medium leading-6 text-marketing-ink">
            No confidential information is required. Checklists and reports can be anonymised.
          </p>
        </Reveal>

        <Reveal className="min-w-0" delay={0.12} variant="scale">
          <LeadForm />
        </Reveal>
      </div>
    </SectionContainer>
  );
}

function PartnerList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <h3 className="font-heading text-base font-semibold text-marketing-ink">{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-[15px] leading-6 text-marketing-muted"
          >
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0 text-marketing-primary"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
