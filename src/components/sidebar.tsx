import Nav from './nav'
import { TooltipProvider } from './ui/tooltip'
import { cn } from '@/lib/utils'
import { Separator } from './ui/separator'
import FaryLogo from '@/assets/vite.png'
import { Button } from './ui/button'
import { sidelinks } from '@/data/sidelinks'
import { IconChevronsLeft } from '@tabler/icons-react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({
  className,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  return (
    <div
      className={cn(
        'pb-12 relative hidden lg:block border-r-2 border-r-slate-100 dark:border-r-slate-900 transition-[width]',
        className
      )}
    >
      <TooltipProvider delayDuration={0}>
        <div className='px-4 py-2 flex gap-2 h-16 items-center'>
          <img
            src={FaryLogo}
            alt='Logo'
            className={`transition-all ${isCollapsed ? 'h-6 w-6' : 'h-12 w-12'}`}
          />
          <div
            className={`flex flex-col justify-end truncate ${isCollapsed ? 'w-0 invisible' : 'w-auto visible'}`}
          >
            <span className='font-medium'>Right Direction</span>
            <span className='text-xs'>Since 2020</span>
          </div>
        </div>
        <Separator className='mb-4' />
        <Nav isCollapsed={isCollapsed} links={sidelinks} />
      </TooltipProvider>
      <Button
        onClick={() => setIsCollapsed((prev) => !prev)}
        size='icon'
        variant='outline'
        className='rounded-full -right-5 top-1/2 absolute'
      >
        <IconChevronsLeft
          stroke={1.5}
          className={`w-5 h-5 ${isCollapsed ? 'rotate-180' : ''}`}
        />
      </Button>
    </div>
  )
}
