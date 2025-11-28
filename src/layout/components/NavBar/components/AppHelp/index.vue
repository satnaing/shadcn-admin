<script setup>
import {useAuthStore} from "@/stores/Users.js";
import {CirclePlus, Star} from "@element-plus/icons-vue";

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
  <el-dropdown @command="handleCommand">
    <div class="right-item">
      <el-icon size="20">
        <QuestionFilled/>
      </el-icon>
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="a" :icon="Star">项目文档</el-dropdown-item>
        <el-dropdown-item command="b" :icon="CirclePlus">使用帮助</el-dropdown-item>
        <!--                    <el-dropdown-item divided command="c">注销退出</el-dropdown-item>-->
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss">

</style>