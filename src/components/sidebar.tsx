import Nav from './nav'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { sidelinks } from '@/data/sidelinks'
import { IconChevronsLeft, IconMenu2, IconX } from '@tabler/icons-react'
import { useState } from 'react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({
  className,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)
  return (
    <div
      className={cn(
        `relative w-full border-r-2 border-r-slate-100 transition-[width] dark:border-r-slate-900 md:max-w-60 md:pb-12 ${isCollapsed ? 'md:w-14' : 'md:w-64'}`,
        className
      )}
    >
      <div className='flex flex-col md:h-svh'>
        <div
          className={`flex h-16 w-full items-center justify-between gap-2 border-b px-4 py-2`}
        >
          <div className='flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 256 256'
              className={`transition-all ${isCollapsed ? 'h-6 w-6' : 'h-8 w-8'}`}
            >
              <rect width='256' height='256' fill='none'></rect>
              <line
                x1='208'
                y1='128'
                x2='128'
                y2='208'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='16'
              ></line>
              <line
                x1='192'
                y1='40'
                x2='40'
                y2='192'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='16'
              ></line>
              <span className='sr-only'>Website Name</span>
            </svg>
            <div
              className={`flex flex-col justify-end truncate ${isCollapsed ? 'invisible w-0' : 'visible w-auto'}`}
            >
              <span className='font-medium'>Shadcn Dashboard</span>
              <span className='text-xs'>Vite + ShadcnUI</span>
            </div>
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            aria-label='Toggle Navigation'
            aria-controls='sidebar-menu'
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <IconX /> : <IconMenu2 />}
          </Button>
        </div>

        <Nav
          id='sidebar-menu'
          className={
            navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2'
          }
          isCollapsed={isCollapsed}
          links={sidelinks}
        />
      </div>
      <Button
        onClick={() => setIsCollapsed((prev) => !prev)}
        size='icon'
        variant='outline'
        className='absolute -right-5 top-1/2 hidden rounded-full md:inline-flex'
      >
        <IconChevronsLeft
          stroke={1.5}
          className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`}
        />
      </Button>
    </div>
  )
}
