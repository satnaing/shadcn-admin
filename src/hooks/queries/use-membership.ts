import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getMembershipProgram,
  updateMembershipProgram,
} from '@/services/membership'

export const useMembershipProgram = () => {
  return useQuery({
    queryKey: ['membership-program'],
    queryFn: getMembershipProgram,
  })
}

export const useUpdateMembershipProgram = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMembershipProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-program'] })
    },
  })
}
