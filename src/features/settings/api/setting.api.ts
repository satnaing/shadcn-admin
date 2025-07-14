import { axiosInstance } from '@/utils/axios.util'
import { ISettingPayload } from '../interface/setting.interface'

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
