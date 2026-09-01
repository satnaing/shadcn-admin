import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import { format } from 'date-fns'
import { Bot, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { type ChatMessage } from '../data/chat-types'

// 打字机参数：每 25ms 显示 1 个字符（约 40 字/秒，接近豆包的输出速度）
const TYPING_INTERVAL_MS = 25
const TYPING_CHARS_PER_TICK = 1

type ChatInterfaceProps = {
  messages: ChatMessage[]
  waiting: boolean
  onSend: (content: string) => void
}

export function ChatInterface({
  messages,
  waiting,
  onSend,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // 打字机状态：当前正在逐字显示的消息 id、已显示字符数、已完成显示的消息 id 集合
  const [typingId, setTypingId] = useState<string | null>(null)
  const [charsToShow, setCharsToShow] = useState(0)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())

  const lastMsg = messages[messages.length - 1]

  // 打字机驱动：新 assistant 消息开始逐字显示，完成后标记。
  // 所有 setState 均在定时器回调中执行，避免在 effect 同步阶段触发重渲染。
  useEffect(() => {
    if (waiting) return
    if (!lastMsg || lastMsg.role !== 'assistant') return

    if (lastMsg.id !== typingId && !completedIds.has(lastMsg.id)) {
      // 出现新的 assistant 消息 → 下一帧开始打字机
      const timer = setTimeout(() => {
        setTypingId(lastMsg.id)
        setCharsToShow(0)
      }, 0)
      return () => clearTimeout(timer)
    }

    if (lastMsg.id === typingId && charsToShow < lastMsg.content.length) {
      // 正在打字 → 逐字推进
      const timer = setTimeout(() => {
        setCharsToShow((c) =>
          Math.min(c + TYPING_CHARS_PER_TICK, lastMsg.content.length)
        )
      }, TYPING_INTERVAL_MS)
      return () => clearTimeout(timer)
    }

    if (lastMsg.id === typingId && charsToShow >= lastMsg.content.length) {
      // 打字完成 → 标记已完成并结束
      const timer = setTimeout(() => {
        setTypingId(null)
        setCompletedIds((prev) => new Set(prev).add(lastMsg.id))
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [messages, waiting, typingId, charsToShow, completedIds, lastMsg])

  // 新消息、等待回复或打字机推进时自动滚动到底部
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, waiting, charsToShow, typingId])

  const submit = () => {
    const content = input.trim()
    if (!content || waiting) return
    onSend(content)
    setInput('')
  }

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    submit()
  }

  // 该消息是否正在以打字机方式显示（尚未完成且为最后一条 assistant 消息）
  const isStreaming = (msg: ChatMessage) =>
    msg.role === 'assistant' &&
    !completedIds.has(msg.id) &&
    (msg.id === typingId || msg === lastMsg)

  return (
    <div className='flex h-full w-full flex-col rounded-md border bg-card shadow-xs'>
      {/* 消息区 */}
      <div ref={scrollRef} className='flex-1 overflow-y-auto p-4'>
        <div className='flex flex-col gap-4'>
          {messages.map((msg) => {
            const streaming = isStreaming(msg)
            const shownContent = streaming
              ? msg.content.slice(0, msg.id === typingId ? charsToShow : 0)
              : msg.content
            return (
              <div
                key={msg.id}
                className={cn(
                  'max-w-72 px-3 py-2 wrap-break-word shadow-lg',
                  msg.role === 'user'
                    ? 'self-end rounded-[16px_16px_0_16px] bg-primary/90 text-primary-foreground/75'
                    : 'self-start rounded-[16px_16px_16px_0] bg-muted'
                )}
              >
                {shownContent}
                {streaming && <span className='animate-pulse'>▍</span>}
                <span
                  className={cn(
                    'mt-1 block text-xs font-light text-foreground/75 italic',
                    msg.role === 'user' && 'text-end text-primary-foreground/85'
                  )}
                >
                  {format(msg.timestamp, 'h:mm a')}
                </span>
              </div>
            )
          })}
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
