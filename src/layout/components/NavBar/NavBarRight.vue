<script setup>

import Feedback from "./components/Feedback/index.vue";
import GitResource from "./components/GitResource/index.vue";
import AppHelp from "./components/AppHelp/index.vue";
import AppNotice from "./components/AppNotice/index.vue";
import AppUser from "./components/AppUser/index.vue";
import AppSetting from "./components/AppSetting/index.vue";
import FullScreen from "./components/FullScreen/index.vue";
</script>

<template>
  <div class="nav-bar-right">
    <Feedback class="right-item"/>
    <AppNotice class="right-item"/>
    <FullScreen class="right-item"/>
<!--    <GitResource class="right-item"/>-->
<!--    <AppHelp class="right-item"/>-->
    <AppSetting class="right-item"/>
    <AppUser class="right-item"/>
  </div>
</template>

<style scoped lang="scss">
.nav-bar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .right-item {
    min-width: 50px;
    padding: 0 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: $navbar-height;
    transition: color .28s linear;
    cursor: pointer;


    &:hover {
      color: var(--el-hover-bg-color);
    }

    span {
      font-size: 13px;
      padding: 0 5px;

    }

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

</style>
