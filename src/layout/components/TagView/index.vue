<script setup>
import router from "@/router/index.js";
import {useRoute} from "vue-router";
import Sortable from 'sortablejs'
import {useTagsViewStore} from "@/stores/TagsView.js";
import {ArrowLeft, ArrowRight, CircleClose, Close, CloseBold} from "@element-plus/icons-vue";
import {useAppStore} from "@/stores/AppSetting.js";

const currentRoute = useRoute();
const appStore = useAppStore();
const TagsViewStore = useTagsViewStore()
// 跳转页面
const goPage = (tab) => {
  router.push({path: tab.paneName})
}

let current = computed(() => {
  return currentRoute.path
})
let contextmenuFlag = ref(false)
let contentmenuX = ref(0)
let contentmenuY = ref(0)
let tagName = ref('')

const handleCommand = (command) => {
  if (tagName.value) {
    contextmenuFlag.value = false;
    if (command === 'refresh') {
      return router.replace({path: "/redirect" + tagName.value})
    } else {
      return TagsViewStore.closeTags(command, tagName.value)
    }
  } else {
    TagsViewStore.closeTags(command)
  }
}
const handleClick = () => {
  TagsViewStore.closeTags('all')
}


/**
 * @description 右键菜单功能点击
 * @param {Object} event 事件
 */

const handleContextmenu = (event) => {
  let target = event.target
  let flag = false
  if (target.className.indexOf('el-tabs__item') > -1) flag = true
  else if (target.parentNode.className.indexOf('el-tabs__item') > -1) {
    target = target.parentNode
    flag = true
  }
  if (flag) {
    event.preventDefault()
    event.stopPropagation()
    contentmenuX.value = event.clientX
    contentmenuY.value = event.clientY
    tagName.value = target.getAttribute('aria-controls').slice(5)
    contextmenuFlag.value = true
    window.addEventListener('mousedown', watchContextmenu);
  }
}
const contextMenuRef = ref(null)
const watchContextmenu = (event) => {
  if (!contextMenuRef.value.contains(event.target) || event.button !== 0) {
    contextmenuFlag.value = false;
    window.removeEventListener('mousedown', watchContextmenu);
  }
};
onMounted(() => {
  window.addEventListener('mousedown', watchContextmenu);
  window.addEventListener('contextmenu', handleContextmenu);

  // 拖拽排序
  const el = document.querySelectorAll('.tag-row .el-tabs__nav')[0]
  Sortable.create(el, {
    onEnd: (evt) => {
      const {oldIndex, newIndex} = evt
    }
  })

});
const tagViewStyle = computed(() => {
  if (['top'].includes(appStore.layoutMode)){
    return {
      marginLeft: '10px',
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('contextmenu', handleContextmenu);
  window.removeEventListener('mousedown', watchContextmenu);
});
</script>

<template>
  <section class="tag-row" :style="tagViewStyle">
    <div class="contenM"
         ref="contextMenuRef"
         :style="{left:contentmenuX+'px',top:contentmenuY+15+'px',display: contextmenuFlag ? 'block' : 'none '}"
    >
      <div class="contextmenu-list">
        <div class="c-item" v-if="tagName === currentRoute.path" @click="handleCommand('refresh')">
          <el-icon>
            <Refresh/>
          </el-icon>
          <span class="c-text">刷新当前</span></div>
        <div class="c-item" @click="handleCommand('left')">
          <el-icon>
            <ArrowLeft/>
          </el-icon>
          <span class="c-text">关闭左侧</span></div>
        <div class="c-item" @click="handleCommand('right')">
          <el-icon>
            <ArrowRight/>
          </el-icon>
          <span class="c-text">关闭右侧</span></div>
        <div class="c-item" @click="handleCommand('other')">
          <el-icon>
            <CircleClose/>
          </el-icon>
          <span class="c-text">关闭其他</span></div>
      </div>
    </div>
    <el-tabs
        @tab-click="goPage"
        @tab-remove="TagsViewStore.removeTag"
        type="card"
        @contextmenu.native.prevent="handleContextmenu"
        :model-value="current"
    >
      <el-tab-pane
          v-for="item in TagsViewStore.state.tagsList"
          :key="item.path"
          :name="item.path"
          closable
          :label="item.meta.title">
      </el-tab-pane>
    </el-tabs>
    <div class="tag-opt-right">
      <el-dropdown size="small"
                   @command="handleCommand"
                   @click="handleClick"
                   split-button>
        <el-icon>
          <CircleCloseFilled/>
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="left" :icon="ArrowLeft">
              关闭左侧
            </el-dropdown-item>

            <el-dropdown-item command="right" :icon="ArrowRight">
              关闭右侧
            </el-dropdown-item>
            <el-dropdown-item command="other" :icon="Close">
              关闭其它
            </el-dropdown-item>
            <el-dropdown-item command="all" :icon="CloseBold">
              全部关闭
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </section>

</template>

<style scoped lang="scss">
.tag-row {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .contenM {
    position: fixed;
    z-index: 3;
    padding: 8px;
    background: var(--menu-background);
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    font-size: 13px;

    .contextmenu-list {
      cursor: pointer;

      .c-item {
        transition: all .28s linear;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 5px;
        color: var(--el-text-color-regular);

        &:hover {
          color: var(--el-color-primary);
        }

        .c-text {
          padding-left: 10px;
        }
      }
    }
  }

  .tag-opt-right {
    margin-right: 10px;

    .el-dropdown .el-dropdown__caret-button.el-button::before {
      display: none;
    }
  }
}
</style>
<style lang="scss">
.tag-row {
  .el-tabs__header {
    margin: 0;
    box-sizing: border-box;
    height: 36px;
    user-select: none;

    &.is-top {
      border-bottom-color: transparent;
    }

    .el-tabs__nav {
      border-bottom-color: transparent;
      overflow: hidden;
      height: $tags-view-height;
    }

    .el-tabs__item {
      border-bottom: 1px solid var(--el-border-color) !important;

      &.is-active {
        background-color: var(--main-background) !important;
        border-bottom-color: var(--main-background) !important;
      }
    }
  }

  .tag-opt-right {
    .el-button-group .el-button {
      height: $tags-view-height;
      border-bottom: none;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .el-dropdown .el-dropdown__caret-button.el-button {
      height: $tags-view-height;
      outline: none;
    }
  }
}
</style>