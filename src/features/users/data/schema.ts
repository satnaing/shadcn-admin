import { z } from 'zod'
import { Database } from '@/utils/supabase/database.types'

export type BaseType = Database['public']['Tables']

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

export interface UserDetailType {
  student_id: string,
  name: string
  departments: BaseType['departments']['Row'],
  field_training: (BaseType['field_training']['Row'] & {
    companies: BaseType['companies']['Row'],
    jobs: BaseType['jobs']['Row']
  })[],
  military_services: BaseType['military_services']['Row'] & {
    military_service_statuses: Pick<BaseType['military_service_statuses']['Row'], 'military_service_status_name'>
  },
  profile: {
    profile_skills: {
      skills: BaseType['skills']['Row']
    }[],
    project_permissions: {
      projects: Pick<BaseType['projects']['Row'], 'project_id' | 'project_name'>
    }[]
  },
  student_after_courses: {
    grade: number,
    after_courses: BaseType['after_courses']['Row']
  }[],
  student_certificates: {
    certificates: BaseType['certificates']['Row']
  }[],
  student_competitions: {
    prize: string,
    competitions: BaseType['competitions']['Row']
  }[],
  student_middle_schools: BaseType['student_middle_schools']['Row'] & {
    middle_schools: BaseType['middle_schools']['Row']
  },
  student_universities: {
    universities: BaseType['universities']['Row']
  }[]
}

export type UserEditType = {
  editData: {
    action: 'update' | 'delete',
    data: {
      [Type in keyof Omit<UserDetailType, 'student_id' | 'name' | 'departments'>]?: UserDetailType[Type] | null
    }
  }[]
}

