import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'

export const AppSidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, size = 'icon', children, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      size={size}
      onClick={toggleSidebar}
      className={cn('h-7 w-7', className)}
      {...props}
    >
      {children}
      <span className='sr-only'>Toggle Sidebar</span>
    </Button>
  )
})
AppSidebarTrigger.displayName = 'AppSidebarTrigger'
