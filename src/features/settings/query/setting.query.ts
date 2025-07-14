import { AxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { createSetting, updateSetting } from '../types/setting.api'
import { ISettingPayload } from '../types/setting.api'

type UserPlan = 'starter' | 'pro' | 'premium'

type SettingPayload = ISettingPayload & {
  userPlan?: UserPlan
}

export const useCreateSettingQuery = () => {
  const router = useRouter()

  const { mutate, isPending } = useMutation<
    unknown,
    AxiosError<{ message?: string }>,
    SettingPayload
  >({
    mutationFn: createSetting,
    onSuccess: () => {
      router.push('/')
    },
    onError: (error) => {
      toast(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong while creating settings',
        { type: 'error' }
      )
    },
  })

  return {
    createSetting: mutate,
    isCreatingSetting: isPending,
  }
}

export const useUpdateSettingQuery = () => {
  const router = useRouter()

  const { mutate, isPending } = useMutation<
    unknown,
    AxiosError<{ message?: string }>,
    SettingPayload
  >({
    mutationFn: updateSetting,
    onSuccess: () => {
      router.push('/')
    },
    onError: (error) => {
      toast(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong while updating settings',
        { type: 'error' }
      )
    },
  })

  return {
    updateSetting: mutate,
    isUpdatingSetting: isPending,
  }
}
