import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PostgrestError } from '@supabase/supabase-js'
import supabase from '@/utils/supabase/client'
import { toast } from '@/hooks/use-toast'

type JobInsert = {
  job_name: string
}
interface DatabaseError {
  code?: string
  message?: string
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
    onError: (error: PostgrestError | unknown) => {
      const isDbError = (err: unknown): err is DatabaseError => {
        return (
          typeof err === 'object' &&
          err !== null &&
          ('code' in err || 'message' in err)
        )
      }

      if (isDbError(error)) {
        if (
          error.code === '23505' ||
          (error.message &&
            (error.message.includes('unique constraint') ||
              error.message.includes('duplicate key value')))
        ) {
          toast({
            variant: 'destructive',
            title: '직무 추가 실패',
            description: `이미 존재하는 직무명입니다.`,
          })
          return
        }
      }
      toast({
        variant: 'destructive',
        title: '직무 추가 실패',
        description: '직무를 추가하는 중 오류가 발생했습니다.',
      })
    },
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
  }
}
