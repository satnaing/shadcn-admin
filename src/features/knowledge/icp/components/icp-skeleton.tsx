import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ICPSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {[1, 2, 3].map((i) => (
        <Card key={i} className='overflow-hidden'>
          <div className='bg-muted h-1 w-full' />
          <CardContent className='p-6'>
            <Skeleton className='mb-2 h-6 w-32' />
            <Skeleton className='mb-4 h-4 w-48' />
            <div className='space-y-3'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
