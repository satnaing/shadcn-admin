<script setup>
import {
  Search,
  Refresh
} from '@element-plus/icons-vue'

const props = defineProps({
  ruleForm: {
    type: Object,
    required: true,
    default: () => {
      return {}
    }
  },
  rules: {
    type: Object,
    default: () => {
      return {}
    }
  },
  labelWidth: {
    type: String,
    default: () => {
      return ''
    }
  }
})

const ruleFormRef = ref(null)
const emits = defineEmits(['query', 'reset'])

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emits('query')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  emits('reset')
}
</script>

<template>
  <section class="query-warp">
    <div class="query-form">
      <el-form
          @submit.native.prevent
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          :label-width="labelWidth"
          class="ruleForm"
          status-icon
          size="default"
      >
        <el-space alignment="center" wrap>
          <slot/>
        </el-space>
      </el-form>
    </div>
    <div class="query-buts">
      <el-button :icon="Search" type="primary" @click="submitForm(ruleFormRef)">查询</el-button>
      <el-button :icon="Refresh" @click="resetForm(ruleFormRef)">重置</el-button>
    </div>
  </section>
</template>

<style  lang="scss">
.query-warp {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid var(--el-border-color);
  margin-bottom: 10px;
  padding-bottom: 10px;

  .query-form {
    width: 80%;

    .ruleForm {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .el-form-item--default {
        margin-bottom: 0;
      }
    }
  }


  .query-buts {
    width: 20%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

}
</style>
