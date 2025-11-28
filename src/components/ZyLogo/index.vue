<template>
  <transition enter-active-class="animate__animated animate__fadeInLeft">
  <div class="zy-logo">
    <img :width="size" :src="url || setting.websiteInfo.logo ||logo">
    <span v-if="showTitle"
          class="title">{{ setting.websiteInfo.name || 'ZHOUYI' }}@{{ setting.websiteInfo.version || '1.0.0' }}</span>
  </div>
  </transition>
</template>

<script setup>
import {ref} from 'vue'
import logo from '@/assets/img/logo.png';
import setting from '@/setting.js';

const props = defineProps(
    {
      url: {
        type: String,
        default: ''
      },
      showTitle: {
        type: Boolean,
        default: true
      },
      size: {
        type: [String, Number],
        default: '56'
      },
    }
)
// 定义可触发的事件
const emit = defineEmits(['logo-click',])
const clickLogo = () => {
  emit('logo-click')
}
const webSiteTitle = ref(import.meta.env.VITE_APP_WEB_TITLE)
const webSiteTitleV = ref(import.meta.env.VITE_APP_WEB_VERSION)
</script>

<style lang="scss" scoped>
.zy-logo {
  display: flex;
  justify-content: left;
  align-items: center;

  .title {
    font-weight: bold;
    margin-left: 12px;
    font-size: 1.1rem;
    font-family: "Baskerville Old Face";
  }
}
</style>
