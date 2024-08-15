<script setup>
let ruleForm = ref({})

const emits = defineEmits(['save', 'close'])
const props = defineProps({
  updateData: {
    type: Object,
    default: () => {
    }
  }
})

if (props.updateData) {
  ruleForm.value = {...props.updateData}
}

</script>

<template>
  <section>
    <el-form disabled @submit.native.prevent :model="ruleForm" status-icon label-position="top"
             label-width="auto" class="demo-ruleForm" size="default">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" autocomplete="off"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="ruleForm.nickname" autocomplete="off"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>

</template>

<style scoped lang="scss"></style>