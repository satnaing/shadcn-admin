import { UserButton, useUser } from '@clerk/clerk-react'
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'

export function NavUser() {
  const { user, isLoaded } = useUser()

  if (!isLoaded || !user) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className='flex items-center gap-3 px-1 py-1.5'>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8 rounded-lg',
                userButtonPopoverCard: 'min-w-56 rounded-lg',
                userButtonPopoverFooter: 'hidden',
              },
            }}
          />
          <div className='grid flex-1 text-start text-sm leading-tight'>
            <span className='truncate font-semibold'>
              {user.fullName || user.firstName || 'User'}
            </span>
            <span className='text-muted-foreground truncate text-xs'>
              {user.primaryEmailAddress?.emailAddress || ''}
            </span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
