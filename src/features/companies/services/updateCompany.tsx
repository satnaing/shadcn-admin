import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { CompanySupabase } from '../data/schema'

export const updateCompany = async (
  company: CompanySupabase
): Promise<CompanySupabase> => {
  const { data, error } = await supabase
    .from('companies')
    .update(company)
    .eq('company_id', company.company_id)
    .select('*')
    .single()

  if (error) {
    console.error('Error updating company:', error)
    throw new Error(error.message)
  }
  return data
}

export const useUpdateCompanyMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const mutation = useMutation({
    mutationFn: updateCompany,
    onSuccess: (data) => {
      console.log('Company updated successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast({
        variant: 'default',
        title: '데이터 업데이트 성공!',
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
