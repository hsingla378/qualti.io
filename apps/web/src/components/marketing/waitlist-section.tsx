'use client';

import { CheckCircle2 } from 'lucide-react';

import { waitlistBenefits } from '@/lib/marketing-content';

import { LeadForm } from './lead-form';
import { Reveal } from './reveal';
import { SectionContainer } from './section-container';

export function WaitlistSection() {
  return (
    <SectionContainer id="waitlist" className="marketing-atmosphere">
      <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
        <Reveal className="min-w-0" variant="left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-marketing-primary">
            Early access
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-marketing-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            Join the waitlist for AI-assisted furniture QC
          </h2>
          <p className="mt-5 text-base leading-7 text-marketing-muted sm:text-lg sm:leading-8">
            Qualti.io is opening first to furniture manufacturers, exporters and QC teams who want
            field audits, defect logging and buyer-ready reports in one place. Get on the list
            early.
          </p>

          <div className="mt-10">
            <h3 className="font-heading text-base font-semibold text-marketing-ink">
              What you get on the list
            </h3>
            <ul className="mt-3 space-y-3">
              {waitlistBenefits.map((item) => (
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

          <p className="mt-8 border-l-2 border-marketing-primary/50 pl-4 text-[15px] font-medium leading-6 text-marketing-ink">
            No commitment. Join now, and we&apos;ll notify you when early access opens.
          </p>
        </Reveal>

        <Reveal className="min-w-0" delay={0.12} variant="scale">
          <LeadForm />
        </Reveal>
      </div>
    </SectionContainer>
  );
}
