import {defineStore} from 'pinia';
import dbUtils from 'utils/util.strotage.js'
import Color from "color";
import setting from "@/setting.js";
export const useAppStore = defineStore("AppSetting", () => {
    // state
    const sidebarStatus = ref('closed');
    // 系统布局模式： slide | mixin | top
    const layoutMode = ref(dbUtils.get('layoutMode') || 'slide');
    const watermarking = ref(dbUtils.get('watermarking') || false);

    // 侧边栏状态
    const sidebar = reactive({
        opened: sidebarStatus.value === 'closed',
    });

    // 主题颜色
    const appThemeColor = ref(dbUtils.get('appThemeColor') || setting.theme.color);
    // 暗黑主题 // true 明亮 false 暗黑
    const appThemeDark = ref(dbUtils.get('appThemeDark') === null ? true : dbUtils.get('appThemeDark') === 'light');

    const initThemeDark = () => {
        if (!appThemeDark.value) {
            dbUtils.set('appThemeDark', 'dark')
            document.documentElement.classList.add("dark");
        } else {
            dbUtils.set('appThemeDark', 'light')
            document.documentElement.classList.remove("dark");
        }
    }

    const initThemeColor = () => {
        let newThemeColor = appThemeColor.value
        const rootStyle = document.documentElement.style;
        rootStyle.setProperty(`--el-color-primary`, newThemeColor);
        rootStyle.setProperty(`--el-color-primary-dark-2`, newThemeColor);
        for (let i = 1; i < 10; i++) {
            rootStyle.setProperty(
                `--el-color-primary-light-${i}`,
                `${Color(newThemeColor).alpha(1 - i * 0.1)}`
            );
        }
    }

    // actions
    const toggleThemeColor = (color) => {
        dbUtils.set('appThemeColor', color)
        appThemeColor.value = color
        let newThemeColor = color
        const rootStyle = document.documentElement.style;
        rootStyle.setProperty(`--el-color-primary`, newThemeColor);
        rootStyle.setProperty(`--el-color-primary-dark-2`, newThemeColor);

        for (let i = 1; i < 10; i++) {
            rootStyle.setProperty(
                `--el-color-primary-light-${i}`,
                `${Color(newThemeColor).alpha(1 - i * 0.1)}`
            );
        }
    }


    const toggleThemeDark = (type) => {
        if (!type) {
            dbUtils.set('appThemeDark', 'dark')
            appThemeDark.value = false
            document.documentElement.classList.add("dark");
            const rootStyle = document.documentElement.style;
            rootStyle.setProperty(`--el-menu-text-color`, '#dedede');
        } else {
            dbUtils.set('appThemeDark', 'light')
            appThemeDark.value = true
            document.documentElement.classList.remove("dark");
            const rootStyle = document.documentElement.style;
            rootStyle.setProperty(`--el-menu-text-color`, '#606060');
        }
    }
    // 水印控制
    const changeWatermarking = () => {
        watermarking.value = !watermarking.value;
        dbUtils.set('watermarking', watermarking.value)
    }

    function toggleSidebar() {
        sidebar.opened = !sidebar.opened;
        sidebarStatus.value = sidebar.opened
            ? "opened"
            : "closed";
    }

    function closeSideBar() {
        sidebar.opened = false;
        sidebarStatus.value = "closed";
    }

    function openSideBar() {
        sidebar.opened = true;
        sidebarStatus.value = "opened";
    }

    initThemeDark()
    initThemeColor()
    return {
        sidebar,
        layoutMode,
        watermarking,
        changeWatermarking,
        toggleSidebar,
        initThemeColor,
        closeSideBar,
        openSideBar,
        appThemeColor,
        toggleThemeColor,
        appThemeDark,
        toggleThemeDark
    };
});


