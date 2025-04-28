import { accountSchema } from "@/features/account/list/data/schema";
import { collectFollowerTaskSchema } from "@/features/task/follower-collect/data/schema";
import { z } from "zod";

/**
 * 好友列表
 */
export const tiktokFriendSchema = z.object({
  id: z.number(),
  task: collectFollowerTaskSchema,
  account: accountSchema,
  uid: z.string(),
  secUid: z.string(),
  uniqueId: z.string(),
  nickname: z.string(),
  avatar: z.string(),
  signature: z.string(),
  followingCount: z.number(),
  followerCount: z.number(),
  awemeCount: z.number(),
  favoritingCount: z.number(),
  totalFavorited: z.number(),
  region: z.string(),
  language: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type TiktokFriend = z.infer<typeof tiktokFriendSchema>;

// 好友列表字段名称映射
export const friendListFieldMap: Record<keyof TiktokFriend, string> = {
  id: "ID",
  task: "任务",
  account: "账号",
  uid: "UID",
  secUid: "SecUID",
  uniqueId: "用户名",
  nickname: "昵称",
  avatar: "头像",
  signature: "个性签名",
  followingCount: "关注数",
  followerCount: "粉丝数",
  awemeCount: "作品数",
  favoritingCount: "点赞数",
  totalFavorited: "总点赞数",
  region: "地区",
  language: "语言",
  createdAt: "创建时间",
  updatedAt: "更新时间",
}

