<template>
  <el-space>
    <el-button @click="()=>{emit('view')}"
               v-if="showView"
               v-permission="viewAuth">{{ viewText }}
    </el-button>
    <el-button type="primary"
               @click="()=>{emit('edit')}"
               v-if="showEdit"
               v-permission="editAuth">
      {{ editText }}
    </el-button>
    <slot></slot>
    <el-button type="danger"
               @click="()=>{emit('delete')}"
               v-if="showDelete"
               v-permission="deleteAuth"
    >{{ deleteText }}
    </el-button>
  </el-space>
</template>
<script setup>

const props = defineProps({
  showView: {
    type: Boolean,
    default: true,
  },
  showEdit: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
  viewText: {
    type: String,
    default: '查看',
  },
  editText: {
    type: String,
    default: '编辑',
  },
  deleteText: {
    type: String,
    default: '删除',
  },
  // 权限指令值 字符串数组
  viewAuth: {
    type: String,
    default: '', // 'sys'
  },
  editAuth: {
    type: String,
    default: '',
  },
  deleteAuth: {
    type: String,
    default: '',
  },

})
const emit = defineEmits(['view', 'edit', 'delete'])

</script>

<style scoped>

</style>
