import { defineStore } from 'pinia';
import dbUtils from 'utils/util.strotage.js';

// 流程状态枚举
const PROCESS_STATUS = {
  DRAFT: 'draft',        // 草稿
  SUBMITTED: 'submitted',// 已提交
  APPROVED: 'approved',  // 已批准
  REJECTED: 'rejected',  // 已驳回
  COMPLETED: 'completed' // 已完成
};

// 任务类型枚举
const TASK_TYPE = {
  APPROVAL: 'approval',  // 审批任务
  REVIEW: 'review',      // 审核任务
  INFO: 'info'           // 信息任务
};

export const useWorkflowStore = defineStore('Workflow', () => {
  // 流程实例列表
  let processInstances = [];
  // 任务列表
  let tasks = [];

  // 初始化数据
  function initData() {
    const savedProcesses = dbUtils.get('workflow_processes');
    const savedTasks = dbUtils.get('workflow_tasks');
    
    if (savedProcesses) {
      processInstances = JSON.parse(savedProcesses);
    }
    
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
    }
  }

  // 保存数据到本地存储
  function saveData() {
    dbUtils.set('workflow_processes', JSON.stringify(processInstances));
    dbUtils.set('workflow_tasks', JSON.stringify(tasks));
  }

  // 创建流程实例
  function createProcessInstance(processType, data) {
    const userInfoStr = dbUtils.get('userInfo');
    if (!userInfoStr) {
      console.error('User info not found in localStorage');
      return null;
    }
    const userInfo = JSON.parse(userInfoStr);
    const now = new Date().toISOString();
    
    const processInstance = {
      id: `process_${Date.now()}`,
      type: processType,
      status: PROCESS_STATUS.DRAFT,
      data: data,
      createdBy: userInfo.userId,
      createdByName: userInfo.nickname,
      createdAt: now,
      updatedAt: now,
      history: [
        { action: 'create', user: userInfo.userId, userName: userInfo.nickname, time: now, comment: '创建流程' }
      ]
    };
    
    processInstances.push(processInstance);
    saveData();
    
    return processInstance;
  }

  // 提交流程实例
  function submitProcessInstance(processId) {
    const processInstance = processInstances.find(p => p.id === processId);
    const userInfoStr = dbUtils.get('userInfo');
    if (!userInfoStr) {
      console.error('User info not found in localStorage');
      return null;
    }
    const userInfo = JSON.parse(userInfoStr);
    const now = new Date().toISOString();
    
    if (processInstance && processInstance.status === PROCESS_STATUS.DRAFT) {
      processInstance.status = PROCESS_STATUS.SUBMITTED;
      processInstance.updatedAt = now;
      processInstance.history.push({
        action: 'submit',
        user: userInfo.userId,
        userName: userInfo.nickname,
        time: now,
        comment: '提交流程'
      });
      
      // 创建审批任务
      const task = {
        id: `task_${Date.now()}`,
        type: TASK_TYPE.APPROVAL,
        processId: processId,
        processType: processInstance.type,
        status: 'pending',
        assignedTo: 'approver', // 默认审批人角色
        assignedByName: userInfo.nickname,
        createdAt: now,
        updatedAt: now,
        data: processInstance.data
      };
      
      tasks.push(task);
      saveData();
      
      return { processInstance, task };
    }
    
    return null;
  }

  // 审批流程
  function approveProcess(taskId, comment, approved) {
    const task = tasks.find(t => t.id === taskId);
    const userInfoStr = dbUtils.get('userInfo');
    if (!userInfoStr) {
      console.error('User info not found in localStorage');
      return null;
    }
    const userInfo = JSON.parse(userInfoStr);
    const now = new Date().toISOString();
    
    if (task && task.status === 'pending') {
      task.status = approved ? 'approved' : 'rejected';
      task.processedBy = userInfo.userId;
      task.processedByName = userInfo.nickname;
      task.processedAt = now;
      task.comment = comment;
      task.updatedAt = now;
      
      // 更新流程实例状态
      const processInstance = processInstances.find(p => p.id === task.processId);
      if (processInstance) {
        processInstance.status = approved ? PROCESS_STATUS.APPROVED : PROCESS_STATUS.REJECTED;
        processInstance.updatedAt = now;
        processInstance.history.push({
          action: approved ? 'approve' : 'reject',
          user: userInfo.userId,
          userName: userInfo.nickname,
          time: now,
          comment: comment
        });
        
        // 如果是请假流程且已批准，标记为完成
        if (approved && processInstance.type === 'leave') {
          processInstance.status = PROCESS_STATUS.COMPLETED;
          processInstance.history.push({
            action: 'complete',
            user: userInfo.userId,
            userName: userInfo.nickname,
            time: now,
            comment: '流程完成'
          });
        }
      }
      
      saveData();
      
      return { task, processInstance };
    }
    
    return null;
  }

  // 获取我的流程实例
  function getMyProcessInstances() {
    const userInfoStr = dbUtils.get('userInfo');
    if (!userInfoStr) {
      console.error('User info not found in localStorage');
      return [];
    }
    const userInfo = JSON.parse(userInfoStr);
    return processInstances.filter(p => p.createdBy === userInfo.userId);
  }

  // 获取待办任务
  function getPendingTasks() {
    const userInfoStr = dbUtils.get('userInfo');
    if (!userInfoStr) {
      console.error('User info not found in localStorage');
      return [];
    }
    const userInfo = JSON.parse(userInfoStr);
    // 简单处理：如果是管理员则可以审批所有任务
    const roleDataStr = dbUtils.get('roleData');
    const roleData = roleDataStr ? JSON.parse(roleDataStr) : null;
    if (roleData && roleData.roleAuth === 'SUPER') {
      return tasks.filter(t => t.status === 'pending');
    }
    // 否则只显示分配给自己的任务
    return tasks.filter(t => t.status === 'pending' && t.assignedTo === userInfo.userId);
  }

  // 获取已办任务
  function getCompletedTasks() {
    const userInfoStr = dbUtils.get('userInfo');
    if (!userInfoStr) {
      console.error('User info not found in localStorage');
      return [];
    }
    const userInfo = JSON.parse(userInfoStr);
    return tasks.filter(t => t.status !== 'pending' && t.processedBy === userInfo.userId);
  }

  // 获取流程实例详情
  function getProcessInstanceById(processId) {
    return processInstances.find(p => p.id === processId);
  }

  // 获取任务详情
  function getTaskById(taskId) {
    return tasks.find(t => t.id === taskId);
  }

  // 初始化数据
  initData();

  return {
    PROCESS_STATUS,
    TASK_TYPE,
    createProcessInstance,
    submitProcessInstance,
    approveProcess,
    getMyProcessInstances,
    getPendingTasks,
    getCompletedTasks,
    getProcessInstanceById,
    getTaskById
  };
});
