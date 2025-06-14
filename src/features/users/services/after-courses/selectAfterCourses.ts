import supabase from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { BaseType } from "@/features/users/data/schema"

export type AfterCoursesType = BaseType['after_courses']['Row'][]


const selectAfterCourses = async (): Promise<AfterCoursesType> => {
  const { data, error } = await supabase
    .from('after_courses')
    .select(`*`)

  if (error) {
    throw new Error('Error')
  }

  return data
}

export const useAfterCourses = () => {
  return useQuery({
    queryKey: ['afterCourses'],
    queryFn: selectAfterCourses,
    staleTime: 240000,
    retry: 2
  })
}