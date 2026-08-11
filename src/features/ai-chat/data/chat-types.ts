export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  timestamp: number
}

export type AiSession = {
  id: string
  title: string
  messages: ChatMessage[]
}
