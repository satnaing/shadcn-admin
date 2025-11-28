<template>
  <transition
      enter-active-class="animate__animated animate__fadeIn"
      mode="out-in"
  >
    <section class="panel-search">
      <section class="panel-search__input-group" @click.self="handlePanelClick">
        <ZyLogo class="panel-search__logo"/>
        <el-input size="large" v-model="keyword" placeholder="搜索页面"
                  style=" width: 500px"
                  @change="onchange"/>

        <div class="panel-search__tip">
          您可以使用快捷键
          <span class="panel-search__key">{{ searchStore.hotkey.open }}</span>
          唤醒搜索面板，按
          <span class="panel-search__key">{{ searchStore.hotkey.close }}</span>
          关闭
        </div>
      </section>
      <section class="panel-search__results-group" :style="{maxHeight:boxHeight+'px'}" v-if="filteredRoutes.length">
        <div class="zy-panel-search-item" v-for="(item,index) in filteredRoutes" :key="index"
             @click="handleResultsGroupItemClick(item)">
          <div class="zy-panel-search-item__icon">
            <el-icon class="icon-l">
              <Setting/>
            </el-icon>
            <!--          <IconFont :type="`icon-${item.meta.icon || 'shezhi'}`" class="icon-l"/>-->
          </div>
          <div class="zy-panel-search-item__info">
            <div class="zy-panel-search-item__info-title">
              <span>{{ item.meta.title }}</span>
            </div>
            <div class="zy-panel-search-item__info-fullTitle">
              <span>{{ item.name }}</span>
            </div>
            <div class="zy-panel-search-item__info-path">
              <span>{{ item.path }}</span>
            </div>
          </div>
        </div>
      </section>
    </section>
  </transition>
</template>

<script setup>
import dbUtils from "utils/util.strotage";
import {useRouter} from "vue-router";
import {useSearchStore} from "@/stores/SearchPanel.js";

const searchStore = useSearchStore()

const router = useRouter()
const keyword = ref('')

const init = (data) => {
  let arr = [];
  for (const item of data) {
    if (item.children) {
      arr.push(...init(item.children));
    } else {
      arr.push(item);
    }
  }
  return arr;
};


/**
 * 检查路由对象是否具有权限
 * @param {Array} perms - 权限列表
 * @param {Object} route - 路由对象
 * @returns {boolean} - 是否具有权限
 */
function hasPermission(perms, route) {
  if (perms.includes('*')) return true
  if (route.meta && route.meta.perms) {
    // 如果路由对象定义了 meta 属性或者定义 meta.perms 属性，那么就根据权限值来判断是否具有权限
    return perms.some(perm => route.meta.perms.includes(perm))
  } else {
    // 如果路由对象没有定义 meta 属性或者没有定义 meta.perms 属性，那么默认认为具有权限，返回 true。
    return true
  }
}

/**
 * 根据权限列表筛选异步路由配置
 * @param {Array} routes - 路由配置表
 * @param {Array} perms - 权限列表
 * @returns {Array} - 筛选后的路由配置
 */
function filterAsyncRouter(routes, perms) {
  const res = []

  routes.forEach(route => {
    // 创建临时变量 tmp  可以在后续的操作中不会修改原始的路由对象。
    const tmp = {...route}
    if (!tmp.meta.hidden && tmp.children) {
      // 先对子路由进行深度筛选，确保子路由也符合权限要求
      tmp.children = filterAsyncRouter(tmp.children, perms)
      if (tmp.children && tmp.children.length > 0) {
        res.push(tmp)
      }
    } else {
      // 对于没有子路由的路由对象，直接进行权限判断
      if (!tmp.meta.hidden && hasPermission(perms, tmp)) {
        res.push(tmp)
      }
    }
  })

  return res
}


const menuList = function () {
  const asyncRoutes = useRouter().options.routes[0].children.filter(e => !e.meta.hidden)
  //筛选路由表
  const permissionList = dbUtils.get('perms');
  if (!permissionList.length) {
    // 清空所有缓存数据
    dbUtils.clear()
    // 重置路由重新登录
    return useRouter().replace('/401')
  }
  return filterAsyncRouter(asyncRoutes, permissionList);
}


const routerList = ref(init(menuList()))
const filteredRoutes = ref(routerList.value)

// 搜索功能
function searchRoutes(keyword) {
  if (!keyword) {
    return routerList.value; // 如果关键词为空，返回所有的路由列表
  }
  return routerList.value.filter(route => {
    // 在这里定义你的搜索条件，可以根据路由的名称、标题等属性进行匹配
    return route.meta.title.includes(keyword);
  });
}

const onchange = () => {
  filteredRoutes.value = searchRoutes(keyword.value)
}

/**
 * @augments 点击列表选项
 */
const handleResultsGroupItemClick = (item) => {
  if (item.path === router.currentRoute.path) {
    handleEsc()
    return
  }
  if (item.meta && item.meta.link) {
    window.open(item.path, '_blank')
  } else {
    handleEsc()
    router.replace(item.path)
  }


}
/**
 * @augments 接收用户点击空白区域的关闭
 */
const handlePanelClick = () => {
  handleEsc()
}

/**
 * @augments 接收用户触发的关闭
 */
const handleEsc = async () => {
  searchStore.showSearchPanel(false)
}

const boxHeight = ref(580)

onMounted(() => {
  boxHeight.value = window.innerHeight - 380
})


</script>

<style lang="scss" scoped>
.panel-search {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;

  .panel-search__input-group {
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .panel-search__logo {
      margin-bottom: 20px;
    }

    .panel-search__tip {
      user-select: none;
      cursor: pointer;
      margin-top: 20px;
      margin-bottom: 40px;
      font-size: 12px;
      color: #999999;
      letter-spacing: 1px;

      .panel-search__key {
        padding: 1px 5px;
        margin: 0px 2px;
        border-radius: 2px;
        background-color: #666666;
        color: #ffffff;
      }
    }
  }

  .panel-search__results-group {
    overflow: auto;
    margin-bottom: -20px;
    background-color: var(--main-background);
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid var(--el-border-color);

    .zy-panel-search-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all .2s linear;
      padding: 5px 0;
      color: #525252;
      .icon-l {
        font-size: 20px;
        transition: all .28s linear;
      }
      &:hover {
        background-color: var(--el-menu-hover-bg-color);

        .icon-l {
          scale: 1.2;
          color: var(--el-color-primary);
        }
      }

      .zy-panel-search-item__icon {
        height: 64px;
        width: 64px;
        border-right: 1px solid var(--el-border-color);
        display: flex;
        align-items: center;
        justify-content: center;

      }

      .zy-panel-search-item__info {
        margin-left: 10px;

        .zy-panel-search-item__info-title {
          font-size: 16px;
          line-height: 30px;
          font-weight: bold;

        }

        .zy-panel-search-item__info-fullTitle {
          font-size: 10px;
          line-height: 20px;
        }

        .zy-panel-search-item__info-path {
          margin-bottom: 4px;
          font-size: 10px;
          line-height: 14px;
          color: #999999;
        }
      }
    }

  }

}
</style>
