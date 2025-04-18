import { z } from 'zod'

// 账号组地区选项(国家)
export const AccountGroupRegions = z.object({
  China: z.literal("中国"),
  America: z.literal("美国"),
  Singapore: z.literal("新加坡"),
  Malaysia: z.literal("马来西亚"),
  Indonesia: z.literal("印度尼西亚"),
  Thailand: z.literal("泰国"),
  Vietnam: z.literal("越南"),
  Philippines: z.literal("菲律宾"),
  India: z.literal("印度"),
  Other: z.literal("其他"),
});
export const AccountGroupRegionEnum = AccountGroupRegions.keyof();
export type AccountGroupRegionEnum = typeof AccountGroupRegionEnum;

// 定义账号组状态枚举
export const accountGroupStatusSchema = z.union([
  z.literal('active'),   // 活跃
  z.literal('inactive'), // 禁用
])

export type AccountGroupStatus = z.infer<typeof accountGroupStatusSchema>

// 账号组权限级别枚举
const accountGroupPermissionLevelSchema = z.union([
  z.literal('admin'),     // 管理员
  z.literal('moderator'), // 协管员
  z.literal('user'),      // 普通用户
  z.literal('guest'),     // 访客
])
export type AccountGroupPermissionLevel = z.infer<typeof accountGroupPermissionLevelSchema>

// 账号组数据模型
export const accountGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: AccountGroupRegionEnum,
  description: z.string(),
  accountCount: z.number(),
  totalFollowing: z.number(),
  totalFollowers: z.number(),
  status: accountGroupStatusSchema,
  permissionLevel: accountGroupPermissionLevelSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type AccountGroup = z.infer<typeof accountGroupSchema>

// 账号组字段名称映射
export const accountGroupFieldMap: Record<keyof AccountGroup, string> = {
  id: "ID",
  name: "名称",
  region: "地区",
  description: "描述",
  accountCount: "账号数量",
  totalFollowing: "关注总数",
  totalFollowers: "粉丝总数",
  status: "状态",
  permissionLevel: "权限级别",
  createdAt: "创建时间",
  updatedAt: "更新时间",
}

// 账号组列表模型
export const accountGroupListSchema = z.array(accountGroupSchema)

// 创建账号组请求数据模型
export const createAccountGroupSchema = z.object({
  name: z.string().min(2, "名称至少需要2个字符"),
  description: z.string(),
  region: AccountGroupRegionEnum,
})
export type CreateAccountGroupInput = z.infer<typeof createAccountGroupSchema>

// 更新账号组请求数据模型
export const updateAccountGroupSchema = createAccountGroupSchema.extend({
  id: z.string(),
})
export type UpdateAccountGroupInput = z.infer<typeof updateAccountGroupSchema> 