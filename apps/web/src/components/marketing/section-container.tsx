import { cn } from '@/lib/utils';

import { Reveal } from './reveal';

type SectionContainerProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function SectionContainer({ children, className, id }: SectionContainerProps) {
  return (
    <section id={id} className={cn('px-5 py-16 sm:px-6 lg:px-8 lg:py-24', className)}>
      <div className="mx-auto w-full max-w-6xl min-w-0">{children}</div>
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  children,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <Reveal
      className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}
      variant={align === 'center' ? 'up' : 'left'}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-marketing-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-marketing-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {children ? (
        <div className="mt-5 text-base leading-7 text-marketing-muted sm:text-lg sm:leading-8">
          {children}
        </div>
      ) : null}
    </Reveal>
  );
}
