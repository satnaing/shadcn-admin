import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function GeneralKnowledgeSkeleton() {
  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='space-y-6'>
          {/* Organization Name field skeleton */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' /> {/* Label */}
            <Skeleton className='h-10 w-full' /> {/* Input */}
            <Skeleton className='h-3 w-48' /> {/* Description */}
          </div>

          {/* Description field skeleton */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-24' /> {/* Label */}
            <Skeleton className='h-32 w-full' /> {/* Textarea */}
            <Skeleton className='h-3 w-96 max-w-full' /> {/* Description */}
          </div>

          {/* Competitors field skeleton */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-28' /> {/* Label */}
            <Skeleton className='h-32 w-full' /> {/* Textarea */}
            <Skeleton className='h-3 w-80 max-w-full' /> {/* Description */}
          </div>

          {/* Save button skeleton */}
          <div className='flex justify-end pt-4'>
            <Skeleton className='h-10 w-32' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
