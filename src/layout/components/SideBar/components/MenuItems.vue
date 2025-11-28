<template>
  <template v-for="route in routes">
    <el-sub-menu
        :key="route.path"
        v-if="route.children"
        :index="route.path"
    >
      <template #title>
        <el-icon v-if="route.meta.icon"  >
          <component :is="route.meta.icon" class="icon"></component>
        </el-icon>
        <el-icon v-else>
          <Setting/>
        </el-icon>
        <span>{{ route.meta.title }}</span>
      </template>
      <MenuItems :routes="route.children"/>
    </el-sub-menu>

    <el-menu-item
        v-else
        :key="route.path"
        :index="route.path"
        @click="goPage(route)"
    >
      <el-icon v-if="route.meta.icon"  >
        <component :is="route.meta.icon" class="icon"></component>
      </el-icon>
      <el-icon v-else>
        <Setting/>
      </el-icon>
      <span>{{ route.meta.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup>

import router from "@/router/index.js";
import {useTagsViewStore} from "@/stores/TagsView.js";

const TagsViewStore = useTagsViewStore()
const props = defineProps({
  routes: {
    type: Array,
    required: true
  }
})
// 跳转页面
const goPage = (v) => {

  if (v.meta.isLink) {
    window.open(v.path, '_blank')
    return
  }
  // 添加 tagView
  TagsViewStore.addTag(v)
  router.push({path: v.path})
}

</script>
