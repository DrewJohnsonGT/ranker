'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { LuChevronDown } from 'react-icons/lu';
import { cn } from '~/utils/cn';

const Accordion = AccordionPrimitive.Root;

const AccordionItem: React.FC<
  React.ComponentProps<typeof AccordionPrimitive.Item>
> = ({ className, ...props }) => (
  <AccordionPrimitive.Item className={cn(className)} {...props} />
);
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger: React.FC<
  React.ComponentProps<typeof AccordionPrimitive.Trigger>
> = ({ children, className, ...props }) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={cn(
        'flex flex-1 items-center justify-between p-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <LuChevronDown className="size-6 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent: React.FC<
  React.ComponentProps<typeof AccordionPrimitive.Content>
> = ({ children, className, ...props }) => (
  <AccordionPrimitive.Content
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-2 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
);

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
