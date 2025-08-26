import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ICPProfileSkeleton() {
  return (
    <div className='container'>
      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-32' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <div className='flex gap-3'>
                <Skeleton className='h-10 flex-1' />
                <Skeleton className='h-10 flex-[2]' />
              </div>
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <div className='flex gap-3'>
                <Skeleton className='h-10 flex-1' />
                <Skeleton className='h-10 flex-[2]' />
              </div>
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-40' />
              <Skeleton className='h-24 w-full' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-24' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-32 w-full' />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
