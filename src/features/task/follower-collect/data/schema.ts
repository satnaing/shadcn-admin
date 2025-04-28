import { accountGroupSchema } from "@/features/account/groups/data/schema";
import { taskStatusEnum, taskStatusSchema } from "@/types/task-status";
import { z } from "zod";


/**
 * 粉丝采集任务类型
 */
export const collectFollowerTaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  group: accountGroupSchema,
  total: z.number(),
  processed: z.number(),
  totalFans: z.number(),
  status: taskStatusEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.number(),
  modifiedBy: z.number(),
})
export type CollectFollowerTask = z.infer<typeof collectFollowerTaskSchema>;

// 粉丝采集任务字段名称映射
export const collectFollowerTaskFieldMap: Record<keyof CollectFollowerTask, string> = {
  id: "ID",
  name: "任务名称",
  description: "任务描述",
  group: "账号组",
  total: "任务数",
  processed: "完成数",
  totalFans: "采集数",
  status: "任务状态",
  createdAt: "创建时间",
  updatedAt: "更新时间",
  createdBy: "创建者",
  modifiedBy: "修改者",
}

/**
 * 创建粉丝采集任务表单验证
 */
export const createCollectFollowerTaskSchema = z.object({
  name: z.string().min(1, "任务名称不能为空").max(100, "任务名称最多100个字符"),
  description: z.string().max(500, "任务描述最多500个字符").optional(),
  groupId: z.string({ required_error: "请选择账号组" })
});

/**
 * 创建粉丝采集任务表单类型
 */
export type CreateCollectFollowerTaskInput = z.infer<typeof createCollectFollowerTaskSchema>; 