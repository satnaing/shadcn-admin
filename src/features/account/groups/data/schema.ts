import { z } from 'zod'

// 账号组地区选项(国家)
export const AccountGroupRegions = z.object({
  CN: z.literal("中国"),
  US: z.literal("美国"),
  SG: z.literal("新加坡"),
  MY: z.literal("马来西亚"),
  ID: z.literal("印度尼西亚"),
  TH: z.literal("泰国"),
  VN: z.literal("越南"),
  PH: z.literal("菲律宾"),
  IN: z.literal("印度")
});
export const AccountGroupRegionEnum = AccountGroupRegions.keyof();
export type AccountGroupRegionEnum = typeof AccountGroupRegionEnum;

// 账号组数据模型
export const accountGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: AccountGroupRegionEnum,
  description: z.string(),
  accountCount: z.number(),
  totalFollowing: z.number(),
  totalFollowers: z.number(),
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