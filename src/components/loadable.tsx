import { type PropsWithChildren } from 'react'
import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

type LoadableProps = PropsWithChildren<{
  isLoading?: boolean
  label?: string | null
  loader?: React.ReactElement
  isEmpty?: boolean
  emptyComponent?: React.ReactElement
  className?: string
  spinnerClassName?: string
}>

export function Loadable({
  label,
  isLoading,
  children,
  loader,
  isEmpty,
  emptyComponent,
  className,
  spinnerClassName,
}: LoadableProps) {
  if (isLoading) {
    return (
      loader || (
        <div className={cn('flex flex-col gap-2 py-2', className)}>
          <Loader className={cn('h-6 w-6 animate-spin', spinnerClassName)} />
          {label && <p className='text-muted-foreground text-sm'>{label}</p>}
        </div>
      )
    )
  }

  if (isEmpty && emptyComponent) {
    return emptyComponent
  }

  return <>{children}</>
}
