'use client';

import { workflowSteps } from '@/lib/marketing-content';

import { Stagger, StaggerItem } from './reveal';
import { SectionContainer, SectionIntro } from './section-container';

export function WorkflowSection() {
  return (
    <SectionContainer id="workflow" className="marketing-atmosphere relative overflow-hidden">
      <div className="marketing-ruler absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative">
        <SectionIntro
          eyebrow="Workflow"
          title="From field audit to buyer-ready report"
          align="center"
        >
          <p>
            Built around how furniture factories finish QC: prepare the job, inspect on the floor,
            log defects with evidence, close rework, approve the batch, and generate a clean report
            — with AI assist where it saves time.
          </p>
        </SectionIntro>

        <Stagger
          as="ol"
          className="relative mx-auto mt-14 max-w-3xl"
          aria-label="Qualti.io workflow steps"
          stagger={0.09}
          delay={0.05}
        >
          {workflowSteps.map((step, index) => (
            <StaggerItem
              key={step.title}
              as="li"
              className="relative flex gap-5 pb-11 last:pb-0"
            >
              {index < workflowSteps.length - 1 ? (
                <span
                  className="absolute left-[19px] top-12 h-[calc(100%-1.25rem)] w-px bg-marketing-line"
                  aria-hidden="true"
                />
              ) : null}
              <span className="relative z-[1] flex size-10 shrink-0 items-center justify-center rounded-md bg-marketing-primary font-heading text-sm font-semibold text-marketing-primary-foreground">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 pt-1.5">
                <h3 className="font-heading text-xl font-semibold text-marketing-ink">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-marketing-muted">{step.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </SectionContainer>
  );
}
