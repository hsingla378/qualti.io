'use client';

import {
  CircleAlert,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  MessageCircle,
  PhoneCall,
} from 'lucide-react';

import { currentWorkflow, painConsequences } from '@/lib/marketing-content';

import { Reveal, Stagger, StaggerItem } from './reveal';
import { SectionContainer, SectionIntro } from './section-container';

export function PainSection() {
  const workflowIcons = [ClipboardList, MessageCircle, FileSpreadsheet, PhoneCall, FileText];

  return (
    <SectionContainer className="bg-marketing-panel">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-20">
        <SectionIntro title="QC truth should not live in WhatsApp threads and Excel tabs.">
          <p>
            Before dispatch, evidence usually fragments across paper checklists, chat photos,
            spreadsheets and phone calls. Qualti.io keeps the last inspection as one record your
            team can act on — and your buyer can trust.
          </p>
        </SectionIntro>

        <div className="min-w-0">
          <Stagger as="ol" className="space-y-0" aria-label="Typical fragmented QC workflow" stagger={0.08}>
            {currentWorkflow.map((step, index) => {
              const Icon = workflowIcons[index] ?? ClipboardList;
              return (
                <StaggerItem key={step} as="li" className="relative flex gap-4 pb-6 last:pb-0">
                  {index < currentWorkflow.length - 1 ? (
                    <span
                      className="absolute left-[15px] top-9 h-[calc(100%-1.35rem)] w-px bg-marketing-line"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-md bg-marketing-primary/10 text-marketing-primary transition-colors duration-300">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <p className="min-w-0 pt-1.5 text-[15px] font-medium text-marketing-ink">{step}</p>
                </StaggerItem>
              );
            })}
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
