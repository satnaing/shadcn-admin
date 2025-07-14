import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createSetting, updateSetting } from '../api/setting.api'

export const useCreateSettingQuery = ({ history }: { history: any }) => {
  const { mutate, isLoading } = useMutation(createSetting, {
    onSuccess: () => {
      history.push(`/`)
    },
    onError: (error: any) => {
      toast(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong while creating leads',
        {
          type: 'error',
        }
      )
    },
  })

  return { createSetting: mutate, isCreatingSetting: isLoading }
}

export const useUpdateSettingQuery = ({ history }: { history: any }) => {
  const { mutate, isLoading } = useMutation(updateSetting, {
    onSuccess: () => {
      history.push(`/`)
    },
    onError: (error: any) => {
      toast(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong while creating leads',
        {
          type: 'error',
        }
      )
    },
  })

  return { updateSetting: mutate, isUpdatingSetting: isLoading }
}
