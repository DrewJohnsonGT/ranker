import * as React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';
import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { cn } from '~/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    compoundVariants: [
      {
        className: 'hover:text-destructive',
        color: 'destructive',
        variant: 'ghost',
      },
      {
        className: 'border-destructive bg-destructive hover:bg-destructive/90',
        color: 'destructive',
        variant: 'primary',
      },
      {
        className:
          'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground hover:text-white',
        color: 'destructive',
        variant: 'outline',
      },
    ],
    defaultVariants: {
      size: 'default',
      variant: 'primary',
    },
    variants: {
      color: {
        destructive: 'bg-destructive text-destructive-foreground',
        link: 'text-link underline-offset-4 hover:underline',
        success: 'bg-success text-success-foreground',
      },
      size: {
        default: 'h-input px-4 py-2',
        icon: 'size-input',
        lg: 'h-10 px-8',
        sm: 'h-8 px-3 text-xs',
        smallIcon: 'size-5',
      },
      variant: {
        ghost:
          'border-none bg-transparent text-foreground shadow-none hover:bg-accent hover:text-accent-foreground',
        link: 'm-0 break-words p-0 text-link underline-offset-4 hover:underline',
        outline:
          'border border-border bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
        primary:
          'border border-primary bg-primary text-primary-foreground shadow hover:border-primary-foreground hover:bg-primary/90',
        secondary:
          'border border-border bg-input-background text-foreground shadow-sm hover:border-primary hover:bg-accent hover:text-primary',
      },
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    ButtonVariantProps {
  asChild?: boolean;
  loading?: boolean;
  loadingMessage?: string;
  tooltip?: string | React.ReactNode;
  tooltipDelay?: number;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}

const ButtonLoadingContent = ({
  loadingMessage,
  size,
}: {
  size: ButtonVariantProps['size'];
  loadingMessage: string;
}) => (
  <div className="flex items-center">
    <LoadingSpinner
      className={cn('size-4', size !== 'icon' && 'mr-2')}
      size="sm"
    />
    {size !== 'icon' && <span>{loadingMessage}</span>}
  </div>
);

const Button: React.FC<React.ComponentProps<'button'> & ButtonProps> = ({
  asChild = false,
  className,
  color,
  loading,
  loadingMessage = 'Loading...',
  size,
  tooltip,
  tooltipDelay = 0,
  tooltipSide = 'top',
  variant,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button';
  const buttonContent = (
    <Comp
      className={cn(buttonVariants({ className, color, size, variant }))}
      disabled={props.disabled}
      {...props}
    >
      {loading ? (
        <ButtonLoadingContent size={size} loadingMessage={loadingMessage} />
      ) : (
        props.children
      )}
    </Comp>
  );

  return tooltip ? (
    <Tooltip delayDuration={tooltipDelay}>
      <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
      <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    buttonContent
  );
};

export { Button, buttonVariants };
