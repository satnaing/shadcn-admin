import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className='space-y-4' aria-busy='true'>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className='h-28' />
        ))}
      </div>
      <Skeleton className='h-80' />
    </div>
  )
}
