import { BaseCrudService } from "./base-curd-service";
import { TiktokFriend } from "@/features/tiktok/friend/schema";

class TiktokFriendService extends BaseCrudService<TiktokFriend> {
  constructor() {
    super('tiktok/friend')
  }
}

export default new TiktokFriendService();