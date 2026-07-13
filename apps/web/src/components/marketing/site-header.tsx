'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/ui/button';
import { trackMarketingEvent } from '@/lib/analytics';
import { navigationItems } from '@/lib/marketing-content';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setReady(true);
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  const overHero = !scrolled && !open;
  const animateIn = ready && !reduceMotion;

  return (
    <motion.header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        overHero
          ? 'border-b-0 bg-transparent'
          : 'border-b border-marketing-line/70 bg-marketing-bg/90 backdrop-blur-md supports-[backdrop-filter]:bg-marketing-bg/75',
      )}
      initial={animateIn ? { opacity: 0, y: -8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={animateIn ? { duration: 0.55, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-marketing-panel focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-marketing-ink focus:ring-2 focus:ring-marketing-primary"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Qualti.io home"
          className={cn(overHero ? 'text-white' : 'text-marketing-ink')}
          onClick={closeMenu}
        >
          <BrandMark compact inverted={overHero} />
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary navigation"
        >
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marketing-primary',
                overHero
                  ? 'text-white/75 hover:text-white'
                  : 'text-marketing-muted hover:text-marketing-ink',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            asChild
            className={cn(
              'h-10 px-4 text-sm',
              overHero
                ? 'bg-white text-marketing-ink hover:bg-white/90'
                : 'bg-marketing-primary text-marketing-primary-foreground hover:bg-marketing-primary/90',
            )}
          >
            <a
              href="#lead-form"
              onClick={() =>
                trackMarketingEvent('design_partner_join_clicked', { placement: 'header' })
              }
            >
              Join as design partner
            </a>
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className={cn(
            'lg:hidden',
            overHero
              ? 'border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white'
              : 'border-marketing-line bg-marketing-panel',
          )}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </Button>
      </div>

      <div
        id="mobile-navigation"
        className={cn(
          'grid bg-marketing-bg transition-[grid-template-rows] duration-200 lg:hidden',
          open
            ? 'grid-rows-[1fr] border-t border-marketing-line'
            : 'grid-rows-[0fr] border-t-0',
        )}
        {...(!open ? { inert: true } : {})}
      >
        <nav className="overflow-hidden" aria-label="Mobile navigation">
          <div className="space-y-1 px-4 py-4">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="block rounded-md px-3 py-3 text-base font-medium text-marketing-ink hover:bg-marketing-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marketing-primary"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#lead-form"
              onClick={() => {
                closeMenu();
                trackMarketingEvent('design_partner_join_clicked', { placement: 'mobile_nav' });
              }}
              className="mt-3 block rounded-md bg-marketing-primary px-3 py-3 text-center text-base font-semibold text-marketing-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marketing-primary"
            >
              Join as design partner
            </a>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
