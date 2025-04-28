import { z } from "zod";

/**
 * 任务状态枚举
 */
export const taskStatusSchema = z.object({
  CREATED: z.literal('创建'),
  INITIALIZING: z.literal('初始化中'),
  INITIALIZED: z.literal('初始化完成'),
  PROCESSING: z.literal('处理中'),
  COMPLETED: z.literal('完成'),
  FAILED: z.literal('失败'),
  STOPPED: z.literal('停止'),
  PAUSED: z.literal('暂停'),
  RESUMED: z.literal('恢复'),
})
export const taskStatusEnum = taskStatusSchema.keyof();
export type TaskStatusEnum = z.infer<typeof taskStatusEnum>;
