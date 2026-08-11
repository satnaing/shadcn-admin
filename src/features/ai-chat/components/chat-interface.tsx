import { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { Bot, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { type ChatMessage } from '../data/chat-types'

type ChatInterfaceProps = {
  messages: ChatMessage[]
  waiting: boolean
  onSend: (content: string) => void
}

export function ChatInterface({ messages, waiting, onSend }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // 新消息或等待回复时自动滚动到底部
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, waiting])

  const submit = () => {
    const content = input.trim()
    if (!content || waiting) return
    onSend(content)
    setInput('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit()
  }

  return (
    <div className='flex h-full w-full flex-col rounded-md border bg-card shadow-xs'>
      {/* 消息区 */}
      <div ref={scrollRef} className='flex-1 overflow-y-auto p-4'>
        <div className='flex flex-col gap-4'>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'max-w-72 px-3 py-2 wrap-break-word shadow-lg',
                msg.role === 'user'
                  ? 'self-end rounded-[16px_16px_0_16px] bg-primary/90 text-primary-foreground/75'
                  : 'self-start rounded-[16px_16px_16px_0] bg-muted'
              )}
            >
              {msg.content}
              <span
                className={cn(
                  'mt-1 block text-xs font-light italic text-foreground/75',
                  msg.role === 'user' && 'text-end text-primary-foreground/85'
                )}
              >
                {format(msg.timestamp, 'h:mm a')}
              </span>
            </div>
          ))}
          {waiting && (
            <div className='flex items-center gap-2 self-start rounded-[16px_16px_16px_0] bg-muted px-3 py-2'>
              <Bot size={16} className='shrink-0' />
              <div className='flex flex-col gap-1'>
                <Skeleton className='h-3 w-40' />
                <Skeleton className='h-3 w-24' />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 输入区 */}
      <form
        onSubmit={handleSubmit}
        className='flex w-full flex-none gap-2 p-3 sm:p-4'
      >
        <Textarea
          placeholder='Type your message...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          className='max-h-40 min-h-10 flex-1'
        />
        <Button
          type='submit'
          size='icon'
          disabled={waiting || !input.trim()}
          className='h-auto'
        >
          <Send size={18} />
          <span className='sr-only'>Send</span>
        </Button>
      </form>
    </div>
  )
}
