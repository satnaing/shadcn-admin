import supabase from "@/utils/supabase/client"
import { useQuery } from "@tanstack/react-query"

const selectJobList = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const useJobListQuery = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: selectJobList,
    staleTime: 240000,
    retry: 2
  })
}