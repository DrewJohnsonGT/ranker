'use client';

import * as React from 'react';
import { buttonVariants } from './Button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { LuX } from 'react-icons/lu';
import { cn } from '~/utils/cn';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay: React.FC<
  React.ComponentProps<typeof DialogPrimitive.Overlay>
> = ({ className, ...props }) => (
  <DialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
);
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent: React.FC<
  React.ComponentProps<typeof DialogPrimitive.Content> & {
    showOverlay?: boolean;
    actions?: React.ReactNode;
    hideCloseButton?: boolean;
  }
> = ({
  actions,
  children,
  className,
  hideCloseButton = false,
  showOverlay = true,
  ...props
}) => (
  <DialogPortal>
    {showOverlay && <DialogOverlay />}
    <DialogPrimitive.Content
      className={cn(
        'fixed left-1/2 top-1/2 z-50 grid max-h-[95vh] w-full max-w-[95vw] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto border bg-background p-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className,
      )}
      {...props}
    >
      {children}
      <div className="absolute right-2 top-2 flex items-center gap-2">
        {actions}
        {!hideCloseButton && (
          <DialogPrimitive.Close
            className={cn(
              buttonVariants({
                color: 'destructive',
                size: 'icon',
                variant: 'ghost',
              }),
            )}
          >
            <LuX className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </div>
    </DialogPrimitive.Content>
  </DialogPortal>
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader: React.FC<React.ComponentProps<'div'>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'mb-2 flex flex-col space-y-2.5 text-center sm:text-left',
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter: React.FC<React.ComponentProps<'div'>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle: React.FC<
  React.ComponentProps<typeof DialogPrimitive.Title>
> = ({ className, ...props }) => (
  <DialogPrimitive.Title
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription: React.FC<
  React.ComponentProps<typeof DialogPrimitive.Description>
> = ({ className, ...props }) => (
  <DialogPrimitive.Description
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
