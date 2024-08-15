<script setup>

import NavBarLeft from "./NavBarLeft.vue";
import NavBarRight from "./NavBarRight.vue";
import {useAppStore} from "@/stores/AppSetting.js";


const appStore = useAppStore()

</script>

<template>
  <section class="nav-bar">
    <SideBar mode="horizontal" v-if="['top','mixin'].includes(appStore.layoutMode)"/>
    <NavBarLeft v-if="['slide'].includes(appStore.layoutMode)"/>
    <NavBarRight/>
  </section>
</template>

<style scoped lang="scss">
.nav-bar {
  height: $navbar-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;

}
</style>