'use client';

import { LoadingSpinner } from './LoadingSpinner';
import { useTheme } from 'next-themes';
import { LuCheck, LuCircleX, LuTriangleAlert } from 'react-icons/lu';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      className="group"
      position="bottom-center"
      offset={10}
      toastOptions={{
        style: {
          gap: '1rem',
        },
      }}
      icons={{
        error: <LuCircleX className="size-6 text-destructive" />,
        loading: <LoadingSpinner size="sm" />,
        success: <LuCheck className="size-6 text-success" />,
        warning: <LuTriangleAlert className="size-6 text-warning" />,
      }}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      visibleToasts={5}
      richColors
      {...props}
    />
  );
};

export { Toaster };
