<script setup>
import {useAuthStore} from "@/stores/Users.js";

const userStore = useAuthStore()
const handleCommand = (command) => {
  switch (command) {
    case 'c':
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


      break
  }

}
</script>

<template>
  <section class="notice-box">
    <el-popover placement="top-start" :width="400" trigger="click">
      <template #reference>

        <el-badge :value="1000" class="item" type="primary">
          <el-icon size="20">
            <Bell/>
          </el-icon>
        </el-badge>
      </template>
      <section>
        <section>
          <el-alert
              class="notice-item"
              title="Success alert"
              type="success"
              description="More text description"
              show-icon
          />
          <el-alert
              class="notice-item"
              title="Info alert"
              type="info"
              description="More text description"
              show-icon
          />
          <el-alert
              class="notice-item"
              title="Warning alert"
              type="warning"
              description="More text description"
              show-icon
          />
          <el-alert
              class="notice-item"
              title="Error alert"
              type="error"
              description="More text description"
              show-icon
          />
          <div class="notice-tips">
            <el-button  class="notice-item">历史所有通知</el-button>
          </div>
        </section>
<!--        <el-empty description="暂无通知" />-->
      </section>
    </el-popover>
  </section>
</template>

<style scoped lang="scss">
.notice-box {
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
  }

}
.notice-item {
  margin-bottom: 8px;
}
.notice-tips {
  margin-top: 10px;
  border-top: 1px solid var(--el-border-color);
  padding-top: 10px;
}
</style>