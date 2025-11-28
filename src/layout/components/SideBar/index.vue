<script setup>
import {useRoute} from 'vue-router'
import {useAppStore} from "@/stores/AppSetting";
import {useMenuStore} from "@/stores/Menus.js";
import {adjustColorOpacity} from "@/utils/util.common.js";

const props = defineProps({
  mode: {
    type: String,
    default: 'vertical'
  }
})
const currentRoute = useRoute();
const appStore = useAppStore();
const sideBarStyle = computed(() => {
  return {
    // backgroundColor:appStore.appThemeColor,
  }
})
const filteredRoutes = ref([])
// 初始化菜单
const initSideMenus = async () => {
  const menusStore = useMenuStore()
  filteredRoutes.value = await menusStore.generateMenus()
}

function toggleSideBar() {
  appStore.toggleSidebar();
}


initSideMenus()

</script>

<template>
  <template v-if="mode==='horizontal'">
    <transition enter-active-class="animate__animated animate__fadeInLeft">
    <div class="side-bar-horizontal">
      <div class="side-logo" v-if="!['mixin'].includes(appStore.layoutMode)">
        <transition enter-active-class="animate__animated animate__fadeInLeft">
          <router-link v-if="!appStore.sidebar.opened" class="wh-full flex-center" to="/">
            ZY
          </router-link>
          <router-link v-else class="wh-full flex-center" to="/">
            <span class="logo-title">ZHOUYI</span>
          </router-link>
        </transition>
      </div>
      <div class="bar-left-ex" @click="toggleSideBar" v-if="['mixin'].includes(appStore.layoutMode)">
        <el-icon color="#373839" class="nav-bar-left-icon" :class="{ 'is-active': appStore.sidebar.opened }"
                 title="展开">
          <Expand/>
        </el-icon>
        <el-icon color="#373839" class="nav-bar-left-icon" :class="{ 'is-active': !appStore.sidebar.opened }"
                 title="折叠">
          <Fold/>
        </el-icon>
      </div>
      <el-scrollbar>
        <el-menu
            class="hor-menu"
            :mode="mode"
            ellipsis
            :default-active="currentRoute.path"
            background-color="transparent"
        >
          <MenuItems :routes="filteredRoutes"/>
        </el-menu>
      </el-scrollbar>
    </div>
    </transition>
  </template>
  <template v-else>
    <section class="side-bar" :style="sideBarStyle">
      <div class="side-logo">
        <transition enter-active-class="animate__animated animate__fadeInLeft">
          <router-link v-if="!appStore.sidebar.opened" class="wh-full flex-center" to="/">
            ZY
          </router-link>
          <router-link v-else class="wh-full flex-center" to="/">
            <span class="logo-title">ZHOUYI</span>
          </router-link>
        </transition>
      </div>
      <el-scrollbar class="side-bar-menu">
        <el-menu
            :mode="mode"
            :default-active="currentRoute.path"
            :collapse="!appStore.sidebar.opened"
            :collapse-transition="false"
            background-color="transparent"
        >
          <MenuItems :routes="filteredRoutes"/>
        </el-menu>
      </el-scrollbar>
      <SideBarLeftFooter/>
    </section>
  </template>


</template>

<style scoped lang="scss">
.side-bar {
  width: $sidebar-width;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  background-color: var(--menu-background);
  transition: width .28s;

  .side-logo {
    height: $navbar-height;
    line-height: $navbar-height;
    text-align: center;
    font-weight: bold;
    font-size: 30px;
    font-family: "Courier New";
    color: var(--el-color-primary);
  }

  .side-bar-menu {
    box-sizing: border-box;
    height: calc(100vh - $navbar-height - 172px);
  }

}

.side-bar-horizontal {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: $navbar-height;

  .bar-left-ex {
    margin: 0 10px;

    .nav-bar-left-icon {
      display: block;
      cursor: pointer;

      &:hover {
        transition: all .3s linear;

      }
    }

    .is-active {
      display: none;
    }
  }

  .side-logo {
    height: $navbar-height;
    line-height: $navbar-height;
    text-align: center;
    font-weight: bold;
    font-size: 30px;
    font-family: "Courier New";
    color: var(--el-color-primary);
    margin: 0 15px;
  }

  .hor-menu {
    height: $navbar-height;
    border-bottom: none;
    max-width: 900px;
  }
}

</style>
