import supabase from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

const selectAfterCourses = async () => {
  const { data, error } = await supabase
    .from('after_courses')
    .select('*')

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const useAfterCoursesQuery = () => {
  return useQuery({
    queryKey: ['afterCourses'],
    queryFn: selectAfterCourses,
    staleTime: 240000,
    retry: 2
  })
}