import { axiosInstance } from '@/utils/axios.util'
import { ILinkProfilePayload, IProfile } from '../interface/profile.interface'

export async function getAllProfile() {
  const { data } = await axiosInstance({
    method: 'GET',
    url: `/profile`,
  })
  return data as IProfile[]
}

export async function deleteProfile(profileId: string) {
  const { data } = await axiosInstance({
    method: 'DELETE',
    url: `/profile/${profileId}`,
  })
  return data as { deleted: number }
}

export async function linkProfile(payload: ILinkProfilePayload) {
  const { data } = await axiosInstance({
    method: 'POST',
    url: `/profile/link`,
    data: payload,
  })
  return data as { profile: IProfile; isExisting: boolean }
}
