import { Account, ImportAccountsInput } from "@/features/account/list/data/schema";
import { BaseCrudService } from "./base-curd-service";
import axios from "@/lib/axios";

/**
 * 导入结果接口
 */
export interface ImportResult {
  /**
   * 成功导入的数量
   */
  importCount: number;
  
  /**
   * 导入失败的数量
   */
  errorCount?: number;
  
  /**
   * 错误信息列表
   */
  errors?: string[];
}

/**
 * 刷新账号结果接口
 */
export interface RefreshResult {
  /**
   * 是否成功
   */
  success: boolean;
  
  /**
   * 结果消息
   */
  message: string;
  
  /**
   * 用户名
   */
  username?: string;
  
  /**
   * 昵称
   */
  nickname?: string;
  
  /**
   * 更新时间
   */
  updatedAt?: string;
}

/**
 * 账号组服务类
 * 继承自基础分页服务，提供账号组相关的操作
 */
class AccountService extends BaseCrudService<Account> {
    constructor() {
      super('accounts')
    }
    
    /**
     * 导入账号
     * @param formData 包含文件和可选分组ID的表单数据
     * @returns 导入结果响应
     */
    async importAccounts(formData: ImportAccountsInput) {
      return await axios.post<ImportResult>(`${this.path}/import`, formData);
    }
    
    /**
     * 刷新账号
     * 通过TikTok API获取最新的账号数据并更新
     * 
     * @param id 账号ID
     * @returns 刷新结果
     */
    async refreshAccount(id: string) {
      return await axios.post<RefreshResult>(`${this.path}/${id}/refresh`);
    }
}

export const accountService = new AccountService()

// /**
//  * 账号服务类，处理所有与账号相关的API请求
//  */
// export const accountService = {

//   /**
//    * 获取账号列表
//    * @returns 账号列表数据
//    */
//   getAccounts: async () => {
//     const response = await axios.get(ACCOUNT_URL)
//     return response.data
//   },

//   /**
//    * 获取账号分组列表
//    * @returns 账号分组列表数据
//    */
//   getAccountGroups: async () => {
//     const response = await axios.get(`${ACCOUNT_URL}/groups`)
//     return response.data
//   },

//   /**
//    * 删除单个账号
//    * @param id 账号ID
//    */
//   deleteAccount: async (id: number) => {
//     await axios.delete(`${ACCOUNT_URL}/${id}`)
//   },

//   /**
//    * 批量删除账号
//    * @param accountIds 账号ID列表
//    */
//   batchDeleteAccounts: async (accountIds: number[]) => {
//     await axios.delete(`${ACCOUNT_URL}/batch`, { data: accountIds })
//   },

//   /**
//    * 更新账号分组
//    * @param accountIds 账号ID列表
//    * @param groupId 目标分组ID
//    */
//   updateAccountGroup: async (accountIds: number[], groupId: number) => {
//     await axios.put(`${ACCOUNT_URL}/update-group`, 
//       { accountIds, groupId }, 
//       { params: { groupId } }
//     )
//   },

//   /**
//    * 导入账号
//    * @param file 要导入的文件
//    * @param groupId 可选的分组ID
//    * @returns 导入结果
//    */
//   importAccounts: async (file: File, groupId?: number) => {
//     const formData = new FormData()
//     formData.append('file', file)
    
//     if (groupId) {
//       formData.append('groupId', groupId.toString())
//     }
    
//     const response = await axios.post(`${ACCOUNT_URL}/import`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     })
    
//     return response.data
//   }
// }