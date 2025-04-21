import { z } from 'zod'
import { accountGroupSchema } from '../../groups/data/schema';

export const AccountStatus = z.object({
  '0': z.literal('未知'),
  '1': z.literal('正常'),
  '2': z.literal('异常')
});
// 账号状态枚举
export const AccountStatusEnum = AccountStatus.keyof();
export type AccountStatusEnum = z.infer<typeof AccountStatusEnum>;



// 账号数据模型
export const accountSchema = z.object({
  id: z.string(),
  uid: z.string(),
  secUid: z.string(),
  group: accountGroupSchema,
  username: z.string(),
  avatar: z.string().nullable(),
  nickname: z.string().nullable(),
  signature: z.string().nullable(),
  following: z.number().default(0),
  followers: z.number().default(0),
  awemeCount: z.number().default(0),
  status: z.coerce.number().default(1),
  region: z.string().nullable(),
  deviceId: z.string().nullable(),
  installId: z.string().nullable(),
  sessionId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
})
export type Account = z.infer<typeof accountSchema>

// 账号字段名称映射
export const accountFieldMap: Record<keyof Account, string> = {
  id: "ID",
  group: "分组",
  uid: "抖音UID",
  secUid: "安全UID",
  username: "用户名",
  nickname: "昵称",
  signature: "签名",
  avatar: "头像",
  following: "关注数",
  followers: "粉丝数",
  awemeCount: "作品数",
  status: "状态",
  region: "地区",
  deviceId: "设备ID",
  installId: "安装ID",
  sessionId: "会话ID",
  createdAt: "创建时间",
  updatedAt: "更新时间",
}

// 账号列表模型
export const accountListSchema = z.array(accountSchema)

// 更新账号分组请求数据模型
export const updateAccountGroupSchema = z.object({
  accountIds: z.array(z.number()),
  groupId: z.number()
})
export type UpdateAccountGroupInput = z.infer<typeof updateAccountGroupSchema>

// 导入账号请求数据模型
export const importAccountsSchema = z.object({
  jsonl: z.string(),
  groupId: z.string()
})
export type ImportAccountsInput = z.infer<typeof importAccountsSchema> 