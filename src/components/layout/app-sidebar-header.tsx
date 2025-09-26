import { useSidebar } from '@/components/ui/sidebar'
import { SwanLogo } from '@/components/swan-logo'

export function TeamSwitcher() {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <div className='flex h-12 items-center px-2'>
      <SwanLogo symbolOnly={isCollapsed} className={isCollapsed ? 'ml-1 h-6 w-6' : 'h-6 w-auto'} />
    </div>
  )
}
