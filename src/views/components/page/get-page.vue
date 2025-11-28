<script setup>
import {ZyNotification} from "@/utils/util.toast.js";

const ruleFormRef = ref()
const loading = ref(false)


let ruleForm = ref({})

const rules = reactive({
  username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
  nickname: [{required: true, message: '昵称不能为空', trigger: 'blur'}],
})
const emits = defineEmits(['save', 'close'])
const props = defineProps({
  updateData: {
    type: Object,
    default: () => {
    }
  }
})

if (props.updateData && props.updateData._id) {
  ruleForm.value = {...props.updateData}
}

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      /*let FUC = ruleForm.value.id ? 'update' : 'save'
      FUC(ruleForm.value).then(res => {
        emits('close', true)
        ZyNotification.success('操作成功！')
      })*/
      emits('close', true)
      ZyNotification.success('操作成功！')
    } else {
      console.log('error submit!')
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
const close = (formEl) => {
  emits('close')
}


onMounted(() => {

})
</script>

<template>
  <section>
    <el-form ref="ruleFormRef" @submit.native.prevent :model="ruleForm" status-icon :rules="rules" label-position="top"
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
      <el-form-item label="附加信息" prop="remark">
        <el-input type="textarea" v-model="ruleForm.remark" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <div class="form-footer">
      <el-button type="primary" size="default" @click="submitForm(ruleFormRef)" :loading="loading">
        保存
      </el-button>
      <el-button size="default" @click="resetForm(ruleFormRef)">重置</el-button>
      <el-button size="default" @click="close">取消</el-button>
    </div>
  </section>

</template>

<style scoped lang="scss">

</style>