import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'  // 不要手动导入 vue的相关函数
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        AutoImport({
            imports: ["vue"],
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver(
                {
                    // 自动使用预处理样式
                    importStyle: "sass",
                }
            )],
            // 指定自定义组件位置(默认:src/components)
            dirs: ["src/components", "src/**/components"],
        }),

    ],
    server: {
        //本地服务器主机名 配置后可以使用本地网络访问
        host: '0.0.0.0',
        //指定启动端口号
        port: 5000,
        //设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
        strictPort: false,
        //服务器启动时自动在浏览器中打开应用程序,当此值为字符串时，会被用作 URL 的路径名
        open: false,
        proxy: {
            '/v1': {
                target: 'http://localhost:3099',
                changeOrigin: true,
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            "store": fileURLToPath(new URL('src/store', import.meta.url)),
            "utils": fileURLToPath(new URL('src/utils', import.meta.url)),
            "libs": fileURLToPath(new URL('src/libs', import.meta.url)),
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                javascriptEnabled: true,
                additionalData: `@use "@/assets/styles/main.scss" as *;`,
            },
        },
    },
})
