'use client';

import { faqs } from '@/lib/marketing-content';

import { SmoothAccordionItem } from './smooth-accordion';
import { Stagger, StaggerItem } from './reveal';
import { SectionContainer, SectionIntro } from './section-container';

export function FaqSection() {
  return (
    <SectionContainer id="faq" className="bg-white">
      <SectionIntro title="Questions AI-assisted QC teams usually ask" align="center" />
      <Stagger className="mx-auto mt-12 max-w-3xl divide-y divide-marketing-line" stagger={0.05}>
        {faqs.map((faq, index) => (
          <StaggerItem key={faq.question}>
            <SmoothAccordionItem
              defaultOpen={index === 0}
              className="py-5"
              title={faq.question}
              summaryClassName="justify-between gap-4 font-heading text-base font-semibold text-marketing-ink transition-colors hover:text-marketing-primary focus-visible:ring-offset-white sm:text-lg"
              panelClassName="mt-3 max-w-2xl"
            >
              <p className="text-sm leading-7 text-marketing-muted sm:text-[15px]">{faq.answer}</p>
            </SmoothAccordionItem>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionContainer>
  );
}
