<script setup>
import {ZyNotification} from "@/utils/util.toast.js";

const ruleFormRef = ref()
const loading = ref(false)
const defaultProps = {
  children: 'children',
  label: 'name',
}

let ruleForm = ref({})

const rules = reactive({
  username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
  nickname: [{required: true, message: '昵称不能为空', trigger: 'blur'}],
  password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
  roleId: [{required: true, message: '角色不能为空', trigger: 'blur'}],
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
      <el-form-item label="密码" prop="password">
        <el-input type="textarea" v-model="ruleForm.password" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-input type="textarea" v-model="ruleForm.roleId" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch active-text="正常" inactive-text="停用" v-model="ruleForm.status"/>
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
.filter-tree {
  margin-left: 25px;
  border: 1px solid var(--el-border-color);
  padding: 20px;
  border-radius: 8px;
}
</style>