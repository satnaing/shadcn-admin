<script setup>
import {Moon, Sunny} from "@element-plus/icons-vue";
import {useAppStore} from "@/stores/AppSetting.js";
import dbUtils from "utils/util.strotage";

const predefineColors = ref([
  '#3f51b5',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const appStore = useAppStore()
const changeThemeColor = (color) => {
  appStore.toggleThemeColor(color)
}
const changeThemeType = (value) => {
  appStore.toggleThemeDark(value)
}
const layoutMode = ref(dbUtils.get('layoutMode') || 'slide')
const changeLayout = (mode) => {
  appStore.layoutMode = mode
  layoutMode.value = mode
  dbUtils.set('layoutMode', mode)
}
const watermarking = computed(() => {
  return appStore.watermarking
})

</script>

<template>
  <el-popover placement="top-start" :width="300" trigger="click">
    <template #reference>
      <el-icon title="系统设置" class="setting-icon">
        <Setting/>
      </el-icon>
    </template>
    <section>
      <h4>系统主题</h4>
      <el-switch size="default" v-model="appStore.appThemeDark" @change="changeThemeType"
                 :active-action-icon="Sunny"
                 :inactive-action-icon="Moon"/>
      <h4>主题颜色</h4>
      <div class="theme-color-list">
        <span v-for="(item,index) in predefineColors" :title="item" @click="changeThemeColor(item)"
              :style="{backgroundColor:item}"></span>
      </div>
      <h4>系统布局</h4>
      <div class="layout-mode-list">
        <el-tooltip placement="top" content="侧边栏模式">
          <el-container class="slide-mode" :class="{'mode-active':layoutMode==='slide'}" @click="changeLayout('slide')">
            <el-aside width="18px" class="a"></el-aside>
            <el-main class="m"></el-main>
          </el-container>
        </el-tooltip>
        <el-tooltip placement="top" content="混合模式">
          <el-container class="slide-mode" :class="{'mode-active':layoutMode==='mixin'}" @click="changeLayout('mixin')">
            <el-aside width="18px" class="a"></el-aside>
            <el-container>
              <el-header class="h"></el-header>
              <el-main class="m"></el-main>
            </el-container>
          </el-container>
        </el-tooltip>
        <el-tooltip placement="top" content="顶部模式">
          <el-container class="slide-mode" :class="{'mode-active':layoutMode==='top'}" @click="changeLayout('top')">
            <el-header class="h"></el-header>
            <el-main class="m"></el-main>
          </el-container>
        </el-tooltip>
      </div>
      <h4>系统水印</h4>
      <el-switch size="default" :active-value="true" :inactive-value="false" :model-value="watermarking"
                 @change="appStore.changeWatermarking()"/>
    </section>
  </el-popover>
</template>

<style scoped lang="scss">
.setting-icon {
  margin-right: 5px;
  cursor: pointer;
}

.layout-mode-list {
  width: 100%;
  display: flex;

  .h {
    background-color: var(--el-color-primary-light-3);
    height: 15px;
  }

  .a {
    background-color: var(--el-color-primary);
  }

  .m {
    background-color: #ffffff;
    padding: 0;
  }

  .slide-mode {
    flex-grow: 1;
    max-width: 80px;
    height: 60px;
    border-radius: 5px;
    overflow: hidden;
    margin-right: 8px;
    cursor: pointer;
    transition: all .28s linear;
    box-shadow: 0 0 5px #eaeaea;
    border: 2px solid transparent;

    &:hover {
      border: 2px solid var(--el-color-primary);
      box-shadow: 0 0 5px var(--el-color-primary);
    }
  }

  .mode-active {
    border: 2px solid var(--el-color-primary);
    box-shadow: 0 0 5px var(--el-color-primary);
  }
}


.theme-color-list {
  display: flex;
  flex-wrap: wrap;

  span {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    margin: 3px;
    transition: all .28s linear;
    box-shadow: 0 0 5px #eaeaea;
    border: 2px solid transparent;

    &:hover {
      border: 2px solid var(--el-color-primary);
      box-shadow: 0 0 5px var(--el-color-primary);
    }
  }

}

</style>