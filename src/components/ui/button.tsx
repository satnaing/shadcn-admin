import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'border border-primary/50 bg-primary/5 text-primary hover:bg-primary/10 dark:border-primary/50 dark:bg-primary/10 dark:text-primary dark:hover:bg-primary/15',
        destructive:
          'border border-destructive/50 bg-destructive/5 text-destructive hover:bg-destructive/10 dark:border-destructive/50 dark:bg-destructive/10 dark:text-destructive dark:hover:bg-destructive/15',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        success:
          'border border-emerald-600/50 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50',
        danger:
          'border border-destructive/50 bg-destructive/5 text-destructive hover:bg-destructive/10 dark:border-destructive/50 dark:bg-destructive/10 dark:hover:bg-destructive/15',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
