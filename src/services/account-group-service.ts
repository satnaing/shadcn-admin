import { AccountGroup } from '@/features/account/groups/data/schema'
import { BaseCrudService } from './base-curd-service'
import axios from '@/lib/axios'
import { Option } from '@/types/options'

/**
 * 账号组服务类
 * 继承自基础分页服务，提供账号组相关的操作
 */
class AccountGroupService extends BaseCrudService<AccountGroup> {
  constructor() {
    super('account/groups')
  }
  
  /**
   * 获取分组选项，用于下拉选择
   * @param query 搜索关键词（可选）
   * @param limit 限制返回数量（默认10）
   * @returns 分组选项列表
   */
  async getOptions(query?: string, limit: number = 10): Promise<Option[]> {
    const params = new URLSearchParams()
    if (query) {
      params.append('query', query)
    }
    params.append('limit', limit.toString())
    
    const response = await axios.get<Option[]>(`${this.path}/options`, { params })
    return response.data
  }
}

export const accountGroupService = new AccountGroupService()
