import {defineStore} from 'pinia';
import dbUtils from "@/utils/util.strotage.js";
import routes from "@/router/routes.js";
import {useRoute, useRouter} from "vue-router";
import {useTagsViewStore} from "@/stores/TagsView.js";

/**
 * 检查路由对象是否具有权限
 * @param {Array} perms - 权限列表
 * @param {Object} route - 路由对象
 * @returns {boolean} - 是否具有权限
 */
function hasPermission(perms, route) {
    if (perms.includes('*')) return true
    if (route.meta && route.meta.perms) {
        // 如果路由对象定义了 meta 属性或者定义 meta.perms 属性，那么就根据权限值来判断是否具有权限
        return perms.some(perm => route.meta.perms.includes(perm))
    } else {
        // 如果路由对象没有定义 meta 属性或者没有定义 meta.perms 属性，那么默认认为具有权限，返回 true。
        return true
    }
}
/**
 * 根据权限列表筛选异步路由配置
 * @param {Array} routes - 路由配置表
 * @param {Array} perms - 权限列表
 * @returns {Array} - 筛选后的路由配置
 */
function filterAsyncRouter(routes, perms) {
    const res = []
    routes.forEach(route => {
        // 创建临时变量 tmp  可以在后续的操作中不会修改原始的路由对象。
        const tmp = {...route}
        if (!tmp.meta.hidden && tmp.children) {
            // 先对子路由进行深度筛选，确保子路由也符合权限要求
            tmp.children = filterAsyncRouter(tmp.children, perms)
            if (tmp.children && tmp.children.length > 0) {
                res.push(tmp)
            }
        } else {
            // 对于没有子路由的路由对象，直接进行权限判断
            if (!tmp.meta.hidden && hasPermission(perms, tmp)) {
                res.push(tmp)
            }
        }
    })

    return res
}
// setup
export const useMenuStore = defineStore("menus", () => {
    const currentRoute = useRoute();
    const router = useRouter();
    const TagsViewStore = useTagsViewStore()
    // 菜单列表
    const menuList = ref([]);
    // 生成菜单
    function generateMenus() {
        return new Promise( async (resolve, reject) => {
            const permissionList = dbUtils.get('perms');

            const asyncRoutes = routes[0].children
            if (!permissionList || !permissionList.length) {
                // 清空所有缓存数据
                dbUtils.clear()
                // 重置路由重新登录
                return router.replace('/401')
            }
            menuList.value =  filterAsyncRouter(asyncRoutes, permissionList);
            // 添加当前路由标签
            TagsViewStore.addTag({
                path: currentRoute.path,
                meta: currentRoute.meta,
                name: currentRoute.name,
            })
            resolve(menuList.value)
        });
    }


    return {
        menuList,
        generateMenus,
    };
});

