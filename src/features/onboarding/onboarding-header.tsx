import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeSwitch } from '@/components/theme-switch'

export function OnboardingHeader() {
  return (
    <header className='sticky top-0 z-40 backdrop-blur-md'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-2'>
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-500  shadow-md">
            <span className="text-sm font-bold text-primary-foreground">C</span>
          </div> */}

          <span className='text-foreground text-xl font-bold'>linkify</span>
        </div>
        <div className='flex items-center gap-4'>
          <Link to='/'>
            <Button
              variant='ghost'
              size='sm'
              className='group text-muted-foreground hover:text-foreground text-sm'
            >
              Skip to dashboard
              <ChevronRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
            </Button>
          </Link>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  )
}
