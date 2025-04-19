import { AccountGroup, CreateAccountGroupInput, UpdateAccountGroupInput } from '@/features/account/groups/data/schema'
import axios from '@/lib/axios'
import { Page, Pageable } from '@/types/page'
import { ColumnFiltersState } from '@tanstack/react-table'

const API_URL = `${import.meta.env.VITE_API_URL || ''}/account/groups`

// export type GetAccountGroupsParams = {
//   pageNumber: number
//   pageSize: number
//   sort?: string
//   keyword?: string
//   region?: string

//   direction?: string
// }

// 获取所有账号组
export async function getAccountGroups(pageable: Pageable, columnFilters: ColumnFiltersState): Promise<Page<AccountGroup>> {
  const predicate = columnFilters.reduce((acc, filter) => {
    return { ...acc, [filter.id]: filter.value }
  }, {})
  console.log("predicate", predicate);
  const response = await axios.get(API_URL, { params: { ...pageable, ...predicate } })
  return response.data
}

// 根据ID获取单个账号组
export async function getAccountGroupById(id: string): Promise<AccountGroup> {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

// 创建新的账号组
export async function createAccountGroup(
  data: CreateAccountGroupInput
): Promise<AccountGroup> {
  const response = await axios.post(API_URL, data)
  return response.data
}

// 更新已有的账号组
export async function updateAccountGroup(
  data: UpdateAccountGroupInput
): Promise<AccountGroup> {
  const response = await axios.put(`${API_URL}/${data.id}`, data)
  return response.data
}

// 删除账号组
export async function deleteAccountGroup(id: string): Promise<void> {
  await axios.delete(`${API_URL}/${id}`)
} 