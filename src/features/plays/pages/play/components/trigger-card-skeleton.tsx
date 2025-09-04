import { Skeleton } from '@/components/ui/skeleton'

export const TriggerCardSkeleton = () => (
  <div className='rounded-lg border p-4'>
    <div className='flex items-start gap-3'>
      <Skeleton className='h-9 w-9 rounded-lg' />
      <div className='min-w-0 flex-1 space-y-2'>
        <Skeleton className='h-5 w-32' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
      </div>
    </div>
  </div>
)
