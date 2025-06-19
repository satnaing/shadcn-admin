import { useQuery } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { Student } from '../data/schema'

type DashboardStudentTableData = {
  student_id: string
  graduate_at: string
  department_name: string
  name: string
  gender: boolean
  phone: string
  email: string
  job_name: string | null
  company_name: string | null
}

export const selectStudentList = async (): Promise<Student[]> => {
  const { data, error } = await supabase.rpc('get_dashboard_student_table_data')

  if (error) {
    console.error('Error fetching students:', error)
    throw new Error(error.message)
  }

  console.log('Fetched data:', data)

  const mappedData = (data as DashboardStudentTableData[]).map((item) => ({
    student_id: item.student_id,
    graduate_at: item.graduate_at,
    department_name: item.department_name,
    name: item.name,
    gender: item.gender ? '남' : '여',
    phone: item.phone,
    email: item.email,
    job_name: item.job_name,
    company_name: item.company_name,
  }))

  console.log('Mapped data:', mappedData)

  return mappedData
}

export const useStudentListQuery = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: selectStudentList,
    staleTime: 60000,
    retry: 2,
  })
}
