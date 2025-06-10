import { z } from 'zod'
import { Database } from '@/utils/supabase/database.types'

type BaseType = Database['student']['Tables']

export type UserSupabase = BaseType['student']['Row']
export type FieldTrainingType = BaseType['field_training']['Row']

export const userSchema = z.object({
  student_id: z.string(),
  name: z.string(),
  join_at: z.string(),
  email: z.string(),
  phone: z.string(),
  user_status: z.string()
})

export type User = z.infer<typeof userSchema>

type UserKeyType = keyof Omit<User, 'student_id'>

export const userColumnsMetaData: Record<
UserKeyType, 
{label: string, isRepresentative?: boolean}> = {
  name: {label: '학생 이름', isRepresentative: true},
  join_at: {label: '학생 기수'},
  email: {label: '학생 이메일'},
  phone: {label: '학생 연락처'},
  user_status: {label: '현재 상태'}
}