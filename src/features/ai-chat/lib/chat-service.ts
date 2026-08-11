import type { ChatMessage, ChatRole } from '../data/chat-types'

/**
 * 创建一条聊天消息（id / timestamp 在此生成，避免组件内调用不纯函数）。
 */
export function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: Date.now(),
  }
}

/**
 * 发送消息并获取 AI 回复。
 * TODO: 接入真实 AI 接口时替换此实现，例如调用 OpenAI 兼容的
 * `/v1/chat/completions`（可通过 Vite dev server proxy 转发避免 API Key 暴露），
 * 将 messages 映射为 [{ role, content }] 后请求即可，无需改动页面组件。
 */
export async function sendChatMessage(
  messages: Pick<ChatMessage, 'role' | 'content'>[]
): Promise<string> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 600))
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
  const text = lastUserMsg?.content.trim() || ''

  // 基于关键字的简单模拟回复 + 默认兜底
  if (/你好|hi|hello/i.test(text)) {
    return '你好！我是你的 AI 助手，有什么可以帮你？'
  }
  if (text.endsWith('？') || text.endsWith('?')) {
    return '这是个好问题，等我接入真实 AI 模型后就能给你更准确的答案了。'
  }
  return `你刚才说：「${text}」。当前是模拟回复，后续将接入真实 AI 接口。`
}
