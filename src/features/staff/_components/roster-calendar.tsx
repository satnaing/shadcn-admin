import { useMemo } from 'react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { useShifts } from '@/hooks/queries/use-shifts'
import { Badge } from '@/components/ui/badge'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface RosterCalendarProps {
  shopId: string
}

export function RosterCalendar({ shopId }: RosterCalendarProps) {
  const startDate = useMemo(() => startOfWeek(new Date()), [])
  const endDate = useMemo(() => endOfWeek(new Date()), [])

  const { data: shifts = [], isLoading } = useShifts(
    useMemo(
      () => ({
        shopId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }),
      [shopId, startDate, endDate]
    )
  )

  if (isLoading) {
    return (
      <Card>
        <CardContent className='flex h-64 items-center justify-center'>
          <BrandLoader />
        </CardContent>
      </Card>
    )
  }

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  return (
    <Card className='flex h-full flex-col'>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
        <p className='text-sm text-muted-foreground'>
          {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
        </p>
      </CardHeader>
      <CardContent className='flex-1 overflow-hidden p-0'>
        <ScrollArea className='h-[500px]'>
          <div className='divide-y'>
            {days.map((day) => {
              const shiftsArray = Array.isArray(shifts)
                ? shifts
                : (shifts as any)?.data || []
              const dayShifts = shiftsArray.filter(
                (s: any) =>
                  format(new Date(s.startTime), 'yyyy-MM-dd') ===
                  format(day, 'yyyy-MM-dd')
              )

              return (
                <div key={day.toString()} className='p-4'>
                  <div className='mb-2 font-medium'>
                    {format(day, 'EEEE, MMM d')}
                  </div>
                  <div className='space-y-2'>
                    {dayShifts.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>
                        No shifts scheduled
                      </p>
                    ) : (
                      dayShifts.map((shift: any) => (
                        <div
                          key={shift.id}
                          className='flex items-center justify-between rounded-lg border bg-muted/50 p-3'
                        >
                          <div className='flex items-center gap-3'>
                            <div className='flex flex-col'>
                              <span className='text-sm font-medium'>
                                {shift.staff?.fullName || 'Unknown Staff'}
                              </span>
                              <span className='text-xs text-muted-foreground'>
                                {format(new Date(shift.startTime), 'hh:mm a')} -{' '}
                                {shift.endTime
                                  ? format(new Date(shift.endTime), 'hh:mm a')
                                  : 'Active'}
                              </span>
                            </div>
                          </div>
                          <Badge variant='outline'>{shift.shiftRole}</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
