import type React from 'react'
import { cn } from '~/lib/utils'

interface MainProps extends React.ComponentPropsWithRef<'main'> {
  fixed?: boolean
}

export const Main = ({ fixed, ...props }: MainProps) => {
  return (
    <main
      className={cn(
        'peer-[.header-fixed]/header:mt-16',
        'px-4 py-6',
        fixed && 'fixed-main flex grow flex-col overflow-hidden',
      )}
      {...props}
    />
  )
}

Main.displayName = 'Main'
