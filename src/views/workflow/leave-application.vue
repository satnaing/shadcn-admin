<template>
  <div class="leave-application-container">
    <el-card title="请假申请" class="leave-application-card">
      <el-form ref="leaveFormRef" :model="leaveForm" :rules="leaveRules" label-width="120px">
        <el-form-item label="请假类型" prop="type">
          <el-select v-model="leaveForm.type" placeholder="请选择请假类型">
            <el-option label="年假" value="annual" />
            <el-option label="病假" value="sick" />
            <el-option label="事假" value="personal" />
            <el-option label="婚假" value="marriage" />
            <el-option label="产假" value="maternity" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="请假开始时间" prop="startTime">
          <el-date-picker
            v-model="leaveForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="请假结束时间" prop="endTime">
          <el-date-picker
            v-model="leaveForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="请假天数" prop="days">
          <el-input-number
            v-model="leaveForm.days"
            :min="0.5"
            :max="30"
            :step="0.5"
            placeholder="请输入请假天数"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="请假原因" prop="reason">
          <el-input
            v-model="leaveForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入请假原因"
          />
        </el-form-item>
        
        <el-form-item label="附件">
          <el-upload
            action="#"
            :auto-upload="false"
            :file-list="fileList"
            list-type="text"
            accept=".doc,.docx,.pdf,.jpg,.png"
          >
            <template #trigger>
              <el-button type="primary">选择文件</el-button>
            </template>
            <el-button size="small" type="text">上传附件</el-button>
          </el-upload>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">提交申请</el-button>
          <el-button @click="resetForm">重置表单</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card title="我的请假申请" class="leave-application-card mt-20">
      <el-table :data="myLeaveApplications" border style="width: 100%">
        <el-table-column prop="type" label="请假类型" width="120">
          <template #default="scope">
            <el-tag :type="getLeaveTypeTagType(scope.row.data.type)">
              {{ getLeaveTypeText(scope.row.data.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="data.days" label="请假天数" width="100" />
        <el-table-column prop="data.startTime" label="开始时间" width="180" />
        <el-table-column prop="data.endTime" label="结束时间" width="180" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button type="text" size="small" @click="viewProcessDetail(scope.row.id)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useWorkflowStore } from '@/stores/Workflow';

const workflowStore = useWorkflowStore();
const leaveFormRef = ref(null);
const loading = ref(false);
const fileList = ref([]);

// 请假表单数据
const leaveForm = reactive({
  type: '',
  startTime: '',
  endTime: '',
  days: 0,
  reason: ''
});

// 表单验证规则
const leaveRules = {
  type: [
    { required: true, message: '请选择请假类型', trigger: 'change' }
  ],
  startTime: [
    { required: true, message: '请选择请假开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择请假结束时间', trigger: 'change' }
  ],
  days: [
    { required: true, message: '请输入请假天数', trigger: 'blur' },
    { type: 'number', min: 0.5, message: '请假天数不能少于0.5天', trigger: 'blur' }
  ],
  reason: [
    { required: true, message: '请输入请假原因', trigger: 'blur' },
    { min: 10, message: '请假原因不能少于10个字符', trigger: 'blur' }
  ]
};

// 我的请假申请列表
const myLeaveApplications = computed(() => {
  return workflowStore.getMyProcessInstances().filter(p => p.type === 'leave');
});

// 获取请假类型文本
function getLeaveTypeText(type) {
  const typeMap = {
    annual: '年假',
    sick: '病假',
    personal: '事假',
    marriage: '婚假',
    maternity: '产假'
  };
  return typeMap[type] || type;
}

// 获取请假类型标签类型
function getLeaveTypeTagType(type) {
  const typeMap = {
    annual: 'primary',
    sick: 'warning',
    personal: 'info',
    marriage: 'success',
    maternity: 'danger'
  };
  return typeMap[type] || 'default';
}

// 获取状态文本
function getStatusText(status) {
  const statusMap = {
    draft: '草稿',
    submitted: '已提交',
    approved: '已批准',
    rejected: '已驳回',
    completed: '已完成'
  };
  return statusMap[status] || status;
}

// 获取状态标签类型
function getStatusTagType(status) {
  const statusMap = {
    draft: 'default',
    submitted: 'warning',
    approved: 'success',
    rejected: 'danger',
    completed: 'info'
  };
  return statusMap[status] || 'default';
}

// 提交表单
async function submitForm() {
  if (!leaveFormRef.value) return;
  
  try {
    await leaveFormRef.value.validate();
    loading.value = true;
    
    // 创建流程实例
    const processInstance = workflowStore.createProcessInstance('leave', leaveForm);
    
    // 提交流程
    const result = workflowStore.submitProcessInstance(processInstance.id);
    
    if (result) {
      ElMessage.success('请假申请提交成功');
      resetForm();
    } else {
      ElMessage.error('请假申请提交失败');
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查填写内容');
  } finally {
    loading.value = false;
  }
}

// 重置表单
function resetForm() {
  if (leaveFormRef.value) {
    leaveFormRef.value.resetFields();
  }
  fileList.value = [];
}

// 查看流程详情
function viewProcessDetail(processId) {
  // 这里可以跳转到流程详情页面
  ElMessage.info(`查看流程详情：${processId}`);
}

// 页面挂载时刷新数据
onMounted(() => {
  // 数据会自动从 Pinia store 中获取
});
</script>

<style scoped>
.leave-application-container {
  padding: 20px;
}

.leave-application-card {
  max-width: 1200px;
  margin: 0 auto;
}

.mt-20 {
  margin-top: 20px;
}
</style>
