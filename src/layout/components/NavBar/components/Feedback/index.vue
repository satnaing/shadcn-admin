<script setup>
const ruleFormRef = ref()
const ruleForm = reactive({
  type: '',
  desc: '',
})
const rules = reactive({
  type: [
    {
      required: true,
      message: '请选择反馈类型',
      trigger: 'change',
    },
  ],
  desc: [
    {required: true, message: '请输入描述信息', trigger: 'blur'},
  ],
})

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

</script>

<template>
  <el-popover placement="top-start" :width="400" trigger="click">
    <template #reference>
      <el-button style="margin-right: 10px">我要反馈</el-button>
    </template>
    <section>
      <el-form
          label-position="top"
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="auto"
          class="feedback-ruleForm"
          status-icon
      >
        <el-form-item label="反馈类型" prop="type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio value="BUG" name="type">
              BUG
            </el-radio>
            <el-radio value="优化建议" name="type">
              优化建议
            </el-radio>

            <el-radio value="合作/其他" name="type">
              合作/其他
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="ruleForm.desc"
                    placeholder="请输入描述信息"
                    :autosize="{ minRows: 4 }"
                    type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            提交
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          <el-button @click="resetForm(ruleFormRef)">图片</el-button>
        </el-form-item>
      </el-form>
      <div class="tips">
        有技术问题反馈或项目合作吗?也可直接联系
        <a href="https://gitee.com/Z568_568" target="_blank" > ZHOUYI作者 </a>或浏览 <a target="_blank" href="https://gitee.com/Z568_568/ZHOUYI-ADMIN"> 项目文档 </a>。
      </div>
    </section>
  </el-popover>
</template>

<style scoped lang="scss">
.feedback-ruleForm {
  padding: 15px 10px 0 10px;
}
.tips {
  font-size: 12px;
  color: #6c6c6c;
  padding: 15px 8px 15px 8px;
  border-top: 1px solid var(--el-border-color);
  a {
    color: var(--el-color-primary);
  }
}

</style>