import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Header skeleton */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-7 w-48' />
          <Skeleton className='h-4 w-64' />
        </div>
        <Skeleton className='h-10 w-36 rounded-full' />
      </div>

      {/* Row 1: KPI Cards */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-6'>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className='h-[210px]'>
              <CardContent className='flex h-full flex-col justify-between p-5'>
                <div className='flex justify-between'>
                  <div className='space-y-2'>
                    <Skeleton className='h-8 w-20' />
                    <Skeleton className='h-4 w-28' />
                  </div>
                  <Skeleton className='h-10 w-10 rounded-lg' />
                </div>
                <Skeleton className='h-10 w-full' />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-6'>
          <Card className='h-[436px]'>
            <CardContent className='flex h-full flex-col justify-between p-5'>
              <div className='space-y-2'>
                <Skeleton className='h-8 w-28' />
                <Skeleton className='h-4 w-32' />
              </div>
              <Skeleton className='h-14 w-full rounded-lg' />
              <Skeleton className='h-28 w-full' />
              <Skeleton className='h-12 w-full' />
            </CardContent>
          </Card>

          <Card className='h-[436px]'>
            <CardContent className='flex h-full flex-col justify-between p-5'>
              <div className='space-y-2'>
                <Skeleton className='h-8 w-20' />
                <Skeleton className='h-4 w-36' />
              </div>
              <Skeleton className='h-16 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-16 w-full' />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 2: Orders & In-house Store */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Card className='h-80'>
          <CardContent className='p-6'>
            <Skeleton className='h-6 w-32' />
            <div className='mt-6 grid grid-cols-2 gap-4'>
              <Skeleton className='h-48 w-full' />
              <Skeleton className='h-48 w-full' />
            </div>
          </CardContent>
        </Card>
        <Card className='h-80'>
          <CardContent className='p-6'>
            <Skeleton className='h-6 w-32' />
            <div className='mt-6 grid grid-cols-3 gap-2'>
              <Skeleton className='h-16 w-full' />
              <Skeleton className='h-16 w-full' />
              <Skeleton className='h-16 w-full' />
            </div>
            <Skeleton className='mt-4 h-24 w-full' />
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Rankings */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Card className='h-96'>
          <CardContent className='p-6'>
            <Skeleton className='h-6 w-48' />
            <Skeleton className='mt-4 h-12 w-full' />
            <Skeleton className='mt-4 h-48 w-full' />
          </CardContent>
        </Card>
        <Card className='h-96'>
          <CardContent className='p-6'>
            <Skeleton className='h-6 w-48' />
            <Skeleton className='mt-4 h-12 w-full' />
            <Skeleton className='mt-4 h-48 w-full' />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
