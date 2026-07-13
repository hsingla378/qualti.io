import { cn } from '@/lib/utils';

type BrandMarkProps = {
  compact?: boolean;
  iconOnly?: boolean;
  inverted?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function BrandMark({
  compact = false,
  iconOnly = false,
  inverted = false,
  size,
  className,
}: BrandMarkProps) {
  const resolvedSize = size ?? (compact ? 'sm' : 'md');
  const iconPx = resolvedSize === 'lg' ? 44 : resolvedSize === 'md' ? 32 : 28;

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset used across marketing and app chrome */}
      <img
        src="/brand/qualti-icon.png"
        alt=""
        width={iconPx}
        height={iconPx}
        className={cn('shrink-0 rounded-[7px]', inverted && 'ring-1 ring-white/25')}
        decoding="async"
      />
      {!iconOnly ? (
        <span
          className={cn(
            'font-heading font-semibold tracking-tight',
            inverted ? 'text-white' : 'text-current',
            resolvedSize === 'lg' && 'text-3xl sm:text-4xl',
            resolvedSize === 'md' && 'text-lg',
            resolvedSize === 'sm' && 'text-base',
          )}
        >
          Qualti.io
        </span>
      ) : null}
    </div>
  );
}
