import dbUtils from "utils/util.strotage";

/**
 *@author ZY
 *@date 2023/6/28 22:36
 *@Description:权限验证自定义指令
 * 使用: v-permission='sys'
 */
const permissionDirective = {
    mounted(el, binding) {
        // 从 binding.value 中获取所需的权限信息
        const permission = binding.value  // 'sys'
        if (!permission.length) return // 空值则不校验
        // 这里可以根据你的权限逻辑进行验证
        // 以下只是一个示例，你需要根据你的实际需求进行修改
        const hasPermission = checkPermission(permission)

        if (!hasPermission) {
            // 如果没有权限，从 DOM 中移除元素
            el.parentNode.removeChild(el)
        }
    }
}

// 进行权限验证的函数
function checkPermission(permission) {
    // 在这里实现你的权限验证逻辑
    // 这里只是一个示例，你需要根据你的实际需求进行修改  先去获取用户的所有权限再进行验证
    const permissionList = dbUtils.get('perms');
    if (permissionList.includes('*')) return true
    return permissionList.includes(permission)
}

export default permissionDirective
