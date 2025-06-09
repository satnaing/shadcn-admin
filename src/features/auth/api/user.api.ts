import { axiosInstance } from '@/utils/axios.util'
import { IUser } from '../interface/user.interface'

export async function getUser() {
  const { data } = await axiosInstance({
    method: 'GET',
    url: `/user/me`,
  })
  return data as IUser
}
