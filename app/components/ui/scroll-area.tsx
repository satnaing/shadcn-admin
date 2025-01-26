import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import type * as React from 'react'
import { cn } from '~/lib/utils'

const ScrollArea = ({
  className,
  children,
  orientation = 'vertical',
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof ScrollAreaPrimitive.Root> & {
  orientation?: 'horizontal' | 'vertical'
}) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      className={cn(
        'h-full w-full rounded-[inherit]',
        orientation === 'horizontal' && 'overflow-x-auto!',
      )}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar orientation={orientation} />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
)
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = ({
  className,
  orientation = 'vertical',
  ref,
  ...props
}: React.ComponentPropsWithRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
>) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none transition-colors select-none',
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="bg-border relative flex-1 rounded-full" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
)
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
