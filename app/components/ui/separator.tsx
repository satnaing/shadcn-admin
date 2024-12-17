import * as SeparatorPrimitive from '@radix-ui/react-separator'
import type * as React from 'react'
import { cn } from '~/lib/utils'

const Separator = ({
  className,
  orientation = 'horizontal',
  decorative = true,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof SeparatorPrimitive.Root>) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className,
    )}
    {...props}
  />
)

Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
