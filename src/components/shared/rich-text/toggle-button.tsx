import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  active?: boolean
  onClick: () => void
  children: ReactNode
}

export function Toggle({ label, active, onClick, children }: Props) {
  return (
    <Button
      type='button'
      size='icon'
      variant='ghost'
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn('size-8', active && 'bg-accent')}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
