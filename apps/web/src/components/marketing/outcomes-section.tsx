'use client';

import { CheckCircle2 } from 'lucide-react';

import { outcomes } from '@/lib/marketing-content';

import { Stagger, StaggerItem } from './reveal';
import { SectionContainer, SectionIntro } from './section-container';

export function OutcomesSection() {
  return (
    <SectionContainer className="bg-marketing-panel">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
        <SectionIntro title="Built to sharpen the process — not add another admin layer">
          <p>
            The product goal is practical: evidence that is easier to collect, decisions that are
            easier to defend, and recurring quality issues that are easier to see across batches.
          </p>
        </SectionIntro>

        <Stagger as="ul" className="space-y-0" stagger={0.06} delay={0.04}>
          {outcomes.map((outcome) => (
            <StaggerItem
              key={outcome}
              as="li"
              className="flex items-start gap-3 border-b border-marketing-line py-4 first:pt-0 last:border-b-0"
            >
              <CheckCircle2
                className="mt-0.5 size-5 shrink-0 text-marketing-primary"
                aria-hidden="true"
              />
              <p className="text-[15px] leading-6 text-marketing-ink sm:text-base">{outcome}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </SectionContainer>
  );
}
