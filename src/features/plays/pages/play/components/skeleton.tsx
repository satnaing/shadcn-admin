import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PlaybookDetailSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Title and Description Skeleton */}
      <div className='mb-6'>
        <Skeleton className='mb-2 h-8 w-64' />
        <Skeleton className='h-5 w-96' />
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <Skeleton className='h-7 w-48' />
              <Skeleton className='h-4 w-64' />
            </div>
            <Skeleton className='h-6 w-16' />
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-3/4' />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className='h-7 w-32' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-24 w-full' />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className='h-7 w-32' />
        </CardHeader>
        <CardContent>
          <Skeleton className='h-32 w-full' />
        </CardContent>
      </Card>
    </div>
  )
}
