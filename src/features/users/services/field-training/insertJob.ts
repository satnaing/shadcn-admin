import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { toast } from '@/hooks/use-toast'

type JobInsert = {
  job_name: string
}

export const insertJob = async (payload: JobInsert) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([payload])
    .select('*')
    .single()

  if (error) throw error
  return data
}

export function useInsertJobMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: insertJob,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast({
        variant: 'default',
        title: '직무 추가 성공!',
        description: `직무가 성공적으로 추가되었습니다: ${data.job_name}`,
      })
    },
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
  }
}
