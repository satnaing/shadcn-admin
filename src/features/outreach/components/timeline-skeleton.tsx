import { Skeleton } from '@/components/ui/skeleton'

export function TimelineSkeleton() {
  return (
    <div className='relative space-y-4'>
      {/* Timeline line */}
      <div className='bg-border absolute top-5 bottom-5 left-5 w-px' />

      {/* Timeline skeleton items */}
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className='relative flex gap-4'>
          {/* Timeline dot skeleton */}
          <Skeleton className='relative z-10 h-10 w-10 rounded-full' />

          {/* Content skeleton */}
          <div className='flex-1 space-y-2 pb-4'>
            <div className='flex items-center justify-between gap-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-16' />
            </div>

            {/* Show message content skeleton for some items */}
            {index === 3 && (
              <div className='space-y-2'>
                <div className='bg-muted/50 space-y-2 rounded-lg border p-3'>
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-16 w-full' />
                  <Skeleton className='h-3 w-24' />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
