<template>
  <el-breadcrumb class="flex-y-center">
    <transition-group
        enter-active-class="animate__animated animate__fadeInRight"
    >
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span
            v-if="
            item.redirect === 'noredirect' || index === breadcrumbs.length - 1
          "
            class="color-gray-400"
        >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">
          {{ item.meta.title }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import {compile} from "path-to-regexp";
import router from "@/router";
import {useRoute} from 'vue-router'
import {useTagsViewStore} from "@/stores/TagsView.js";

const currentRoute = useRoute();
const TagsViewStore = useTagsViewStore();
const pathCompile = (path) => {
  const {params} = currentRoute;
  const toPath = compile(path);
  return toPath(params);
};

const breadcrumbs = ref([]);

function getBreadcrumb() {
  let matched = currentRoute.matched.filter(
      (item) => item.meta && item.meta.title
  );
  const first = matched[0];
  if (!isDashboard(first)) {
    matched = [
      {path: "/dashboard", meta: {title: "工作台"}},
    ].concat(matched);
  }
  breadcrumbs.value = matched.filter((item) => {
    return item.meta && item.meta.title;
  });
}


function isDashboard(route) {
  const name = route && route.name;
  if (!name) {
    return false;
  }
  return (
      name.toString().trim().toLocaleLowerCase() ===
      "Dashboard".toLocaleLowerCase()
  );
}

function handleLink(item) {
  const {redirect, path, children} = item;
  if (redirect) {
    router.push(redirect).catch((err) => {
      console.warn(err);
    });
    TagsViewStore.addTag(redirect)
    return;
  }
  if (children && children.length > 0) {
    router.push(children[0].path).catch((err) => {
      console.warn(err);
    });
    TagsViewStore.addTag(children[0])
    return;
  }
  router.push(pathCompile(path)).catch((err) => {
    console.warn(err);
  });
  TagsViewStore.addTag(item)
}

watch(
    () => currentRoute.path,
    (path) => {
      if (path.startsWith("/redirect/")) {
        return;
      }
      getBreadcrumb();
    }
);

onBeforeMount(() => {
  getBreadcrumb();
});
</script>

<style lang="scss">
// 覆盖 element-plus 的样式
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.flex-y-center {
  display: flex;
  align-items: center;
}
</style>
