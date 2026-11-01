import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border border-destructive/50 bg-destructive/5 text-destructive dark:border-destructive/50 dark:bg-destructive/10 dark:text-destructive [a&]:hover:bg-destructive/10 dark:[a&]:hover:bg-destructive/15',
        success:
          'border border-emerald-600/50 bg-emerald-50 text-emerald-700 dark:border-emerald-500/50 dark:bg-emerald-950/30 dark:text-emerald-400 [a&]:hover:bg-emerald-100 dark:[a&]:hover:bg-emerald-950/50',
        danger:
          'border border-destructive/50 bg-destructive/5 text-destructive dark:border-destructive/50 dark:bg-destructive/10 dark:text-destructive [a&]:hover:bg-destructive/10 dark:[a&]:hover:bg-destructive/15',
        warning:
          'border border-amber-500/50 bg-amber-50 text-amber-700 dark:border-amber-500/50 dark:bg-amber-950/30 dark:text-amber-400 [a&]:hover:bg-amber-100 dark:[a&]:hover:bg-amber-950/50',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot='badge'
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
