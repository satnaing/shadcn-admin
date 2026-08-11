import { Fragment } from 'react'
import { Bot, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { type AiSession } from '../data/chat-types'

type SessionListProps = {
  sessions: AiSession[]
  activeSessionId: string | null
  className?: string
  onSelect: (id: string) => void
  onNewChat: () => void
}

export function SessionList({
  sessions,
  activeSessionId,
  className,
  onSelect,
  onNewChat,
}: SessionListProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80',
        className
      )}
    >
      <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
        <div className='flex items-center justify-between py-2'>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-bold'>AI Chat</h1>
            <Bot size={20} />
          </div>
          <Button
            size='icon'
            variant='ghost'
            onClick={onNewChat}
            className='rounded-lg'
          >
            <Plus size={24} className='stroke-muted-foreground' />
          </Button>
        </div>
        <Button className='w-full' onClick={onNewChat}>
          <Plus /> New Chat
        </Button>
      </div>

      <ScrollArea className='-mx-3 h-full overflow-scroll p-3'>
        {sessions.map((session) => {
          const lastMsg = session.messages[session.messages.length - 1]
          return (
            <Fragment key={session.id}>
              <button
                type='button'
                className={cn(
                  'group flex w-full flex-col gap-1 rounded-md px-2 py-2 text-start text-sm hover:bg-accent hover:text-accent-foreground',
                  activeSessionId === session.id && 'bg-muted'
                )}
                onClick={() => onSelect(session.id)}
              >
                <span className='line-clamp-1 font-medium'>{session.title}</span>
                {lastMsg && (
                  <span className='line-clamp-1 text-muted-foreground group-hover:text-accent-foreground/90'>
                    {lastMsg.content}
                  </span>
                )}
              </button>
              <Separator className='my-1' />
            </Fragment>
          )
        })}
      </ScrollArea>
    </div>
  )
}
