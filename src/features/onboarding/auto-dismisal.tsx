'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export function AutoDismissSuccessModal() {
  const [open, setOpen] = useState(true)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    const closeTimer = setTimeout(() => {
      setOpen(false)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(closeTimer)
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='flex flex-col items-center space-y-4 py-6 text-center'>
        <img
          src='https://app.presentations.ai/docs/assets/images/createflow/confetti.svg'
          alt='Success'
          className='h-24 w-24'
        />
        <h2 className='text-xl font-semibold text-green-600'>Success!</h2>
        <p className='text-muted-foreground text-sm'>
          Your action was completed successfully. Closing in {countdown}...
        </p>
        <div className='flex gap-2'>
          <Button onClick={() => setOpen(false)}>Navigate to Demo</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
