import * as React from 'react';
import { cn } from '~/utils/cn';

export const sharedInputClasses =
  'flex h-input w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground hover:border-ring focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[2.5px] focus-visible:ring-ring/50 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50';

const Input: React.FC<React.ComponentProps<'input'>> = ({
  className,
  type,
  ...props
}) => (
  <input
    type={type}
    className={cn(
      sharedInputClasses,

      className,
    )}
    {...props}
  />
);
Input.displayName = 'Input';

export { Input };
