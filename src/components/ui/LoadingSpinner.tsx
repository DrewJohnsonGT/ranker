import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { cn } from '~/utils/cn';

const spinnerVariants = cva('animate-spin rounded-full', {
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'size-24 border-8',
      md: 'size-12 border-4',
      sm: 'size-6 border-2',
    },
  },
});

const LoadingSpinner: React.FC<
  React.ComponentProps<'div'> & VariantProps<typeof spinnerVariants>
> = ({ className, size, ...props }) => (
  <div
    className={cn(
      'border-muted border-t-primary',
      spinnerVariants({ size }),
      className,
    )}
    {...props}
  />
);

LoadingSpinner.displayName = 'LoadingSpinner';

export { LoadingSpinner };
