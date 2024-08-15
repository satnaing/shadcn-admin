<script setup>

const isFullscreen = ref(false);
const toggleFullscreen=()=> {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    // 进入全屏
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}
</script>

<template>
  <div class="user-icon" title="开关全屏">
    <el-icon size="20" @click="toggleFullscreen"><FullScreen /></el-icon>
  </div>
</template>

<style scoped lang="scss">
.user-icon {
  display: flex;
  justify-content: center;
  align-items: center;

}

</style>