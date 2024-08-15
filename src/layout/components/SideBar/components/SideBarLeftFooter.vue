<script setup>

import {Location, Moon, Sunny} from "@element-plus/icons-vue";
import {useAppStore} from "@/stores/AppSetting.js";
import {useAuthStore} from "@/stores/Users.js";
import {useSearchStore} from "@/stores/SearchPanel.js";

const userStore = useAuthStore()
const appStore = useAppStore()

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
const changeThemeColor = (color) => {
  appStore.toggleThemeColor(color)
}
const changeThemeType = (value) => {
  appStore.toggleThemeDark(value)
}

const logout = () => {
  ElMessageBox.confirm(
      '确定注销并退出系统吗?',
      'Warning',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        userStore.logout()
      })
}


const searchStore = useSearchStore()
const openSearchPanel = () => {
  searchStore.showSearchPanel(true)
}

</script>

<template>
  <div class="side-footer">
    <div class="footer-item theme-item" title="主题颜色">
      <el-color-picker size="default" @change="changeThemeColor" v-model="appStore.appThemeColor" show-alpha
                       :predefine="predefineColors"/>
      <div class="title theme " v-if="appStore.sidebar.opened">
        <p class="nickname">主题颜色</p>
      </div>
    </div>
    <div class="footer-item theme-item search-item" @click="openSearchPanel" title="全局搜索">
      <el-icon class="search-icon">
        <Search/>
      </el-icon>
      <div class="title theme " v-if="appStore.sidebar.opened">
        <div class="nickname">
          <span>Search</span>
          <span class="btn">s</span>
        </div>
      </div>
    </div>
    <el-popover placement="top" popper-class="userinfo-warp" :width="250" trigger="click">
      <template #reference>
        <div class="footer-item" title="用户信息">
          <img
              class="item-left"
              src="https://marketplace.canva.com/EAFMNm9ybqQ/1/0/1600w/canva-gold-luxury-initial-circle-logo-qRQJCijq_Jw.jpg"
          />
          <div class="title " v-if="appStore.sidebar.opened">
            <p class="nickname">书中枫叶</p>
            <p class="status">ZHOUYI-ADMIN</p>
          </div>
        </div>
      </template>
      <div class="userinfo-box">
        <div class="userinfo-detail">
          <p class="nickname">书中枫叶</p>
          <p class="username">ZHOUYI-ADMIN</p>
        </div>

        <div class="box-item login-info">
          <p class="item-title">登录信息 </p>
          <p class="info-item">
            <el-icon style="margin-right: 5px">
              <Location/>
            </el-icon>
            贵州省贵阳市 ( 198.163.1.2 )
          </p>
          <p class="info-item">
            <el-icon style="margin-right: 5px">
              <Monitor/>
            </el-icon>
            Chrome Headless.v125
          </p>
          <p class="info-item">
            <el-icon style="margin-right: 5px">
              <Calendar/>
            </el-icon>
            2024-06-28 08:41:17
          </p>
        </div>
        <div class="box-item">
          <p class="item-title">主题模式</p>
          <el-switch size="default" v-model="appStore.appThemeDark" @change="changeThemeType"
                     :active-action-icon="Sunny"
                     :inactive-action-icon="Moon"/>
        </div>
        <!--        <div class="box-item">-->
        <!--          <p class="item-title">主题颜色</p>-->
        <!--          <el-color-picker size="default" @change="changeThemeColor" v-model="appStore.appThemeColor" show-alpha-->
        <!--                           :predefine="predefineColors"/>-->
        <!--        </div>-->
        <div class="box-item-out" @click="logout">
          <el-icon size="16">
            <SwitchButton/>
          </el-icon>
          <span>退出登录</span>
        </div>
      </div>
    </el-popover>

  </div>
</template>

<style scoped lang="scss">
.side-footer {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-top: 1px solid var(--el-border-color);
  overflow: hidden;

  .footer-item {
    width: 100%;
    height: 72px;
    box-sizing: border-box;
    cursor: pointer;
    color: #6c6c6c;
    padding: 15px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    transition: all .28s linear;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);

      .nickname {
        color: var(--el-menu-hover-text-color);
      }
    }

    .item-left {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid #2ecc40;
      display: block;
    }

    .title {
      width: calc(100% - 30px);
      line-height: normal;
      padding: 0 5px;
      font-size: 12px;
      white-space: nowrap;
      height: 100%;
      box-sizing: border-box;

      p {
        margin: 0;
        line-height: 1.8;

        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
      }

      .nickname {
        font-size: 14px;
        font-weight: bold;

      }
    }

    .theme {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .nickname {
        font-weight: normal;
      }
    }


  }

  .theme-item {
    height: 50px;
  }

  .search-item {
    width: 100%;
    box-sizing: border-box;
    padding: 7px;

    &:hover {
      .search-icon {
        color: var(--el-menu-hover-text-color);
      }
    }

    .search-icon {
      border: 1px solid var(--el-border-color);
      padding: 3px;
      width: 32px;
      height: 32px;
      box-sizing: border-box;
      border-radius: 50%;
      margin-left: 7px;
    }

    .title {
      width: calc(100% - 45px);

      .nickname {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .btn {
          padding: 1px 5px;
          margin: 0px 2px;
          border-radius: 2px;
          background-color: #666666;
          color: #ffffff;
        }
      }

    }

  }


}

.userinfo-warp {
  .userinfo-box {
    box-sizing: border-box;

    p {
      margin: 0 !important;
      line-height: 1.8;
    }

    .userinfo-detail {
      padding-bottom: 10px;
      border-bottom: 1px solid var(--el-border-color);

      .nickname {
        font-size: 14px;
        font-weight: bold;
        position: relative;
        padding-left: 15px;

        &:before {
          content: '';
          width: 8px;
          height: 8px;
          background-color: #05ef05;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 50%;
        }
      }

      .username {
        font-size: 12px;
        color: #c5c5c5;
      }
    }

    .box-item {
      padding-bottom: 10px;
      margin: 15px 0;
      border-bottom: 1px solid var(--el-border-color);

      .item-title {
        font-size: 12px;
        color: #b7b7b7;
        padding-bottom: 8px;
      }
    }

    .login-info {
      p {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        line-height: 1.8;
      }

      .info-item {
        color: #6c6c6c;
        font-size: 12px;

      }
    }

    .box-item-out {
      margin-bottom: 10px;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      line-height: 1.5;

      &:hover {
        color: var(--el-menu-hover-text-color);
      }

      span {
        padding-left: 5px;
      }
    }
  }
}
</style>
