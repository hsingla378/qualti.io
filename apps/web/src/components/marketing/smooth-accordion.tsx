'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type SmoothAccordionItemProps = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  summaryClassName?: string;
  panelClassName?: string;
  leading?: ReactNode;
};

export function SmoothAccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
  summaryClassName,
  panelClassName,
  leading,
}: SmoothAccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className={cn(className)}>
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex w-full cursor-pointer list-none items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marketing-primary focus-visible:ring-offset-2',
          summaryClassName,
        )}
      >
        {leading}
        <span className="min-w-0 flex-1">{title}</span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-marketing-muted transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          'grid transition-[grid-template-rows] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              'transition-opacity duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
              open ? 'opacity-100' : 'opacity-0',
              panelClassName,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
