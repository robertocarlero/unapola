import { cn } from '@/lib/utils';
import { Sizes } from '@/types/theme';
import { useMemo } from 'react';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: Sizes | keyof typeof Sizes;
}

export function Spinner({
  className,
  size = Sizes.md,
  ...props
}: SpinnerProps) {
  const sizeClass = useMemo(() => {
    return {
      [Sizes.xs]: 'h-4 w-4',
      [Sizes.sm]: 'h-6 w-6',
      [Sizes.md]: 'h-8 w-8',
      [Sizes.lg]: 'h-10 w-10',
      [Sizes.xl]: 'h-12 w-12',
    }[size];
  }, [size]);
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClass,
        className
      )}
      {...props}
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
}
