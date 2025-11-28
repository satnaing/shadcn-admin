<template>
  <div class="task-center-container">
    <el-card class="task-center-card">
      <template #header>
        <div class="card-header">
          <span>任务中心</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" type="card">
        <!-- 待办任务 -->
        <el-tab-pane label="待办任务" name="pending">
          <el-table :data="pendingTasks" border style="width: 100%">
            <el-table-column prop="processType" label="流程类型" width="120">
              <template #default="scope">
                <el-tag type="primary">{{ getProcessTypeText(scope.row.processType) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="请假类型" width="100">
              <template #default="scope">
                <span v-if="scope.row.processType === 'leave'">{{ getLeaveTypeText(scope.row.data.type) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="请假天数" width="100">
              <template #default="scope">
                <span v-if="scope.row.processType === 'leave'">{{ scope.row.data.days }}</span>
              </template>
            </el-table-column>
            <el-table-column label="开始时间" width="180">
              <template #default="scope">
                <span>{{ scope.row.data.startTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" width="180">
              <template #default="scope">
                <span>{{ scope.row.data.endTime }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="assignedByName" label="申请人" width="120" />
            <el-table-column prop="createdAt" label="申请时间" width="180" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button type="primary" size="small" @click="approveTask(scope.row.id)">
                  批准
                </el-button>
                <el-button type="danger" size="small" @click="rejectTask(scope.row.id)">
                  驳回
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <div v-if="pendingTasks.length === 0" class="empty-state">
            <el-empty description="暂无待办任务" />
          </div>
        </el-tab-pane>
        
        <!-- 已办任务 -->
        <el-tab-pane label="已办任务" name="completed">
          <el-table :data="completedTasks" border style="width: 100%">
            <el-table-column prop="processType" label="流程类型" width="120">
              <template #default="scope">
                <el-tag type="info">{{ getProcessTypeText(scope.row.processType) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="请假类型" width="100">
              <template #default="scope">
                <span v-if="scope.row.processType === 'leave'">{{ getLeaveTypeText(scope.row.data.type) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="请假天数" width="100">
              <template #default="scope">
                <span v-if="scope.row.processType === 'leave'">{{ scope.row.data.days }}</span>
              </template>
            </el-table-column>
            <el-table-column label="开始时间" width="180">
              <template #default="scope">
                <span>{{ scope.row.data.startTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" width="180">
              <template #default="scope">
                <span>{{ scope.row.data.endTime }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="assignedByName" label="申请人" width="120" />
            <el-table-column prop="status" label="处理结果" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'approved' ? 'success' : 'danger'">
                  {{ scope.row.status === 'approved' ? '已批准' : '已驳回' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="processedAt" label="处理时间" width="180" />
            <el-table-column prop="comment" label="处理意见" min-width="200" />
          </el-table>
          
          <div v-if="completedTasks.length === 0" class="empty-state">
            <el-empty description="暂无已办任务" />
          </div>
        </el-tab-pane>
        
        <!-- 我发起的流程 -->
        <el-tab-pane label="我发起的流程" name="myProcesses">
          <el-table :data="myProcesses" border style="width: 100%">
            <el-table-column prop="type" label="流程类型" width="120">
              <template #default="scope">
                <el-tag type="primary">{{ getProcessTypeText(scope.row.type) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="请假类型" width="100">
              <template #default="scope">
                <span v-if="scope.row.type === 'leave'">{{ getLeaveTypeText(scope.row.data.type) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="请假天数" width="100">
              <template #default="scope">
                <span v-if="scope.row.type === 'leave'">{{ scope.row.data.days }}</span>
              </template>
            </el-table-column>
            <el-table-column label="开始时间" width="180">
              <template #default="scope">
                <span>{{ scope.row.data.startTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" width="180">
              <template #default="scope">
                <span>{{ scope.row.data.endTime }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="流程状态" width="120">
              <template #default="scope">
                <el-tag :type="getStatusTagType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="发起时间" width="180" />
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="scope">
                <el-button type="text" size="small" @click="viewProcessDetail(scope.row.id)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <div v-if="myProcesses.length === 0" class="empty-state">
            <el-empty description="暂无发起的流程" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useWorkflowStore } from '@/stores/Workflow';

const workflowStore = useWorkflowStore();
const activeTab = ref('pending');

// 待办任务列表
const pendingTasks = computed(() => {
  return workflowStore.getPendingTasks();
});

// 已办任务列表
const completedTasks = computed(() => {
  return workflowStore.getCompletedTasks();
});

// 我发起的流程列表
const myProcesses = computed(() => {
  return workflowStore.getMyProcessInstances();
});

// 获取流程类型文本
function getProcessTypeText(type) {
  const typeMap = {
    leave: '请假申请'
  };
  return typeMap[type] || type;
}

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

// 批准任务
async function approveTask(taskId) {
  try {
    const { value: comment } = await ElMessageBox.prompt('请输入批准意见', '批准任务', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入批准意见'
    });
    
    const result = workflowStore.approveProcess(taskId, comment, true);
    
    if (result) {
      ElMessage.success('任务批准成功');
    } else {
      ElMessage.error('任务批准失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
}

// 驳回任务
async function rejectTask(taskId) {
  try {
    const { value: comment } = await ElMessageBox.prompt('请输入驳回意见', '驳回任务', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入驳回意见'
    });
    
    const result = workflowStore.approveProcess(taskId, comment, false);
    
    if (result) {
      ElMessage.success('任务驳回成功');
    } else {
      ElMessage.error('任务驳回失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
}

// 查看流程详情
function viewProcessDetail(processId) {
  // 这里可以跳转到流程详情页面
  ElMessage.info(`查看流程详情：${processId}`);
}
</script>

<style scoped>
.task-center-container {
  padding: 20px;
}

.task-center-card {
  max-width: 1400px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}
</style>
