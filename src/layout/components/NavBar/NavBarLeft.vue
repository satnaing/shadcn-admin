<script setup>

import {useAppStore} from "@/stores/AppSetting.js";

const appStore = useAppStore();

function toggleSideBar() {
  appStore.toggleSidebar();
}

let executedOnce = false; // 跟踪是否已执行过一次
const handleResize = (e) => {
  if (window.innerWidth < 900 && !executedOnce) {
    if (appStore.sidebar.opened){
      appStore.toggleSidebar();
    }
    executedOnce = true; // 设置为已执行过一次

  } else if (window.innerWidth >= 900 && executedOnce) {
    executedOnce = false; // 如果窗口宽度大于等于900且已执行过一次，则重置为未执行
    if (!appStore.sidebar.opened){
      appStore.toggleSidebar();
    }
  }
};
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="nav-bar-left">
    <div class="bar-left-ex" @click="toggleSideBar" >
      <el-icon color="#373839" class="nav-bar-left-icon" :class="{ 'is-active': appStore.sidebar.opened }" title="展开">
        <Expand/>
      </el-icon>
      <el-icon color="#373839" class="nav-bar-left-icon" :class="{ 'is-active': !appStore.sidebar.opened }"
               title="折叠">
        <Fold/>
      </el-icon>
    </div>
    <Breadcrumb />
  </div>
</template>

<style scoped lang="scss">
.nav-bar-left {
  display: flex;
  align-items: center;
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

}
</style>