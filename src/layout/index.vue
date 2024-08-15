<template>
  <section class="main-layout" :class="collapseObj">
    <!--    侧边栏-->
    <SideBar v-if="['slide','mixin'].includes(appStore.layoutMode)"/>
    <section class="main-container" :style="layoutStyle">
      <section class="main-top" :class="{ 'fixed-header': true }">
        <NavBar/>
        <TagView/>
      </section>
      <AppMain/>
    </section>
  </section>
</template>

<script setup>
import {useAppStore} from "@/stores/AppSetting";
const appStore = useAppStore();
const layoutStyle = computed(() => {
  if (['top'].includes(appStore.layoutMode)){
    return {
      'margin-left': '0px'
    }
  }

})
const collapseObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened
}));

</script>

<style lang="scss" scoped>
.main-layout {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .main-container {
    box-sizing: border-box;
    margin-left: $sidebar-width;
    transition: margin-left 0.28s;
    background-color: var(--main-background);

    .main-top {
      background-color: var(--menu-background);
    }

    .fixed-header {
      position: sticky;
      top: 0;
      z-index: 9;
      transition: width .28s;
    }
  }
}

// 折叠侧边栏
.hideSidebar {
  .side-bar {
    width: $sidebar-width-collapsed;
  }

  .main-container {
    margin-left: $sidebar-width-collapsed;
  }
}


</style>
