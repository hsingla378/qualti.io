'use client';

import { inspectionCoverage } from '@/lib/marketing-content';

import { SmoothAccordionItem } from './smooth-accordion';
import { Stagger, StaggerItem } from './reveal';
import { SectionContainer, SectionIntro } from './section-container';

export function InspectionCoverage() {
  return (
    <SectionContainer id="features" className="bg-white">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <SectionIntro
          eyebrow="What gets recorded"
          title="One structured record for every furniture quality checkpoint"
        >
          <p>
            From PO verification and mm tolerances to joints, finish, packaging and corrective
            actions — the inspection should match how furniture is actually reviewed on the floor.
          </p>
        </SectionIntro>

        <Stagger
          className="divide-y divide-marketing-line border-y border-marketing-line"
          stagger={0.06}
          delay={0.05}
        >
          {inspectionCoverage.map((category, index) => (
            <StaggerItem key={category.title}>
              <SmoothAccordionItem
                defaultOpen={index === 0}
                title={
                  <span className="font-heading text-[15px] font-semibold text-marketing-ink">
                    {category.title}
                  </span>
                }
                leading={
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-marketing-primary/10 text-marketing-primary">
                    <category.icon className="size-4" aria-hidden="true" />
                  </span>
                }
                summaryClassName="min-h-14 py-3.5 transition-colors hover:text-marketing-primary focus-visible:ring-offset-white"
                panelClassName="pb-5 pl-12"
              >
                <ul className="grid gap-2 text-[15px] leading-6 text-marketing-muted sm:grid-cols-2">
                  {category.items.map((item) => (
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
          ))}
        </Stagger>
      </div>
    </SectionContainer>
  );
}
