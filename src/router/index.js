import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import routes from "./routes";
import { useSearchStore } from "@/stores/SearchPanel.js";
import dbUtils from "utils/util.strotage.js";

NProgress.configure({ showSpinner: false }); // NProgress Configuration


const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
    // 刷新时，滚动条位置还原
    scrollBehavior: () => ({ left: 0, top: 0 }),
});


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


router.beforeEach(async (to, from, next) => {
    const searchStore = useSearchStore()
    searchStore.showSearchPanel(false)
    NProgress.start();
    // 检查是否需要登录
    if (to.meta.requiresAuth) {
        const isLoggedIn = dbUtils.get('token')
        // 检查用户是否已经登录
        if (isLoggedIn) {
            // 已经登录 访问登录页则直接跳到主页
            if (to.name === 'login') {
                NProgress.done();
                return next('/');
            }
            // 已经登录 访问非登录页则需要验证权限
            const permissionList = dbUtils.get('perms');
            // 如果还未找到缓存的权限数组则返回登录页
            if (!permissionList) {
                // 清空所有缓存数据
                dbUtils.clear()
                NProgress.done();
                // 重定向到登录页
                return next({name: 'login'});
            }
            const hasRoles = hasPermission(permissionList, to)
            if (hasRoles) {
                // 有权限直接访问
                return next();
            }
            NProgress.done();
            // 无权限则重定向到401
            return next({name: '401'});
        }
        NProgress.done();
        // 未登录
        // 清空所有缓存数据
        dbUtils.clear()
        // 重定向到登录页
        return next({name: 'login'});
    }
    NProgress.done();
    // 无需登录的页面 直接访问即可
    next();

})
router.afterEach((to, from) => {
    NProgress.done();
    window.document.title = to.meta.title + " | ZHOUYI";
})

export default router
