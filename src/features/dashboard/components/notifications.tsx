import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'

const INITIAL_COUNT = 6
const LOAD_MORE_COUNT = 4

export function Notifications() {
  const [items, setItems] = useState(initialNotifications)
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)

  const unreadCount = items.filter((n) => !n.read).length
  const visibleItems = items.slice(0, visibleCount)
  const hasMore = visibleCount < items.length

  function markAllAsRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function toggleRead(id: number) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  function loadMore() {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, items.length))
  }

  return (
    <div className='space-y-4'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Unread</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' />
              <path d='M13.73 21a2 2 0 0 1-3.46 0' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{unreadCount}</div>
            <p className='text-xs text-muted-foreground'>
              +3 since last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Mentions</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <circle cx='12' cy='12' r='4' />
              <path d='M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>4</div>
            <p className='text-xs text-muted-foreground'>
              +2 since yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              System Alerts
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' />
              <path d='M12 9v4' />
              <path d='M12 17h.01' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>2</div>
            <p className='text-xs text-muted-foreground'>
              1 critical, 1 warning
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Read This Week
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
              <path d='m9 11 3 3L22 4' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>28</div>
            <p className='text-xs text-muted-foreground'>
              +12% from last week
            </p>
          </CardContent>
        </Card>
      </div>
      <div className='grid grid-cols-1 gap-4'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}.`
                    : 'All caught up! No unread notifications.'}
                </CardDescription>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant='outline'
                  size='sm'
                  className='shrink-0'
                  onClick={markAllAsRead}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='mr-1.5 h-3.5 w-3.5'
                  >
                    <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
                    <path d='m9 11 3 3L22 4' />
                  </svg>
                  Mark all as read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className='max-h-[600px] overflow-y-auto px-3'>
              <div className='space-y-1'>
                {visibleItems.map((notification) => (
                  <button
                    key={notification.id}
                    type='button'
                    className={`-mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-start gap-4 rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted/50 ${
                      notification.read ? 'opacity-60' : ''
                    }`}
                    onClick={() => toggleRead(notification.id)}
                  >
                    <span className='relative mt-0.5'>
                      <Avatar className='h-9 w-9'>
                        <AvatarImage
                          src={notification.avatar}
                          alt={notification.name}
                        />
                        <AvatarFallback>
                          {notification.initials}
                        </AvatarFallback>
                      </Avatar>
                      {!notification.read && (
                        <span className='absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary' />
                      )}
                    </span>
                    <div className='flex-1 space-y-1'>
                      <div className='flex items-center gap-2'>
                        <p
                          className={`text-sm leading-none ${
                            notification.read
                              ? 'font-normal text-muted-foreground'
                              : 'font-semibold'
                          }`}
                        >
                          {notification.name}
                        </p>
                        <Badge variant={notification.badgeVariant}>
                          {notification.type}
                        </Badge>
                      </div>
                      <p
                        className={`text-sm ${
                          notification.read
                            ? 'text-muted-foreground/70'
                            : 'text-foreground/80'
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className='text-xs text-muted-foreground/60'>
                        {notification.time}
                      </p>
                    </div>
                    {notification.read && (
                      <span className='mt-1 shrink-0 text-xs text-muted-foreground/50'>
                        Read
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            {hasMore && (
              <div className='mt-4 flex justify-center'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground'
                  onClick={loadMore}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='mr-1.5 h-4 w-4'
                  >
                    <path d='M12 5v14' />
                    <path d='m19 12-7 7-7-7' />
                  </svg>
                  Load more
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const initialNotifications: {
  id: number
  name: string
  avatar: string
  initials: string
  message: string
  time: string
  type: string
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline'
  read: boolean
}[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    initials: 'OM',
    message: 'Commented on your recent pull request #42.',
    time: '2 minutes ago',
    type: 'Comment',
    badgeVariant: 'secondary',
    read: false,
  },
  {
    id: 2,
    name: 'System',
    avatar: '',
    initials: 'SY',
    message: 'CPU usage exceeded 90% threshold on production server.',
    time: '15 minutes ago',
    type: 'Alert',
    badgeVariant: 'destructive',
    read: false,
  },
  {
    id: 3,
    name: 'Jackson Lee',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'JL',
    message: 'Mentioned you in the project discussion.',
    time: '1 hour ago',
    type: 'Mention',
    badgeVariant: 'default',
    read: false,
  },
  {
    id: 4,
    name: 'Isabella Nguyen',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    initials: 'IN',
    message: 'Shared the Q4 analytics report with you.',
    time: '3 hours ago',
    type: 'Share',
    badgeVariant: 'outline',
    read: true,
  },
  {
    id: 5,
    name: 'William Kim',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'WK',
    message: 'Approved your access request for staging environment.',
    time: '5 hours ago',
    type: 'Security',
    badgeVariant: 'secondary',
    read: true,
  },
  {
    id: 6,
    name: 'Sofia Davis',
    avatar: 'https://randomuser.me/api/portraits/men/30.jpg',
    initials: 'SD',
    message: 'Left a review on your latest deployment.',
    time: 'Yesterday',
    type: 'Comment',
    badgeVariant: 'secondary',
    read: true,
  },
  {
    id: 7,
    name: 'System',
    avatar: '',
    initials: 'SY',
    message: 'Scheduled maintenance completed successfully.',
    time: 'Yesterday',
    type: 'Alert',
    badgeVariant: 'outline',
    read: true,
  },
  {
    id: 8,
    name: 'Olivia Martin',
    avatar: 'https://randomuser.me/api/portraits/men/31.jpg',
    initials: 'OM',
    message: 'Assigned you to issue #128 — fix login redirect.',
    time: '2 days ago',
    type: 'Mention',
    badgeVariant: 'default',
    read: true,
  },
  {
    id: 9,
    name: 'Jackson Lee',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'JL',
    message: 'Merged your pull request #39 into main.',
    time: '2 days ago',
    type: 'Comment',
    badgeVariant: 'secondary',
    read: true,
  },
  {
    id: 10,
    name: 'System',
    avatar: '',
    initials: 'SY',
    message: 'Your API key will expire in 7 days. Renew it now.',
    time: '3 days ago',
    type: 'Security',
    badgeVariant: 'destructive',
    read: true,
  },
  {
    id: 11,
    name: 'Isabella Nguyen',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'IN',
    message: 'Invited you to collaborate on the Design System project.',
    time: '3 days ago',
    type: 'Share',
    badgeVariant: 'outline',
    read: true,
  },
  {
    id: 12,
    name: 'William Kim',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'WK',
    message: 'Commented on your Q3 performance review.',
    time: '4 days ago',
    type: 'Comment',
    badgeVariant: 'secondary',
    read: true,
  },
  {
    id: 13,
    name: 'Sofia Davis',
    avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
    initials: 'SD',
    message: 'Updated the team onboarding documentation.',
    time: '5 days ago',
    type: 'Share',
    badgeVariant: 'outline',
    read: true,
  },
  {
    id: 14,
    name: 'System',
    avatar: '',
    initials: 'SY',
    message: 'Storage usage has reached 80% of your plan limit.',
    time: '5 days ago',
    type: 'Alert',
    badgeVariant: 'destructive',
    read: true,
  },
]
