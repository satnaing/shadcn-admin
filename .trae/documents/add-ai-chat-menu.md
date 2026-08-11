# 在 General 菜单下新增「AI 聊天」功能

## Summary（目标）

在侧边栏「General」分组下新增一个「AI Chat」菜单项，点击进入一个聊天 AI 页面。页面复用现有 Chats 页面的左右分栏风格（左侧会话列表 + 右侧对话区）。当前阶段**不接真实 AI 接口**，使用前端模拟回复；但通过独立的 service 层预留接入口，后续可无缝替换为真实 AI API（如 OpenAI 兼容的 `/v1/chat/completions`）。

## 当前状态分析（Current State）

- 侧边栏菜单定义在 [sidebar-data.ts](file:///Users/wangzijie/Documents/wx/shadcn-admin/src/components/layout/data/sidebar-data.ts) 的 `navGroups` 中，「General」分组在第 52-100 行，包含 Dashboard、Tasks、Apps、Chats、Users 等菜单项。
- 路由采用 TanStack Router 文件式路由（`@tanstack/router-plugin` 自动生成 `routeTree.gen.ts`，无需手动改）。受保护路由位于 `src/routes/_authenticated/` 下，每个路由对应一个 `src/features/<name>/` 功能模块。
- 现有 Chats 页（`src/features/chats/index.tsx`）提供左右分栏的聊天 UI 参考：`Header` + `Main fixed` 布局、左栏会话列表、右栏消息气泡 + 输入框。
- 页面通用骨架模式（参考 `src/features/tasks/index.tsx`）：`Header`（Search + ThemeSwitch + ConfigDrawer + ProfileDropdown）+ `Main`。
- 项目无后端、无 AI/LLM 依赖；UI 组件齐全（Button、Textarea、ScrollArea、Avatar、Skeleton 等）。

## 变更方案（Proposed Changes）

### 1. 侧边栏菜单：`src/components/layout/data/sidebar-data.ts`

在「General」分组的 items 中新增一项（放在 Chats 之后，User 之前或之后均可，建议紧随 Chats 之后）：

```ts
{
  title: 'AI Chat',
  url: '/ai-chat',
  icon: Bot,
},
```

- `Bot` 图标从 `lucide-react` 引入（与现有图标引入方式一致，见第 1-24 行 import 列表）。

### 2. 路由文件：`src/routes/_authenticated/ai-chat/index.tsx`（新建）

```ts
import { createFileRoute } from '@tanstack/react-router'
import { AiChat } from '@/features/ai-chat'

export const Route = createFileRoute('/_authenticated/ai-chat/')({
  component: AiChat,
})
```

- 与现有路由（如 `chats/index.tsx`、`apps/index.tsx`）模式完全一致。路由文件创建后由 router plugin 自动注册，无需手改 `routeTree.gen.ts`。

### 3. AI 聊天功能模块：`src/features/ai-chat/`（新建）

#### 3.1 `src/features/ai-chat/data/chat-types.ts`

定义类型（沿用 chats 的 `data/` 目录约定）：

```ts
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
```

#### 3.2 `src/features/ai-chat/lib/chat-service.ts`（新建）— 关键预留接口

AI 能力统一收口在此 service，当前返回模拟回复，后续替换为真实 API：

```ts
import type { ChatMessage } from '../data/chat-types'

/**
 * 发送消息并获取 AI 回复。
 * TODO: 接入真实 AI 接口时替换此实现，例如调用 OpenAI 兼容的
 * `/v1/chat/completions`（可通过 Vite dev server proxy 转发避免 API Key 暴露），
 * 将 messages 映射为 [{ role, content }] 后请求即可，无需改动页面组件。
 */
export async function sendChatMessage(
  messages: Pick<ChatMessage, 'role' | 'content'>[]
): Promise<string> {
  // 模拟延迟，模拟 AI 回复
  await new Promise((resolve) => setTimeout(resolve, 600))
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
  const text = lastUserMsg?.content.trim() || ''
  // 基于关键字的简单模拟回复 + 默认兜底
  if (/你好|hi|hello/i.test(text)) return '你好！我是你的 AI 助手，有什么可以帮你？'
  if (text.endsWith('？') || text.endsWith('?')) return '这是个好问题，等我接入真实 AI 模型后就能给你更准确的答案了。'
  return `你刚才说：「${text}」。当前是模拟回复，后续将接入真实 AI 接口。`
}
```

- 组件只依赖 `sendChatMessage`，不感知内部实现 → 后续接真实 API 时只改这一个文件。

#### 3.3 `src/features/ai-chat/components/chat-interface.tsx`（新建）

- 职责：渲染右侧对话区 —— 消息气泡列表 + 底部输入框。
- 消息气泡样式参考 `features/chats/index.tsx` 第 236-257 行（`chat-box` 圆角气泡，user 靠右 primary 色、assistant 靠左 muted 色）。
- 输入框用 `Textarea`（`components/ui/textarea`）+ 发送 `Button`；发送时禁用按钮，显示「正在输入…」的 `Skeleton`/加载态，`sendChatMessage` resolve 后追加 assistant 消息并滚动到底部。

#### 3.4 `src/features/ai-chat/components/session-list.tsx`（新建）

- 职责：渲染左侧会话列表 —— 「New Chat」按钮 + 会话项列表（标题 + 最后一条消息预览），点击切换会话，支持删除会话（可选，保持简单可只做新建+切换）。
- 样式参考 `features/chats/index.tsx` 第 79-158 行的左栏（sticky 搜索/标题区 + ScrollArea 列表）。

#### 3.5 `src/features/ai-chat/index.tsx`（新建）

页面主组件，仿照 Chats 页的 `Header` + `Main fixed` 布局：

```tsx
export function AiChat() {
  const [sessions, setSessions] = useState<AiSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  // ...
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
          <SessionList ... />
          <ChatInterface ... />
        </section>
      </Main>
    </>
  )
}
```

- 会话状态用 `useState` 本地管理即可（无持久化需求，符合「不过度设计」原则）。
- 发送消息流程：追加 user 消息 → 调 `sendChatMessage(该会话全部消息)` → 追加 assistant 消息。

## 假设与决策（Assumptions & Decisions）

1. **当前不接真实接口**：按用户答复，先做模拟回复；通过 `chat-service.ts` 单一收口，后续接真实 AI 时只需改该文件 + 配置 Vite proxy（vite.config.ts）。
2. **页面风格**：按用户答复复用现有 Chats 的左右分栏风格（左侧会话列表 + 右侧对话区）。
3. **状态管理**：会话数据用 `useState` 本地状态，不做持久化、不引入 zustand 全局 store（项目已装 zustand，但本页无需跨组件共享，避免过度设计）。
4. **路由**：不手动编辑 `routeTree.gen.ts`，由 `@tanstack/router-plugin` 自动生成。
5. **不做测试**：现有 Chats 页也无测试，保持项目现状，不新增测试文件。

## 验证步骤（Verification）

1. 启动开发服务器：`pnpm dev`。
2. 打开侧边栏，确认「General」分组出现「AI Chat」菜单项（Bot 图标）。
3. 点击进入 `/ai-chat`，验证：
   - 左侧可新建/切换会话；右侧显示对话区。
   - 输入消息发送后出现 user 气泡，短暂加载后出现 assistant 模拟回复。
4. 运行 `pnpm lint` 与 `pnpm build`（`tsc -b`），确认无类型/编译错误。
