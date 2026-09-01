export type AppType = 'dialogue' | 'workflow'

export type AppCreationMethod = 'planning' | 'orchestration'

export type AppItem = {
  id: string
  name: string
  description: string
  avatar: string
  method: AppCreationMethod
  createdAt: number
}

export const appMethodLabels: Record<AppCreationMethod, string> = {
  planning: '自主规划',
  orchestration: '工作流编排',
}

/** 创建方式 → 应用类型（自主规划产出对话型应用，工作流编排产出工作流型应用） */
export function methodToType(method: AppCreationMethod): AppType {
  return method === 'planning' ? 'dialogue' : 'workflow'
}

export const appTypeLabels: Record<AppType, string> = {
  dialogue: '对话型',
  workflow: '工作流型',
}
