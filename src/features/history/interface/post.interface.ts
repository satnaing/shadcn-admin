import { IProfile } from '@/features/linkedin-profile/interface/profile.interface'
import { CommentStatusEnum } from '../enum/comment.enum'

export interface IPost {
  authorName: string
  authorProfileUrl: string
  authorProfileUrn: string
  content: string
  activityUrn: string
  comment?: IPostComment
  profileId: string
  createdAt: Date
  profile?: IProfile
  _id: string
}

export interface IPostComment {
  content: string
  entityUrn: string
  scheduledAt: Date
  postedAt: Date
  status: CommentStatusEnum
}
