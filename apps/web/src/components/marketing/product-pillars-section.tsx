'use client';

import { ClipboardCheck, FileText, ImagePlus } from 'lucide-react';

import { productPillars } from '@/lib/marketing-content';

import { SmoothAccordionItem } from './smooth-accordion';
import { Stagger, StaggerItem } from './reveal';
import { SectionContainer, SectionIntro } from './section-container';

const pillarIcons = [ClipboardCheck, ImagePlus, FileText] as const;

export function ProductPillarsSection() {
  return (
    <SectionContainer id="product-pillars" className="bg-white">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <SectionIntro
          eyebrow="Product"
          title="Field audits, defect logging, and inspection reports"
        >
          <p>
            Three workflows that factories already run — tightened into one AI-assisted system so
            evidence, ownership and the dispatch decision stay connected.
          </p>
        </SectionIntro>

        <Stagger
          className="divide-y divide-marketing-line border-y border-marketing-line"
          stagger={0.06}
          delay={0.05}
        >
          {productPillars.map((pillar, index) => {
            const Icon = pillarIcons[index] ?? ClipboardCheck;
            return (
              <StaggerItem key={pillar.title}>
                <SmoothAccordionItem
                  defaultOpen={index === 0}
                  title={
                    <span className="font-heading text-[15px] font-semibold text-marketing-ink">
                      {pillar.title}
                    </span>
                  }
                  leading={
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-marketing-primary/10 text-marketing-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                  }
                  summaryClassName="min-h-14 py-3.5 transition-colors hover:text-marketing-primary focus-visible:ring-offset-white"
                  panelClassName="pb-5 pl-12"
                >
                  <p className="mb-4 text-[15px] leading-7 text-marketing-muted">{pillar.body}</p>
                  <ul className="grid gap-2 text-[15px] leading-6 text-marketing-muted sm:grid-cols-2">
                    {pillar.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-marketing-primary"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </SmoothAccordionItem>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </SectionContainer>
  );
}
