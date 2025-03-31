import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { CompanySupabase } from '../data/schema'

export const insertCompany = async (newCompany: {
  newCompany: Pick<CompanySupabase, 'company_name'>
}): Promise<CompanySupabase> => {
  const { data, error } = await supabase
    .schema('enum')
    .from('companies')
    .insert([newCompany.newCompany])
    .select('*')
    .single()
  if (error) {
    throw error
  }
  return data
}

export const useInsertCompanyMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const mutation = useMutation({
    mutationFn: insertCompany,
    onSuccess: (data) => {
      console.log('Company inserted successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast({
        variant: 'default',
        title: '데이터 삽입 성공!',
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    },
    onError: (error) => {
      console.error('Error inserting company:', error)

      let errorMessage = '알 수 없는 오류가 발생했습니다.'
      if (error.message) {
        errorMessage = error.message
      }

      toast({
        variant: 'destructive',
        title: '데이터 삽입 실패!',
        description: (
          <pre className='mt-2 w-[340px] max-w-full overflow-x-auto rounded-md bg-slate-950 p-4'>
            <code className='whitespace-pre-wrap text-white'>
              {errorMessage}
            </code>
          </pre>
        ),
      })
    },
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
  }
}
