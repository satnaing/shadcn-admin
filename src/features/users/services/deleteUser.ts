import supabase from "@/utils/supabase/client"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { UserSupabase } from "../data/schema"

const deleteUser = async (student_id: Pick<UserSupabase, 'student_id'>) => {
  const { data, error } = await supabase
    .from('student')
    .delete()
    .eq('student_id', student_id.student_id)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}