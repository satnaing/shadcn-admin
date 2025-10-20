import { format, formatDistanceToNow, isSameDay } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  ActivityLog,
  getActionLabel,
  getSeverityBadgeVariant,
  getSeverityColor,
} from '../data/schema'

interface ActivityLogsTimelineProps {
  data: ActivityLog[]
}

export function ActivityLogsTimeline({ data }: ActivityLogsTimelineProps) {
  // Group logs by date
  const groupedLogs = data.reduce(
    (groups, log) => {
      const dateKey = format(log.timestamp, 'yyyy-MM-dd')
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(log)
      return groups
    },
    {} as Record<string, ActivityLog[]>
  )

  const sortedDates = Object.keys(groupedLogs).sort((a, b) =>
    b.localeCompare(a)
  )

  return (
    <ScrollArea className='h-[calc(100vh-300px)]'>
      <div className='space-y-8'>
        {sortedDates.map((dateKey) => {
          const logs = groupedLogs[dateKey]
          const date = new Date(dateKey)
          const isToday = isSameDay(date, new Date())

          return (
            <div key={dateKey} className='space-y-4'>
              <div className='sticky top-0 z-10 bg-background pb-2'>
                <h3 className='text-lg font-semibold'>
                  {isToday ? 'Today' : format(date, 'MMMM dd, yyyy')}
                </h3>
                <p className='text-muted-foreground text-sm'>
                  {logs.length} {logs.length === 1 ? 'event' : 'events'}
                </p>
              </div>

              <div className='relative space-y-4 border-l-2 border-muted pl-6'>
                {logs.map((log) => {
                  const initials = log.userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)

                  return (
                    <div key={log.id} className='relative'>
                      {/* Timeline dot */}
                      <div
                        className={cn(
                          'absolute -left-[29px] mt-2 h-4 w-4 rounded-full border-4 border-background',
                          getSeverityColor(log.severity).replace(
                            'text-',
                            'bg-'
                          )
                        )}
                      />

                      <Card className='hover:shadow-md transition-shadow'>
                        <CardContent className='p-4'>
                          <div className='flex items-start gap-4'>
                            <Avatar className='h-10 w-10'>
                              <AvatarImage
                                src={log.userAvatar}
                                alt={log.userName}
                              />
                              <AvatarFallback className='text-xs'>
                                {initials}
                              </AvatarFallback>
                            </Avatar>

                            <div className='flex-1 space-y-2'>
                              <div className='flex items-start justify-between gap-2'>
                                <div>
                                  <p className='font-medium'>{log.userName}</p>
                                  <p className='text-muted-foreground text-sm'>
                                    {log.description}
                                  </p>
                                </div>
                                <div className='flex shrink-0 flex-col items-end gap-2'>
                                  <span className='text-muted-foreground text-xs'>
                                    {formatDistanceToNow(log.timestamp, {
                                      addSuffix: true,
                                    })}
                                  </span>
                                  <Badge
                                    variant={getSeverityBadgeVariant(
                                      log.severity
                                    )}
                                    className='capitalize'
                                  >
                                    {log.severity}
                                  </Badge>
                                </div>
                              </div>

                              <div className='flex flex-wrap gap-2'>
                                <Badge variant='secondary' className='text-xs'>
                                  {getActionLabel(log.action)}
                                </Badge>
                                <Badge
                                  variant='outline'
                                  className='text-xs capitalize'
                                >
                                  {log.resource}
                                </Badge>
                              </div>

                              {log.metadata && (
                                <div className='text-muted-foreground mt-2 flex gap-3 text-xs'>
                                  {log.metadata.device && (
                                    <span>Device: {log.metadata.device}</span>
                                  )}
                                  {log.metadata.browser && (
                                    <span>Browser: {log.metadata.browser}</span>
                                  )}
                                  {log.metadata.location && (
                                    <span>
                                      Location: {log.metadata.location}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
