import { Account } from "@/features/account/list/data/schema";
import { BaseCrudService } from "./base-curd-service";

/**
 * 账号组服务类
 * 继承自基础分页服务，提供账号组相关的操作
 */
class AccountService extends BaseCrudService<Account> {
    constructor() {
      super('accounts')
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