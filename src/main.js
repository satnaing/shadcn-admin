import {createApp} from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from './router'
import "animate.css";
import Directives from './directives/index'
import setting from "@/setting.js";
import utilLog from "@/utils/util.log.js";

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// 使用全局自定义指令
app.use(Directives);
app.use(router)
app.use(createPinia())
app.use(ElementPlus, {size: setting.theme.size})

utilLog.capsule('ZYAdmin', `欢迎使用${setting.websiteInfo.name}，当前版本:${setting.websiteInfo.version}`)
utilLog.capsule('作者主页', 'https://gitee.com/Z568_568', 'success')
// utilLog.admin()


app.mount('#app')
