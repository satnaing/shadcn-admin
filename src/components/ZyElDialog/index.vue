<script setup>

// https://element-plus.org/zh-CN/component/dialog.html#attributes

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: false
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: "标题"
  },
  width: {
    type: String,
    default: "50%"
  }
})

const loading = ref(false)
const emits = defineEmits(['close'])
const close = () => {
  emits('close')
}
const submitForm = () => {

}
const resetForm = () => {

}
</script>

<template>
  <el-dialog class="dialog-box" :model-value="show" :width="width"
             :key="new Date().getTime()" :show-close="props.showClose" @close="close">
    <template #header="{ close, titleId, titleClass }">
      <div class="dia-header">
        <div class="header-title" :id="titleId" :class="titleClass">{{ props.title }}</div>
        <div class="close-btn" @click="close">
          <el-icon class="el-icon">
            <Close/>
          </el-icon>
        </div>
      </div>
    </template>
    <div class="dia-box">
      <slot/>
    </div>
    <template #footer v-if="showFooter">
      <div class="dialog-footer">
        <el-button type="primary" size="default" @click="submitForm">保存</el-button>
        <slot name="footer"/>
        <el-button type="primary" @click="resetForm" plain size="default">重置</el-button>
        <el-button type="primary" @click="close" plain size="default">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

.dia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  position: relative;
  border-bottom: 1px solid var(--el-border-color);

  .header-title {
    font-size: 1.2rem;
    position: relative;
    padding-left: 10px;
    &:before{
      content: '';
      position: absolute;
      width: 4px;
      height: 100%;
      background-color: var(--el-color-primary);
      bottom: 0;
      left: 0;
      border-radius: 5px;

    }
  }

  .close-btn {
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    &:hover {
      color:var(--el-color-primary);
    }

  }
}

.dia-box {
  padding: 10px;
}

.dialog-footer {
  padding-bottom: 35px;


}
</style>