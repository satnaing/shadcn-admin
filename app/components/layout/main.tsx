import type React from 'react'
import { cn } from '~/lib/utils'

interface MainProps extends React.ComponentPropsWithRef<'main'> {
  fixed?: boolean
}

export const Main = ({ fixed, ref, ...props }: MainProps) => {
  return (
    <main
      ref={ref}
      className={cn(
        'px-4 py-6',
        fixed && 'flex flex-grow flex-col overflow-hidden',
      )}
      {...props}
    />
  )
}
Main.displayName = 'Main'
