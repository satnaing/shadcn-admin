import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import type { Message } from '@/graphql/global/types.generated'
import {
  Mail,
  Linkedin,
  Send,
  MessageSquare,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Loadable } from '@/components/loadable'
import { statuses } from '../data/data'
import { useGetMessagesByCampaignContactQuery } from '../graphql/operations.generated'
import { useOutreach } from './outreach-provider'
import { TimelineSkeleton } from './timeline-skeleton'

type TimelineEvent = {
  id: string
  timestamp: Date
  type: 'campaign_event' | 'message'
  title: string
  description?: string
  icon: React.ReactNode
  iconBackground?: string
  message?: Partial<Message>
}

export function OutreachTimelineSheet() {
  const { open, setOpen, currentOutreach } = useOutreach()
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])

  const { data: messagesData, loading: messagesLoading } = useGetMessagesByCampaignContactQuery({
    variables: {
      filters: {
        campaignContactId: currentOutreach?.id,
      },
    },
    skip: !currentOutreach?.id || open !== 'view',
  })

  useEffect(() => {
    if (!currentOutreach) return

    const events: TimelineEvent[] = []

    // Add campaign contact events
    events.push({
      id: `created-${currentOutreach.id}`,
      timestamp: new Date(currentOutreach.createdAt),
      type: 'campaign_event',
      title: 'Outreach queued',
      icon: <UserPlus className='h-4 w-4' />,
      iconBackground: 'bg-blue-100 text-blue-600',
    })

    if (currentOutreach.connectionSentAt) {
      events.push({
        id: `connection-sent-${currentOutreach.id}`,
        timestamp: new Date(currentOutreach.connectionSentAt),
        type: 'campaign_event',
        title: 'LinkedIn connection sent',
        icon: <Send className='h-4 w-4' />,
        iconBackground: 'bg-purple-100 text-purple-600',
      })
    }

    if (currentOutreach.connectedAt) {
      events.push({
        id: `connected-${currentOutreach.id}`,
        timestamp: new Date(currentOutreach.connectedAt),
        type: 'campaign_event',
        title: 'LinkedIn connection accepted',
        icon: <CheckCircle2 className='h-4 w-4' />,
        iconBackground: 'bg-green-100 text-green-600',
      })
    }

    if (currentOutreach.repliedAt) {
      events.push({
        id: `replied-${currentOutreach.id}`,
        timestamp: new Date(currentOutreach.repliedAt),
        type: 'campaign_event',
        title: 'Contact replied',
        icon: <MessageSquare className='h-4 w-4' />,
        iconBackground: 'bg-green-100 text-green-600',
      })
    }

    if (currentOutreach.finishedAt) {
      events.push({
        id: `finished-${currentOutreach.id}`,
        timestamp: new Date(currentOutreach.finishedAt),
        type: 'campaign_event',
        title: 'Campaign finished',
        icon: <CheckCircle2 className='h-4 w-4' />,
        iconBackground: 'bg-gray-100 text-gray-600',
      })
    }

    if (currentOutreach.rejectedAt) {
      events.push({
        id: `rejected-${currentOutreach.id}`,
        timestamp: new Date(currentOutreach.rejectedAt),
        type: 'campaign_event',
        title: 'Connection request expired',
        icon: <XCircle className='h-4 w-4' />,
        iconBackground: 'bg-red-100 text-red-600',
      })
    }

    // Add messages to timeline
    if (messagesData?.messages.data) {
      messagesData.messages.data.forEach((message) => {
        const isSent = message.type === 'SENT'
        const isEmail = message.appType === 'EMAIL'

        events.push({
          id: message.id,
          timestamp: new Date(message.createdAt),
          type: 'message',
          title: isSent ? 'Message sent' : 'Message received',
          icon: isEmail ? <Mail className='h-4 w-4' /> : <Linkedin className='h-4 w-4' />,
          iconBackground: isSent ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600',
          message,
        })
      })
    }

    // Sort events by timestamp (newest first)
    events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    setTimelineEvents(events)
  }, [currentOutreach, messagesData])

  if (!currentOutreach) return null

  const status = statuses.find((s) => s.value === currentOutreach.status)
  const contact = currentOutreach.contact
  const sender = currentOutreach.sender
  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(' ')
  const contactInitials = [contact.firstName?.[0], contact.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase()

  return (
    <Sheet open={open === 'view'} onOpenChange={(open) => !open && setOpen(null)}>
      <SheetContent className='w-[600px] p-0 sm:max-w-[600px]'>
        <SheetHeader className='p-6 pb-4'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-12 w-12'>
              <AvatarFallback>{contactInitials || '??'}</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <a
                href={contact.linkedinUrl || ''}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline'
              >
                <SheetTitle className='text-xl'>{fullName || 'Unknown Contact'}</SheetTitle>
              </a>
              <SheetDescription>
                {contact.title && `${contact.title} `}
                {contact.title && contact.company?.domain && '@ '}
                {contact.company?.domain ? (
                  <a
                    href={
                      contact.company?.domain.startsWith('http')
                        ? contact.company.domain
                        : `https://${contact.company?.domain}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    {contact.company?.name || contact.company?.domain || 'Unknown Company'}
                  </a>
                ) : (
                  ' - Unknown Company'
                )}
              </SheetDescription>
            </div>
            {status && (
              <Badge variant='outline' className='flex items-center gap-1'>
                <status.icon className='h-3 w-3' />
                {status.label}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <Separator />

        <ScrollArea className='h-[calc(100vh-120px)]'>
          <div className='space-y-6 px-6 pb-6'>
            {/* Sender Details */}

            <h3 className='mb-3 text-sm font-medium'>Sender</h3>
            {sender ? (
              <div className='grid grid-cols-2 gap-6'>
                {/* Sender Column */}

                <>
                  {sender.name && (
                    <div>
                      <span className='text-muted-foreground'>Name:</span>
                      <p className='font-medium'>{sender.name}</p>
                    </div>
                  )}
                  {sender.email && (
                    <div>
                      <span className='text-muted-foreground'>Email:</span>
                      <p className='font-medium'>{sender.email}</p>
                    </div>
                  )}
                  <div>
                    <span className='text-muted-foreground'>Email Enabled:</span>
                    <p className='font-medium'>
                      <Badge variant={'secondary'} className='text-xs'>
                        {sender.isEmailEnabled ? 'Yes' : 'No'}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>LinkedIn Enabled:</span>
                    <p className='font-medium'>
                      <Badge variant={'secondary'} className='text-xs'>
                        {sender.isLinkedinEnabled ? 'Yes' : 'No'}
                      </Badge>
                    </p>
                  </div>
                </>
              </div>
            ) : (
              <div className='text-muted-foreground'>No sender information available</div>
            )}

            {/* Reachout Reason */}
            {currentOutreach.reachoutReason && (
              <div>
                <span className='text-muted-foreground'>Reachout Reason:</span>
                <p className='mt-1 text-sm'>{currentOutreach.reachoutReason}</p>
              </div>
            )}

            <Separator />

            {/* Timeline */}
            <div>
              <h3 className='mb-4 text-sm font-medium'>Activity Timeline</h3>
              <Loadable
                isLoading={messagesLoading}
                loader={<TimelineSkeleton />}
                isEmpty={timelineEvents.length === 0}
                emptyComponent={
                  <div className='text-muted-foreground py-8 text-center'>No activity yet</div>
                }
              >
                <div className='relative space-y-4'>
                  {/* Timeline line */}
                  <div
                    className='bg-border animate-fade-in absolute top-5 bottom-5 left-5 w-px opacity-0'
                    style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
                  />

                  {timelineEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className='animate-fade-in-up relative flex gap-4 opacity-0'
                      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                    >
                      {/* Timeline dot */}
                      <div
                        className={cn(
                          'bg-background relative z-10 flex h-10 w-10 items-center justify-center rounded-full border',
                          event.iconBackground
                        )}
                      >
                        {event.icon}
                      </div>

                      {/* Content */}
                      <div className='flex-1 pb-4'>
                        <div className='mb-1 flex items-center justify-between gap-2'>
                          <p className='text-sm font-medium'>{event.title}</p>
                          <time className='text-muted-foreground text-xs'>
                            {format(event.timestamp, 'MMM d, HH:mm')}
                          </time>
                        </div>

                        {event.description && (
                          <p className='text-muted-foreground text-sm'>{event.description}</p>
                        )}

                        {event.message && (
                          <div className='bg-muted/50 mt-2 rounded-lg border p-3'>
                            {event.message.subject && (
                              <p className='mb-1 text-sm font-medium'>{event.message.subject}</p>
                            )}
                            <p className='text-sm whitespace-pre-wrap'>{event.message.text}</p>
                            {event.message.reaction && (
                              <Badge variant='secondary' className='mt-2'>
                                {event.message.reaction}
                              </Badge>
                            )}
                            <div className='text-muted-foreground mt-2 flex items-center gap-2 text-xs'>
                              {event.message.type === 'SENT' ? (
                                <ArrowUpRight className='h-3 w-3' />
                              ) : (
                                <ArrowDownLeft className='h-3 w-3' />
                              )}
                              <span>
                                {event.message.type === 'SENT' ? 'Sent' : 'Received'} via{' '}
                                {event.message.appType === 'EMAIL' ? 'Email' : 'LinkedIn'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Loadable>
            </div>

            {/* Error Message */}
            {currentOutreach.error && (
              <>
                <Separator />
                <div>
                  <h3 className='mb-3 text-sm font-medium'>Error Details</h3>
                  <div className='bg-destructive/10 border-destructive/20 rounded-md border p-3'>
                    <div className='flex items-start gap-2'>
                      <AlertCircle className='text-destructive mt-0.5 h-4 w-4' />
                      <p className='text-destructive text-sm'>{currentOutreach.error}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
