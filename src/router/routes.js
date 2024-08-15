export const Layout = () => import("@/layout/index.vue");
/**
 * @Description: 路由项说明
 * @Author: ZHOU YI
 * @Date: 2024-08-15 09:39
 *
 *  {
 *     path: "/components",          // 路由地址
 *     name: "components",           // 路由名称
 *     meta: {
 *         title: "组件示例",          // 路由标题
 *         icon: "Basketball",       // 路由图标
 *         requiresAuth: true,       // 是否需要登录
 *         cache: true,              // 是否缓存
 *         isLink: false,            // 是否外链
 *         hidden: false,            // 是否隐藏
 *         url: 'www.baidu.com',     // 内嵌地址 需要指定在 frame 组件配置
 *         perms: [                  // 权限控制
 *             "/components"         // 权限标识
 *         ],
 *     },
 *     children: []                  // 子路由
 * }
 */


// 静态路由
const constantRoutes = [
    {
        path: "/",
        name: "Layout",
        component: Layout,
        redirect: "/dashboard",
        children: [
            {
                path: "/dashboard",
                component: () => import("@/views/dashboard/index.vue"),
                name: "dashboard",
                meta: {
                    title: "工作台",
                    icon: "HomeFilled",
                    requiresAuth: true,
                    cache: true,
                    perms: [
                        "/index"
                    ],
                },
            },
            {
                path: "/components",
                name: "components",
                meta: {
                    title: "组件示例",
                    icon: "Basketball",
                    requiresAuth: true,
                    cache: true,
                    perms: [
                        "/components"
                    ],
                },
                children: [
                    // {
                    //     path: "/page",
                    //     component: () => import("@/views/components/page/dir-page.vue"),
                    //     name: "page",
                    //     meta: {
                    //         title: "完整页面",
                    //         requiresAuth: true,
                    //         cache: true,
                    //         perms: [],
                    //     },
                    // },
                    {
                        path: "/common",
                        component: () => import("@/views/components/common/index.vue"),
                        name: "common",
                        meta: {
                            title: "公共组件",
                            requiresAuth: true,
                            cache: true,
                            perms: [],
                        },
                    },
                    {
                        path: "/echarts",
                        name: "echarts",
                        meta: {
                            title: "Echarts",
                            requiresAuth: true,
                            cache: true,
                            perms: [],
                        },
                        children: [
                            {
                                path: "/realTime",
                                component: () => import("@/views/components/echarts/realTime.vue"),
                                name: "realTime",
                                meta: {
                                    title: "实时数据",
                                    requiresAuth: true,
                                    cache: true,
                                    perms: [],
                                },
                            },
                            {
                                path: "/china",
                                component: () => import("@/views/components/echarts/china.vue"),
                                name: "china",
                                meta: {
                                    title: "China",
                                    requiresAuth: true,
                                    cache: true,
                                    perms: [],
                                },
                            },
                            {
                                path: "/world",
                                component: () => import("@/views/components/echarts/world.vue"),
                                name: "world",
                                meta: {
                                    title: "World",
                                    requiresAuth: true,
                                    cache: true,
                                    perms: [],
                                },
                            },
                        ]
                    }

                ]
            },
            {
                path: "/sys",
                name: "sys",
                redirect: "/users",
                meta: {
                    title: "系统管理",
                    icon: "",

                    requiresAuth: true,
                    cache: true,
                    perms: [
                        "/sys"
                    ],

                },
                children: [
                    {
                        path: "/users",
                        component: () => import("@/views/sys/users/dir-users.vue"),
                        name: "users",
                        meta: {
                            title: "管理员管理",
                            icon: "User",
                            requiresAuth: true,
                            cache: true,
                            perms: [
                                "/sys/users/list",
                                "/sys/users/create",
                                "/sys/users/delete",
                                "/sys/users/update",
                            ],
                        },
                    },
                    {
                        path: "/roles",
                        component: () => import("@/views/sys/roles/dir-roles.vue"),
                        name: "roles",
                        meta: {
                            title: "角色管理",
                            icon: "",
                            requiresAuth: true,
                            cache: true,
                            perms: [
                                "/sys/roles/list",
                                "/sys/roles/create",
                                "/sys/roles/delete",
                                "/sys/roles/update",
                            ],
                        },

                    },
                    {
                        path: "/permissions",
                        component: () => import("@/views/sys/permissions/dir-permissions.vue"),
                        name: "permissions",
                        meta: {
                            title: "权限管理",
                            icon: "",
                            requiresAuth: true,
                            cache: true,
                            perms: [
                                "/sys/permissions/list",
                                "/sys/permissions/create",
                                "/sys/permissions/delete",
                                "/sys/permissions/update",
                            ],
                        },

                    },
                    {
                        path: "/logs",
                        name: "logs",
                        meta: {
                            title: "日志管理",
                            icon: "",
                            requiresAuth: true,
                            cache: true,
                            perms: [
                                "/sys/logs",
                            ],
                        },
                        children: [
                            {
                                path: "/logs/login",
                                component: () => import("@/views/sys/logs/login/dir-login-logs.vue"),
                                name: "logs-login",
                                meta: {
                                    title: "登录日志",
                                    icon: "",
                                    requiresAuth: true,
                                    cache: true,
                                    perms: [
                                        "/sys/logs/list",
                                        "/sys/logs/create",
                                        "/sys/logs/delete",
                                        "/sys/logs/update",
                                    ],
                                },
                            },
                            {
                                path: "/logs/opt",
                                component: () => import("@/views/sys/logs/opt/dir-opt-logs.vue"),
                                name: "logs-opt",
                                meta: {
                                    title: "操作日志",
                                    icon: "",
                                    requiresAuth: true,
                                    cache: true,
                                    perms: [
                                        "/sys/logs/list",
                                        "/sys/logs/create",
                                        "/sys/logs/delete",
                                        "/sys/logs/update",
                                    ],
                                },
                            }
                        ]

                    },
                ]
            },
            // {
            //     path: "/frame",
            //     name: 'frame',
            //     meta: {
            //         title: '文档教程（准备中）',
            //         icon: "Link",
            //         url: 'https://gitee.com/Z568_568/ZHOUYI-ADMIN.git'
            //     },
            //     component: () => import("@/views/sys/frame/index.vue"),
            // },
            {
                path: "https://gitee.com/Z568_568/ZHOUYI-ADMIN",
                name: 'link',
                meta: {
                    icon: "Link",
                    title: '文档教程（准备中）',
                    isLink: true
                },
            },
            {
                path: "https://gitee.com/Z568_568",
                name: 'link',
                meta: {
                    icon: "Link",
                    title: '关于作者',
                    isLink: true
                },
            },
            {
                path: "https://element-plus.org/zh-CN/component/icon.html",
                name: 'link',
                meta: {
                    icon: "Link",
                    title: 'Element-Plus',
                    isLink: true
                },
            },
            {
                path: "/401",
                name: '401',
                component: () => import("@/views/sys/error-page/401.vue"),
                meta: {hidden: true},
            },
        ]
    },
    {
        path: "/login",
        component: () => import("@/views/login/index.vue"),
        name: "login",
        meta: {
            title: "登录",
            cache: true,
        },
    },
    // 重定向页面 必须保留
    {
        path: "/redirect",
        component: Layout,
        meta: {
            hidden: true
        },
        children: [
            {
                path: ":path(.*)",
                component: () => import("@/views/sys/redirect/index.vue")
            }
        ]
    },

    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/sys/error-page/404.vue'),
        meta: {
            title: '404',
            hidden: true
        },
    }

]

// 重新组织后导出
export default [
    ...constantRoutes
]
