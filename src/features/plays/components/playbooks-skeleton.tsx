import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function PlaybooksSkeleton() {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className='overflow-hidden'>
          <CardContent className='p-6'>
            <div className='mb-4 flex items-start justify-between'>
              <div className='space-y-2'>
                <Skeleton className='h-6 w-32' />
                <Skeleton className='h-4 w-48' />
              </div>
              <Skeleton className='h-8 w-8 rounded' />
            </div>
            <div className='space-y-3'>
              <div className='flex items-center gap-4'>
                <Skeleton className='h-10 w-24' />
                <Skeleton className='h-10 w-32' />
              </div>
              <Skeleton className='h-4 w-full' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
