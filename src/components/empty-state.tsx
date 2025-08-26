import { type ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type EmptyStatePropsWithCta = {
  Icon?: LucideIcon
  title: string
  description?: string
  ctaText: string
  ctaIcon?: LucideIcon
  onCtaClick: () => void
  className?: string
}

type EmptyStatePropsWithCustomCta = {
  Icon?: LucideIcon
  title: string
  description?: string
  Cta: ReactNode
  className?: string
}

type EmptyStatePropsNoCta = {
  Icon?: LucideIcon
  title: string
  description?: string
  className?: string
}

type EmptyStateProps = EmptyStatePropsWithCta | EmptyStatePropsWithCustomCta | EmptyStatePropsNoCta

export default function EmptyState(props: EmptyStateProps) {
  const { Icon, title, description, className } = props

  let Cta: ReactNode = null
  if ('Cta' in props) {
    Cta = props.Cta
  } else if ('ctaText' in props) {
    const CtaIcon = props.ctaIcon
    Cta = (
      <Button onClick={() => props.onCtaClick()}>
        {CtaIcon && <CtaIcon className='mr-2 h-4 w-4' />}
        {props.ctaText}
      </Button>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-12',
        'rounded-lg border-2 border-dashed',
        'border-muted bg-muted/10',
        className
      )}
    >
      {Icon && <Icon className='text-muted-foreground mb-4 h-12 w-12' />}
      <h3 className='mb-2 text-lg font-semibold'>{title}</h3>
      {description && <p className='text-muted-foreground mb-4 text-center'>{description}</p>}
      {Cta}
    </div>
  )
}
