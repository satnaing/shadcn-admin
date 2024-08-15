<template>
  <section class="app-main" :style="mainStyle">
    <transition
        v-if="searchStore.searchActive"
        enter-active-class="animate__animated animate__fadeIn"
        mode="out-in"
    >
      <PanelSearch/>
    </transition>
    <router-view v-if="!searchStore.searchActive" style="padding-top: 10px">
      <template #default="{ Component, route }">
        <transition
            enter-active-class="animate__animated animate__fadeIn"
            mode="out-in"
        >
          <keep-alive
              :include="getIncludedComponents(route)"
              :exclude="getExcludedComponents(route)"
          >
            <component :is="Component" :key="route.path"/>
          </keep-alive>
        </transition>
      </template>
    </router-view>
  </section>
</template>
<script setup>
import variables from "@/assets/styles/abstracts/_variables.module.scss";
import PanelSearch from "@/components/SearchPanel/index.vue";
import hotkeys from 'hotkeys-js';
import {useSearchStore} from "@/stores/SearchPanel.js";
import {useAppStore} from "@/stores/AppSetting.js";

const searchStore = useSearchStore()
const appStore = useAppStore()
const mainStyle = computed(() => {
  if (['top'].includes(appStore.layoutMode)) {
    return {
      marginLeft: '10px',
      height: `calc(100vh - ${variables["navbar-height"]} - ${variables["tags-view-height"]})`
    }
  } else {
    return {
      height: `calc(100vh - ${variables["navbar-height"]} - ${variables["tags-view-height"]})`
    }
  }
})


const getIncludedComponents = (route) => {
  const includedComponents = [];
  if (route.meta.cache) {
    includedComponents.push(route.component);
  }
  return includedComponents;
}

const getExcludedComponents = (route) => {
  const excludedComponents = [];
  if (!route.meta.cache) {
    excludedComponents.push(route.component);
  }
  return excludedComponents;
}


hotkeys(searchStore.hotkey.open, event => {
  event.preventDefault()
  searchStore.showSearchPanel(true)
})

hotkeys(searchStore.hotkey.close, event => {
  event.preventDefault()
  searchStore.showSearchPanel(false)
})
</script>
<style lang="scss" scoped>
.app-main {
  position: relative;
  box-sizing: border-box;
  padding: 0 10px 10px;
  background-color: var(--main-background);
  overflow: auto;
  margin-right: 10px;
  border: 1px solid var(--main-border-color);

}
</style>

