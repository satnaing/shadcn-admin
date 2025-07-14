import { useMutation, useQuery } from '@tanstack/react-query'
import { QueryService } from '@/services/query.service'
import { toast } from 'react-toastify'
import { deleteProfile, getAllProfile, linkProfile } from '../api/profile.api'

export enum ProfileQueryEnum {
  GET_ALL_PROFILE = 'get-all-profile',
}

export const useGetAllProfileQuery = () => {
  const { data, isLoading } = useQuery({
    queryKey: [ProfileQueryEnum.GET_ALL_PROFILE],
    queryFn: getAllProfile,
  })
  return { data, isLoading }
}

export const useDeleteProfile = () => {
  const queryClient = QueryService.getQueryClient()
  const { mutate, isLoading } = useMutation({
    mutationFn: deleteProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ProfileQueryEnum.GET_ALL_PROFILE],
      })
    },
    onError: (error: any) => {
      toast(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong while deleting profile',
        {
          type: 'error',
        }
      )
    },
  })

  return { deleteProfile: mutate, isDeletingProfile: isLoading }
}

export const useLinkProfile = () => {
  const queryClient = QueryService.getQueryClient()
  const { mutate, isLoading } = useMutation({
    mutationFn: linkProfile,
    onSuccess: (response) => {
      if (response?.profile) {
        queryClient.invalidateQueries({
          queryKey: [ProfileQueryEnum.GET_ALL_PROFILE],
        })
      }
    },
    onError: (error: any) => {
      toast(error?.message || 'Something went wrong while linking profile', {
        type: 'error',
      })
    },
  })

  return { linkProfile: mutate, isLinkingProfile: isLoading }
}
