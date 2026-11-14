import { cn } from '@/lib/utils'
import React from 'react'

type FooterProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export function Footer({ className, fixed, children, ...props }: FooterProps) {
  return (
    <footer
      className={cn(
        'z-40 h-10 shrink-0',
        fixed &&
          'footer-fixed peer/footer sticky bottom-0 w-[inherit] border-t bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/80',
        className
      )}
      {...props}
    >
      <div className='flex h-full items-center justify-between gap-4 px-3 text-xs text-muted-foreground sm:px-4 lg:px-6'>
        {children}
      </div>
    </footer>
  )
}
