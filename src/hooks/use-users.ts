import { useQuery } from '@tanstack/react-query'
import { userAPI } from '@/api/user.api'

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userAPI.getUsers(),
    select: (data) => data.data,
  })
}