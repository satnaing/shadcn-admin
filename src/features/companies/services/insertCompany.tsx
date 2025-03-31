import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PostgrestError } from '@supabase/supabase-js'
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
    if (error.code) {
      throw new PostgrestError(error)
    }
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
  })

  return {
    ...mutation,
    isLoading: mutation.isPending,
  }
}
