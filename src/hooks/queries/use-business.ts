import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getBusinessProfile, updateBusinessProfile } from '@/services/admin'
import type { UpdateBusinessProfileRequest } from '@/types/api'

export const businessKeys = {
  all: ['business'] as const,
  profile: () => [...businessKeys.all, 'profile'] as const,
}

export function useBusinessProfile() {
  return useQuery({
    queryKey: businessKeys.profile(),
    queryFn: getBusinessProfile,
  })
}

export function useUpdateBusinessProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateBusinessProfileRequest) =>
      updateBusinessProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.profile() })
    },
  })
}
