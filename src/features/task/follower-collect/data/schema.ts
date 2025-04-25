import { AccountGroup, accountGroupSchema } from "@/features/account/groups/data/schema";
import { z } from "zod";

/**
 * 任务状态枚举
 */
export enum TaskStatus {
  /**
   * 创建
   */
  CREATED = "CREATED",

  /**
   * 初始化中
   */
  INITIALIZING = "INITIALIZING",

  /**
   * 初始化完成
   */
  INITIALIZED = "INITIALIZED",

  /**
   * 处理中
   */
  PROCESSING = "PROCESSING",

  /**
   * 完成
   */
  COMPLETED = "COMPLETED",

  /**
   * 失败
   */
  FAILED = "FAILED",

  /**
   * 停止
   */
  STOPPED = "STOPPED",

  /**
   * 暂停
   */
  PAUSED = "PAUSED",

  /**
   * 恢复
   */
  RESUMED = "RESUMED",
}
export const TaskStatusEnum = z.nativeEnum(TaskStatus);
export type TaskStatusEnum = z.infer<typeof TaskStatusEnum>;

/**
 * 粉丝采集任务类型
 */
export const followerCollectTaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  group: accountGroupSchema,
  total: z.number(),
  processed: z.number(),
  status: TaskStatusEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.number(),
  modifiedBy: z.number(),
})
export type FollowerCollectTask = z.infer<typeof followerCollectTaskSchema>;

// 粉丝采集任务字段名称映射
export const followerCollectTaskFieldMap: Record<keyof FollowerCollectTask, string> = {
  id: "ID",
  name: "任务名称",
  description: "任务描述",
  group: "账号组",
  total: "总粉丝数",
  processed: "已处理粉丝数",
  status: "任务状态",
  createdAt: "创建时间",
  updatedAt: "更新时间",
  createdBy: "创建者",
  modifiedBy: "修改者",
}

/**
 * 创建粉丝采集任务表单验证
 */
export const createFollowerCollectTaskSchema = z.object({
  name: z.string().min(1, "任务名称不能为空").max(100, "任务名称最多100个字符"),
  description: z.string().max(500, "任务描述最多500个字符").optional(),
  groupId: z.string({ required_error: "请选择账号组" })
});

/**
 * 创建粉丝采集任务表单类型
 */
export type CreateFollowerCollectTaskInput = z.infer<typeof createFollowerCollectTaskSchema>; 