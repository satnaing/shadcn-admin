import React from 'react'
import { cn } from '@/lib/utils'

interface MainProps extends React.HTMLAttributes<React.ElementRef<'main'>> {
  fixed?: boolean
}

export const Main = React.forwardRef<React.ElementRef<'main'>, MainProps>(
  ({ fixed, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          'px-4 py-6',
          fixed && 'flex flex-col flex-grow overflow-hidden'
        )}
        {...props}
      />
    )
  }
)
Main.displayName = 'Main'
