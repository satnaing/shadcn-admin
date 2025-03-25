'use client'

import { Maximize, Minimize } from 'lucide-react'
import { useFullScreen } from '@/hooks/use-full-screen'
import { Button } from '@/components/ui/button'

export function ToggleFullscreen() {
  const { isFullscreen, toggleFullscreen } = useFullScreen()
  return (
    <Button variant='ghost' size='icon' className='scale-95 rounded-full' onClick={toggleFullscreen}>
      {isFullscreen ? (
        <Minimize className='h-5 w-5' />
      ) : (
        <Maximize className='h-5 w-5' />
      )}
      <span className='sr-only'>Toggle fullscreen</span>
    </Button>
  )
}
