<script setup>
import {ZyNotification} from "@/utils/util.toast.js";

const ruleFormRef = ref()
const loading = ref(false)


let ruleForm = ref({})

const rules = reactive({
  name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
  key: [{required: true, message: '权限标识不能为空', trigger: 'blur'}],
})
const emits = defineEmits(['save', 'close'])
const props = defineProps({
  updateData: {
    type: Object,
    default: () => {
    }
  }
})

ruleForm.value = {...props.updateData}

const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      /*let FUC = ruleForm.value._id ? 'update' : 'save'
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
          <el-form-item label="名称" prop="name">
            <el-input v-model="ruleForm.name" autocomplete="off"/>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="父级标识" prop="parent_key">
            <el-input v-model="ruleForm.parent_key" autocomplete="off"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限标识" prop="key">
            <el-input v-model="ruleForm.key" autocomplete="off"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="权限按钮" prop="auth">
            <el-switch active-text="权限按钮" inactive-text="普通菜单" v-model="ruleForm.auth"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-switch active-text="正常" inactive-text="停用" v-model="ruleForm.status"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="ruleForm?.add">
        <el-col :span="12">
          <el-form-item label="自动生成权限按钮" prop="auth">
            <el-switch v-model="ruleForm.auth"/>
          </el-form-item>
        </el-col>
      </el-row>
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