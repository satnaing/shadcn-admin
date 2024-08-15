<script setup>
import {useRoute} from 'vue-router'
import variables from "@/assets/styles/abstracts/_variables.module.scss";

const currentRoute = useRoute()
const minHeight = computed(() => {
  return `calc(100vh - ${variables["navbar-height"]} - 36px)`;

});
</script>

<template>
  <iframe :style="{width: '100%', height: minHeight}" :src="currentRoute.meta.url"></iframe>
</template>

<style scoped lang="scss">

</style>