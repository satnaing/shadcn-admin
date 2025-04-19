import { z } from 'zod'

// 账号状态枚举
export const AccountStatusEnum = z.enum(['1', '0']);
export type AccountStatusEnum = z.infer<typeof AccountStatusEnum>;

export const AccountStatusMap = {
  '1': '正常',
  '0': '异常'
};

// 账号数据模型
export const accountSchema = z.object({
  id: z.number(),
  group: z.object({
    id: z.number(),
    name: z.string()
  }).nullable(),
  uid: z.string().nullable(),
  secUid: z.string().nullable(),
  shortId: z.string().nullable(),
  username: z.string().nullable(),
  nickname: z.string().nullable(),
  avatar: z.string().nullable(),
  following: z.number().default(0),
  followers: z.number().default(0),
  status: z.coerce.number().default(1),
  region: z.string().nullable(),
  deviceId: z.string().nullable(),
  installId: z.string().nullable(),
  sessionId: z.string().nullable(),
  createAt: z.coerce.date(),
  updateAt: z.coerce.date().nullable(),
})
export type Account = z.infer<typeof accountSchema>

// 账号字段名称映射
export const accountFieldMap: Record<keyof Account, string> = {
  id: "ID",
  group: "分组",
  uid: "抖音UID",
  secUid: "安全UID",
  shortId: "短ID",
  username: "用户名",
  nickname: "昵称",
  avatar: "头像",
  following: "关注数",
  followers: "粉丝数",
  status: "状态",
  region: "地区",
  deviceId: "设备ID",
  installId: "安装ID",
  sessionId: "会话ID",
  createAt: "创建时间",
  updateAt: "更新时间",
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
  file: z.instanceof(File),
  groupId: z.number().optional()
})
export type ImportAccountsInput = z.infer<typeof importAccountsSchema> 