import {defineStore} from 'pinia';
import {useRouter} from 'vue-router';
import dbUtils from 'utils/util.strotage.js'
import {authLogin} from "@/api/modules/api.login";
import {ZyNotification} from "utils/util.toast";
import {usersFindOne} from "@/api/modules/api.users.js";
import {rolesFindOne} from "@/api/modules/api.roles.js";
import setting from "@/setting.js";

export const useAuthStore = defineStore('Users', () => {
    let router = useRouter()

    async function logout() {
        // 执行退出登录逻辑，例如清除用户凭证和重置用户状态等
        dbUtils.clear()
        dbUtils.set('appThemeColor', setting.theme.color)
        // 导航到登录页或其他适当的页面
        await router.replace('/login');

    }

    async function login(form) {
        try {
            // const loginInfo = await authLogin(form)
            const loginInfo = {
                data:{
                    "userInfo": {
                        "username": "admin",
                        "nickname": "书中枫叶",
                        "userId": "66724424a9b358ece99a82af",
                        "roleId": "6672431d8e067423d01ca17c",
                        "status": true
                    },
                    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmlja25hbWUiOiLkuabkuK3mnqvlj7YiLCJ1c2VySWQiOiI2NjcyNDQyNGE5YjM1OGVjZTk5YTgyYWYiLCJyb2xlSWQiOiI2NjcyNDMxZDhlMDY3NDIzZDAxY2ExN2MiLCJzdGF0dXMiOnRydWUsImlhdCI6MTcyMzAyMDQyNCwiZXhwIjoxNzIzMjc5NjI0fQ.C58hR3yCm0Y82MSZfjxomusbWGMHjh2tWtvAxSV_yP0"
                }
            }
            dbUtils.clear()
            dbUtils.set('token', loginInfo.data.token)
            dbUtils.set('appThemeColor', setting.theme.color)

            const {userInfo} = loginInfo.data

            // const userData = await usersFindOne({_id: userInfo.userId})
            const userData = {}

            userData.data = {
                "_id": "66724424a9b358ece99a82af",
                "username": "admin",
                "nickname": "书中枫叶",
                "roleId": "6672431d8e067423d01ca17c",
                "status": true,
                "createdAt": "2024-06-19T02:36:20.600Z",
                "updatedAt": "2024-06-19T03:39:21.246Z"
            }

            dbUtils.set('userInfo', {
                ...userData.data
            })
            // const roleData = await rolesFindOne({_id: userInfo.roleId})
            const roleData = {}
            roleData.data = {
                "_id": "6672431d8e067423d01ca17c",
                "roleName": "超级管理员",
                "roleAuth": "SUPER",
                "perms": [
                    "*"
                ],
                "status": true,
                "createdAt": "2024-06-19T02:31:57.708Z",
                "updatedAt": "2024-06-19T02:31:57.708Z"
            }
            await setPerm(roleData.data.perms)
            // 导航到登录页或其他适当的页面
            await router.push({path: '/'});
            return {...userData.data, ...roleData.data}
        } catch (err) {
            console.log(err)
        }
    }

    // 获取用户的角色权限列表数据 并且存储本地
    async function setPerm(value) {
        dbUtils.set('perms', value)
    }

    return {
        logout,
        login,
    };

})
