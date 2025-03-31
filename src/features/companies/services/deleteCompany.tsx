import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/utils/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { CompanySupabase } from '../data/schema'

export const deleteCompany = async (
  company_id: Pick<CompanySupabase, 'company_id'>
): Promise<CompanySupabase> => {
  const { data ,error } = await supabase
    .schema('enum')
    .from('companies')
    .delete()
    .eq('company_id', company_id.company_id)
    .select('*')
    .single();

  if (error) {
    console.error('Error deleting company:', error)
    throw new Error(error.message)
  }
  return data; 
}

export const useDeleteCompanyMutation = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const mutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: (data) => {
      console.log('Company deleted successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast({
        variant: 'default',
        title: '데이터 삭제 성공!',
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
