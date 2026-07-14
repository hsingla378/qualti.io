'use client';

import { CircleAlert } from 'lucide-react';

import { capabilityGroups, painConsequences } from '@/lib/marketing-content';

import { Reveal, Stagger, StaggerItem } from './reveal';
import { SectionContainer, SectionIntro } from './section-container';

export function CapabilitiesSection() {
  return (
    <SectionContainer id="capabilities" className="bg-marketing-panel">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
        <SectionIntro
          eyebrow="Capabilities"
          title="AI-assisted QC — without another spreadsheet workflow"
        >
          <p>
            Qualti.io is an AI-powered quality control platform for furniture inspections. It
            replaces paper, Excel and WhatsApp with one record for field audits, defect logging and
            buyer-ready reports.
          </p>
        </SectionIntro>

        <div className="min-w-0">
          <Stagger
            className="grid gap-8 sm:grid-cols-2"
            stagger={0.07}
            delay={0.04}
            aria-label="Product capabilities"
          >
            {capabilityGroups.map((group) => (
              <StaggerItem key={group.label}>
                <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-marketing-primary">
                  {group.label}
                </h3>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="border-b border-marketing-line pb-2 text-[15px] leading-6 text-marketing-ink last:border-b-0 last:pb-0"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-10 space-y-3 border-t border-marketing-line pt-8" delay={0.15} as="ul">
            {painConsequences.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[14px] leading-6 text-marketing-muted"
              >
                <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </SectionContainer>
  );
}
