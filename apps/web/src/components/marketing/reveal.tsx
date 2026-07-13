'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

const easeOut = [0.22, 1, 0.36, 1] as const;

const preset = {
  up: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -22 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 22 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
} as const;

export type RevealVariant = keyof typeof preset;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'ul' | 'section';
  variant?: RevealVariant;
  amount?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
  variant = 'up',
  amount = 0.18,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const shouldAnimate = ready && !reduceMotion;
  const frames = preset[variant];

  const motionProps: HTMLMotionProps<'div'> = shouldAnimate
    ? {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, amount, margin: '0px 0px -6% 0px' },
        variants: {
          hidden: frames.hidden,
          visible: {
            ...frames.visible,
            transition: { duration: 0.7, delay, ease: easeOut },
          },
        },
      }
    : {
        // Visible during SSR and before hydration — never ship opacity:0 HTML
        initial: false,
      };

  if (as === 'li') {
    return (
      <motion.li className={cn(className)} {...(motionProps as HTMLMotionProps<'li'>)}>
        {children}
      </motion.li>
    );
  }

  if (as === 'ul') {
    return (
      <motion.ul className={cn(className)} {...(motionProps as HTMLMotionProps<'ul'>)}>
        {children}
      </motion.ul>
    );
  }

  if (as === 'section') {
    return (
      <motion.section className={cn(className)} {...(motionProps as HTMLMotionProps<'section'>)}>
        {children}
      </motion.section>
    );
  }

  return (
    <motion.div className={cn(className)} {...motionProps}>
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: 'div' | 'ul' | 'ol';
  'aria-label'?: string;
};

export function Stagger({
  children,
  className,
  stagger = 0.07,
  delay = 0,
  as = 'div',
  'aria-label': ariaLabel,
}: StaggerProps) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const shouldAnimate = ready && !reduceMotion;

  const props = shouldAnimate
    ? {
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: { once: true, amount: 0.12, margin: '0px 0px -4% 0px' as const },
        variants: {
          hidden: {},
          visible: {
            transition: {
              staggerChildren: stagger,
              delayChildren: delay,
            },
          },
        },
      }
    : { initial: false as const };

  if (as === 'ul') {
    return (
      <motion.ul className={cn(className)} aria-label={ariaLabel} {...props}>
        {children}
      </motion.ul>
    );
  }

  if (as === 'ol') {
    return (
      <motion.ol className={cn(className)} aria-label={ariaLabel} {...props}>
        {children}
      </motion.ol>
    );
  }

  return (
    <motion.div className={cn(className)} aria-label={ariaLabel} {...props}>
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li';
  variant?: RevealVariant;
};

export function StaggerItem({
  children,
  className,
  as = 'div',
  variant = 'up',
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion();
  const frames = preset[variant];

  const variants = reduceMotion
    ? undefined
    : {
        hidden: frames.hidden,
        visible: {
          ...frames.visible,
          transition: { duration: 0.55, ease: easeOut },
        },
      };

  if (as === 'li') {
    return (
      <motion.li className={cn(className)} variants={variants}>
        {children}
      </motion.li>
    );
  }

  return (
    <motion.div className={cn(className)} variants={variants}>
      {children}
    </motion.div>
  );
}
