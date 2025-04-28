import { BaseCrudService } from "./base-curd-service";
import { CreateCollectFollowerTaskInput, CollectFollowerTask } from "@/features/task/follower-collect/data/schema";
import axios from "@/lib/axios";

/**
 * 粉丝采集任务服务类
 * 继承自基础CRUD服务，提供粉丝采集任务相关的操作
 */
class FollowerCollectService extends BaseCrudService<CollectFollowerTask> {
  constructor() {
    super('task/followerCollect')
  }
  
  /**
   * 创建粉丝采集任务
   * @param form 创建任务的表单数据
   * @returns 创建的任务对象
   */
  async createTask(form: CreateCollectFollowerTaskInput) {
    return await axios.post<CollectFollowerTask>(`${this.path}`, form);
  }
}

export const followerCollectService = new FollowerCollectService() 