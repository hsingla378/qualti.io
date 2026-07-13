'use client';

import { ArrowRight, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { QUALTI_CONTACT_EMAIL } from '@/lib/marketing-content';

import { Reveal } from './reveal';
import { TrackedLink } from './tracked-link';

export function FinalCta() {
  return (
    <section className="marketing-stage relative overflow-hidden px-5 py-20 text-white sm:px-6 lg:px-8 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto grid w-full max-w-6xl min-w-0 gap-10 lg:grid-cols-[1.2fr_auto] lg:items-end">
        <Reveal className="min-w-0 max-w-3xl" variant="left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
            Before the next dispatch
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            Show us how your last inspection happens before the truck leaves.
          </h2>
          <p className="mt-5 text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
            Give us 20–30 minutes on your final-inspection workflow. Optionally share an anonymised
            checklist or report. Design partners receive one month of complimentary access when the
            pilot-ready version ships.
          </p>
        </Reveal>
        <Reveal className="flex min-w-0 flex-col gap-3 sm:flex-row lg:w-72 lg:flex-col" delay={0.1} variant="scale">
          <Button
            asChild
            className="group h-auto min-h-12 w-full whitespace-normal rounded-md bg-white px-5 py-3 text-center text-base text-marketing-ink hover:bg-white/90"
          >
            <TrackedLink
              href="#lead-form"
              event="design_partner_join_clicked"
              eventProperties={{ placement: 'final_cta' }}
            >
              Join as design partner
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </TrackedLink>
          </Button>
          {QUALTI_CONTACT_EMAIL ? (
            <Button
              asChild
              variant="outline"
              className="h-auto min-h-12 w-full whitespace-normal rounded-md border-white/25 bg-transparent px-5 py-3 text-center text-base text-white hover:bg-white/10 hover:text-white"
            >
              <a href={`mailto:${QUALTI_CONTACT_EMAIL}`}>
                <Mail className="size-4" aria-hidden="true" />
                Write to us
              </a>
            </Button>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
