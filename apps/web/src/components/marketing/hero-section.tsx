'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import { TrackedLink } from './tracked-link';

const easeOut = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const animateIn = ready && !reduceMotion;

  return (
    <section
      id="product"
      aria-label="Qualti.io furniture quality inspection software"
      className="relative isolate min-h-[min(100svh,900px)] overflow-hidden bg-marketing-stage"
    >
      <motion.div
        className="absolute inset-0"
        initial={animateIn ? { scale: 1.06, opacity: 0.85 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={
          animateIn ? { duration: 1.6, ease: easeOut } : { duration: 0 }
        }
      >
        <Image
          src="/brand/hero-chair-stage.jpg"
          alt="Mango wood dining chair prepared for final quality inspection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_52%] md:object-[72%_50%] lg:object-[74%_48%]"
        />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              'linear-gradient(100deg, oklch(0.13 0.025 160 / 88%) 0%, oklch(0.13 0.025 160 / 55%) 34%, oklch(0.13 0.02 160 / 12%) 58%, transparent 78%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              'linear-gradient(180deg, oklch(0.13 0.025 160 / 90%) 0%, oklch(0.13 0.025 160 / 72%) 45%, oklch(0.13 0.02 160 / 50%) 100%)',
          }}
          aria-hidden="true"
        />
      </motion.div>

      <div className="relative mx-auto flex min-h-[min(100svh,900px)] max-w-6xl flex-col justify-end px-5 pb-12 pt-28 sm:px-6 sm:pb-16 lg:justify-center lg:px-8 lg:pb-24 lg:pt-24">
        <motion.div
          className="max-w-xl text-white"
          initial={animateIn ? 'hidden' : false}
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.11, delayChildren: 0.12 },
            },
          }}
        >
          <motion.p
            className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.75rem]"
            variants={
              animateIn
                ? {
                    hidden: { opacity: 0, y: 22 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeOut } },
                  }
                : undefined
            }
          >
            Qualti.io
          </motion.p>
          <motion.h1
            className="mt-5 font-heading text-[1.65rem] font-semibold leading-[1.18] tracking-tight text-white/95 sm:text-3xl lg:text-[2.35rem] lg:leading-[1.15]"
            variants={
              animateIn
                ? {
                    hidden: { opacity: 0, y: 22 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeOut } },
                  }
                : undefined
            }
          >
            Final furniture inspections you can defend at dispatch.
          </motion.h1>
          <motion.p
            className="mt-5 max-w-md text-base leading-7 text-white/68 sm:text-lg sm:leading-8"
            variants={
              animateIn
                ? {
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
                  }
                : undefined
            }
          >
            Dimensions, defect photos, rework and buyer reports in one record — instead of paper,
            Excel and WhatsApp.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            variants={
              animateIn
                ? {
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeOut } },
                  }
                : undefined
            }
          >
            <Button
              asChild
              className="marketing-cta group h-12 rounded-md bg-white px-5 text-base text-marketing-ink hover:bg-white/90"
            >
              <TrackedLink
                href="#lead-form"
                event="design_partner_join_clicked"
                eventProperties={{ placement: 'hero' }}
              >
                Join as design partner
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </TrackedLink>
            </Button>
            <Button
              asChild
              variant="outline"
              className="group h-12 rounded-md border-white/30 bg-transparent px-5 text-base text-white hover:bg-white/10 hover:text-white"
            >
              <TrackedLink
                href="#workflow"
                event="workflow_view_clicked"
                eventProperties={{ placement: 'hero' }}
              >
                See the inspection loop
                <motion.span
                  className="inline-flex"
                  animate={animateIn ? { y: [0, 3, 0] } : undefined}
                  transition={
                    animateIn
                      ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }
                      : undefined
                  }
                >
                  <ArrowDown className="size-4" aria-hidden="true" />
                </motion.span>
              </TrackedLink>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
