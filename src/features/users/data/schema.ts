import { z } from 'zod'
import { MergeDeep } from 'type-fest'
import { Database, Tables } from '@/utils/supabase/database.types'

type BaseType = Database['public']['Tables']

export type UserSupabase = BaseType['student']['Row']
export type FieldTrainingType = BaseType['field_training']['Row']

export const userSchema = z.object({
  student_id: z.string(),
  name: z.string(),
  join_at: z.string(),
  email: z.string(),
  phone: z.string(),
  user_status: z.string(),
})

export type User = z.infer<typeof userSchema>

type UserKeyType = keyof Omit<User, 'student_id'>

export const userColumnsMetaData: Record<
  UserKeyType,
  { label: string; isRepresentative?: boolean }
> = {
  name: { label: '학생 이름', isRepresentative: true },
  join_at: { label: '학생 기수' },
  email: { label: '학생 이메일' },
  phone: { label: '학생 연락처' },
  user_status: { label: '현재 상태' },
}

export type UserDetailType = MergeDeep<
  Tables<'student'>,
  {
    departments: Tables<'departments'>
    field_training: MergeDeep<
      Tables<'field_training'>,
      {
        companies: Tables<'companies'>
        jobs: Tables<'jobs'>
      }
    >[]
    employment_companies: MergeDeep<
      Tables<'employment_companies'>,
      {
        companies: Tables<'companies'>
        jobs: Tables<'jobs'>
      }
    >[]
    military_services: MergeDeep<
      Tables<'military_services'>,
      {
        military_service_statuses: Pick<
          Tables<'military_service_statuses'>,
          'military_service_status_name'
        >
      }
    >
    profile: {
      profile_skills: {
        skills: Tables<'skills'>
      }[]
      project_permissions: {
        projects: Pick<Tables<'projects'>, 'project_id' | 'project_name'>
      }[]
    }
    student_after_courses: {
      grade: number
      after_courses: Tables<'after_courses'>
    }[]
    student_certificates: {
      certificates: Tables<'certificates'>
    }[]
    student_competitions: {
      prize: string
      competitions: Tables<'competitions'>
    }[]
    student_middle_schools: MergeDeep<
      Tables<'student_middle_schools'>,
      {
        middle_schools: Tables<'middle_schools'>
      }
    >
    student_universities: {
      universities: Tables<'universities'>
    }[]
  }
>

export type UserEditType = {
  action: 'add' | 'update' | 'delete'
  datas: {
    field_training?: BaseType['field_training']['Update'],
    employment_companies?: BaseType['employment_companies']['Update'],
  }
}[]
