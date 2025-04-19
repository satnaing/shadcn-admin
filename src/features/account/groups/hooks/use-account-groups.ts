import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createAccountGroup,
  deleteAccountGroup,
  updateAccountGroup
} from '@/services/account-groups'
import { CreateAccountGroupInput, UpdateAccountGroupInput } from '../data/schema'

// 查询键
export const ACCOUNT_GROUPS_QUERY_KEY = ['account-groups']

// 获取账号组列表Hook
// export function useAccountGroups(params: GetAccountGroupsParams) {
//   return useQuery({
//     queryKey: ['account-groups', params.page, params.size],
//     queryFn: () => getAccountGroups(params),
//     placeholderData: keepPreviousData,
//   })
// }

// 创建账号组Hook
export function useCreateAccountGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAccountGroupInput) => createAccountGroup(data),
    onSuccess: () => {
      toast.success('账号组创建成功')
      queryClient.invalidateQueries({ queryKey: ACCOUNT_GROUPS_QUERY_KEY })
    },
    onError: (error) => {
      console.error('创建账号组失败:', error)
      toast.error('创建账号组失败')
    },
  })
}

// 更新账号组Hook
export function useUpdateAccountGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateAccountGroupInput) => updateAccountGroup(data),
    onSuccess: () => {
      toast.success('账号组更新成功')
      queryClient.invalidateQueries({ queryKey: ACCOUNT_GROUPS_QUERY_KEY })
    },
    onError: (error) => {
      console.error('更新账号组失败:', error)
      toast.error('更新账号组失败')
    },
  })
}

// 删除账号组Hook
export function useDeleteAccountGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteAccountGroup(id),
    onSuccess: () => {
      toast.success('账号组删除成功')
      queryClient.invalidateQueries({ queryKey: ACCOUNT_GROUPS_QUERY_KEY })
    },
    onError: (error) => {
      console.error('删除账号组失败:', error)
      toast.error('删除账号组失败')
    },
  })
} 