import { useState } from 'react'
import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ChatInterface } from './components/chat-interface'
import { SessionList } from './components/session-list'
import { type AiSession } from './data/chat-types'
import { createMessage, sendChatMessage } from './lib/chat-service'

let sessionSeq = 0

export function AiChat() {
  const [sessions, setSessions] = useState<AiSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [waiting, setWaiting] = useState(false)

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null

  const handleNewChat = () => {
    const id = `session-${++sessionSeq}`
    setSessions((prev) => [...prev, { id, title: 'New Chat', messages: [] }])
    setActiveSessionId(id)
  }

  const handleSend = async (content: string) => {
    if (!activeSession || waiting) return

    const userMsg = createMessage('user', content)
    const updatedMessages = [...activeSession.messages, userMsg]

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              title: s.messages.length === 0 ? content.slice(0, 30) : s.title,
              messages: updatedMessages,
            }
          : s
      )
    )
    setWaiting(true)

    const reply = await sendChatMessage(updatedMessages)
    const assistantMsg = createMessage('assistant', reply)

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? { ...s, messages: [...updatedMessages, assistantMsg] }
          : s
      )
    )
    setWaiting(false)
  }

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main fixed>
        <section className='flex h-full gap-6'>
          <SessionList
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelect={setActiveSessionId}
            onNewChat={handleNewChat}
            className={cn(activeSession && 'hidden sm:flex')}
          />

          <div
            className={cn('min-w-0 flex-1', !activeSession && 'hidden sm:flex')}
          >
            {activeSession ? (
              <ChatInterface
                messages={activeSession.messages}
                waiting={waiting}
                onSend={handleSend}
              />
            ) : (
              <div className='flex h-full w-full flex-col items-center justify-center rounded-md border bg-card shadow-xs'>
                <div className='flex flex-col items-center space-y-6'>
                  <div className='flex size-16 items-center justify-center rounded-full border-2 border-border'>
                    <Bot className='size-8' />
                  </div>
                  <div className='space-y-2 text-center'>
                    <h1 className='text-xl font-semibold'>AI Assistant</h1>
                    <p className='text-sm text-muted-foreground'>
                      Start a new chat with your AI assistant.
                    </p>
                  </div>
                  <Button onClick={handleNewChat}>Start new chat</Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </Main>
    </>
  )
}
