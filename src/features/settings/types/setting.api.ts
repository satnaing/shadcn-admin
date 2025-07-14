import { axiosInstance } from '@/utils/axios.util'

export async function createSetting(
  payload: ISettingPayload & { userPlan?: 'starter' | 'pro' | 'premium' }
) {
  const url = payload?.userPlan ? `/setting/${payload?.userPlan}` : `/setting`
  const { data } = await axiosInstance({
    method: 'POST',
    url,
    data: payload,
  })
  return data
}

export async function updateSetting(
  payload: ISettingPayload & { userPlan?: 'starter' | 'pro' | 'premium' }
) {
  const url = payload?.userPlan
    ? `/setting/${payload?.userPlan}/${payload?.profileId}`
    : `/setting/${payload?.profileId}`

  const { data } = await axiosInstance({
    method: 'PATCH',
    url,
    data: payload,
  })
  return data
}

// interface/setting.interface.ts

export interface ISettingPayload {
  profileId: string
  name: string
  value: string
  // Add any additional fields used in the payload
}

export type UserPlan = 'starter' | 'pro' | 'premium'

export type CreateSettingPayload = Omit<ISettingPayload, 'profileId'> & {
  userPlan?: UserPlan
}

export type UpdateSettingPayload = ISettingPayload & {
  userPlan?: UserPlan
}
