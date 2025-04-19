import { AccountGroup } from '@/features/account/groups/data/schema'
import { BaseCrudService } from './base-curd-service'

/**
 * 账号组服务类
 * 继承自基础分页服务，提供账号组相关的操作
 */
class AccountGroupService extends BaseCrudService<AccountGroup> {
  constructor() {
    super('account/groups')
  }
}

export const accountGroupService = new AccountGroupService()
