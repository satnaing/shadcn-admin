<script setup>

import {usersList} from "@/api/modules/api.users";
import {TimeUtils} from "utils/util.time";
import {ZyConfirm, ZyNotification} from "@/utils/util.toast.js";
import GetPage from "@/views/components/page/get-page.vue";
import ViewPage from "@/views/components/page/view-page.vue";
import ViewPermissions from "@/views/sys/permissions/view-permissions.vue";
import GetPermissions from "@/views/sys/permissions/get-permissions.vue";

const tableData = ref([])
const fields = reactive([
  // {key: 'checkBox', name: '选择', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'name', name: '名称', show: true, align: "left", enableSort: false, fixed: false},
  {key: 'key', name: '权限标识', show: true, align: "left", enableSort: false, fixed: false},
  {key: 'parent_key', name: '父级标识', show: true, align: "left", enableSort: false, fixed: false},
  {key: 'auth', name: '权限按钮', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'status', name: '状态', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'createdAt', name: '创建时间', show: true, align: "center", enableSort: true, fixed: false},
  {key: 'updatedAt', name: '更新时间', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'toolButton', name: '操作', show: true, align: "center", width: '220', enableSort: false, fixed: 'right'},
])
const loading = ref({
  list: false,
  text: '加载中...'
})
// 列表查询参数
const query = reactive({
  params: {},
  pagination: {
    current: 1,
    pageSize: 15
  },
  sort: {
    columnKey: "createdAt",
    order: "ascend"
  }
})

// 查询参数验证逻辑
const queryRule = {}
const tempData = reactive({
  total: 0,
  showView: false,
  showEdit: false,
  dialogTitle: '',
})
// 每页
const sizeChange = (pageSize) => {
  query.pagination.pageSize = pageSize || 15
  goPage(1)
}
// 当前页
const currentChange = (current) => {
  goPage(current)
}
// 排序
const handleSortChange = ({column, prop, order}) => {
  query.sort.order = order
  query.sort.columnKey = prop
  goPage(1)
}
// 表格实例
const datatableRef = ref()
// 表格选择
const handleSelectionChange = (selection) => {
  console.log(datatableRef.value?.tableRef)
  console.log(selection)
}
// 查询
const goPage = (num = 1) => {
  query.pagination.current = num
  getDataList()
}
// 重置
const goReset = () => {
  query.params = {}
  goPage(1)
}

function traverseTree(node) {
  // 处理当前节点
  node.createdAt = TimeUtils.formatTime(node.createdAt)
  node.updatedAt = TimeUtils.formatTime(node.updatedAt)
  // 递归遍历子节点
  if (node.children) {
    node.children.forEach(child => {
      traverseTree(child);
    });
  }
}

// 加载列表数据
const getDataList = async () => {
  try {
    loading.value.list = true
    // const dataList = await usersList(query)
    const dataList = {
      data: {
        current: 1,
        pageSize: 10,
        total: 100,
        result: [
          {
            "_id": "64a6767b2f517ae48b51de4a",
            "name": "首页",
            "key": "index",
            "auth": false,
            "sortOrder": 0,
            "status": true,
            "createdAt": "2023-07-06T08:08:27.735Z",
            "updatedAt": "2023-07-18T03:16:59.334Z",
            "disabled": false
          },
          {
            "_id": "64a676872f517ae48b51de50",
            "name": "系统管理",
            "key": "sys",
            "auth": false,
            "sortOrder": 0,
            "status": true,
            "createdAt": "2023-07-06T08:08:39.650Z",
            "updatedAt": "2023-07-06T13:26:57.493Z",
            "disabled": false,
            "children": [
              {
                "_id": "64a676942f517ae48b51de56",
                "name": "用户管理",
                "key": "sys:users",
                "parent_key": "sys",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "createdAt": "2023-07-06T08:08:52.375Z",
                "updatedAt": "2023-07-07T02:37:51.339Z",
                "disabled": false,
                "children": [
                  {
                    "_id": "64a676a62f517ae48b51de5c",
                    "name": "查询",
                    "key": "sys:users:list",
                    "parent_key": "sys:users",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-06T08:09:10.271Z",
                    "updatedAt": "2023-08-22T01:28:57.225Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a676b72f517ae48b51de62",
                    "name": "增加",
                    "key": "sys:users:create",
                    "parent_key": "sys:users",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-06T08:09:27.173Z",
                    "updatedAt": "2023-07-06T14:41:34.107Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a676ca2f517ae48b51de68",
                    "name": "删除",
                    "key": "sys:users:delete",
                    "parent_key": "sys:users",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-06T08:09:46.180Z",
                    "updatedAt": "2023-07-06T14:41:40.693Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a676d82f517ae48b51de6e",
                    "name": "重置密码",
                    "key": "sys:users:reset",
                    "parent_key": "sys:users",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-06T08:10:00.965Z",
                    "updatedAt": "2023-07-06T14:41:54.406Z",
                    "disabled": false
                  }
                ]
              },
              {
                "_id": "64a6f171d2fac9dd58d3025c",
                "name": "角色管理",
                "key": "sys:roles",
                "parent_key": "sys",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "createdAt": "2023-07-06T16:53:05.026Z",
                "updatedAt": "2023-07-06T16:53:05.026Z",
                "disabled": false,
                "children": [
                  {
                    "_id": "64a6f171d2fac9dd58d3025d",
                    "name": "查询",
                    "key": "sys:roles:list",
                    "parent_key": "sys:roles",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-06T16:53:05.026Z",
                    "updatedAt": "2023-07-06T16:53:05.026Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a6f171d2fac9dd58d3025e",
                    "name": "增加",
                    "key": "sys:roles:create",
                    "parent_key": "sys:roles",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-06T16:53:05.026Z",
                    "updatedAt": "2023-07-06T16:53:05.026Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a6f171d2fac9dd58d3025f",
                    "name": "删除",
                    "key": "sys:roles:delete",
                    "parent_key": "sys:roles",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-06T16:53:05.026Z",
                    "updatedAt": "2023-07-06T16:53:05.026Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a6f171d2fac9dd58d30260",
                    "name": "更新",
                    "key": "sys:roles:update",
                    "parent_key": "sys:roles",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-06T16:53:05.026Z",
                    "updatedAt": "2023-07-06T16:53:05.026Z",
                    "disabled": false
                  }
                ]
              },
              {
                "_id": "64a7799604246540f7286663",
                "name": "权限管理",
                "key": "sys:permissions",
                "parent_key": "sys",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "createdAt": "2023-07-07T02:33:58.142Z",
                "updatedAt": "2023-07-07T02:33:58.142Z",
                "disabled": false,
                "children": [
                  {
                    "_id": "64a6eca8bbab6245325057ee",
                    "name": "查询",
                    "key": "sys:permissions:list",
                    "parent_key": "sys:permissions",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-06T16:32:40.326Z",
                    "updatedAt": "2023-07-06T16:32:40.326Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a6ecc0bbab6245325057f4",
                    "name": "增加",
                    "key": "sys:permissions:create",
                    "parent_key": "sys:permissions",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-06T16:33:04.782Z",
                    "updatedAt": "2023-07-06T16:33:04.782Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a6ecdebbab6245325057fa",
                    "name": "删除",
                    "key": "sys:permissions:delete",
                    "parent_key": "sys:permissions",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-06T16:33:34.613Z",
                    "updatedAt": "2023-07-06T16:33:34.613Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a6ecffbbab624532505800",
                    "name": "修改",
                    "key": "sys:permissions:update",
                    "parent_key": "sys:permissions",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-06T16:34:07.219Z",
                    "updatedAt": "2023-07-06T16:34:07.219Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a77a0104246540f7286681",
                    "name": "停用",
                    "key": "sys:permissions:stop",
                    "parent_key": "sys:permissions",
                    "auth": true,
                    "sortOrder": null,
                    "status": true,
                    "createdAt": "2023-07-07T02:35:45.300Z",
                    "updatedAt": "2023-07-07T02:35:45.300Z",
                    "disabled": false
                  }
                ]
              },
              {
                "_id": "64a7cbe6b85fe16110610cf5",
                "name": "操作日志",
                "key": "sys:users_opt_logs",
                "parent_key": "sys",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "createdAt": "2023-07-07T08:25:10.645Z",
                "updatedAt": "2023-07-07T08:25:10.645Z",
                "disabled": false,
                "children": [
                  {
                    "_id": "64a7cbe6b85fe16110610cf6",
                    "name": "查询",
                    "key": "sys:users_opt_logs:list",
                    "parent_key": "sys:users_opt_logs",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T08:25:10.645Z",
                    "updatedAt": "2023-07-07T08:25:10.645Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a7cbe6b85fe16110610cf7",
                    "name": "增加",
                    "key": "sys:users_opt_logs:create",
                    "parent_key": "sys:users_opt_logs",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T08:25:10.645Z",
                    "updatedAt": "2023-07-07T08:25:10.645Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a7cbe6b85fe16110610cf8",
                    "name": "删除",
                    "key": "sys:users_opt_logs:delete",
                    "parent_key": "sys:users_opt_logs",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T08:25:10.645Z",
                    "updatedAt": "2023-07-07T08:25:10.645Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a7cbe6b85fe16110610cf9",
                    "name": "更新",
                    "key": "sys:users_opt_logs:update",
                    "parent_key": "sys:users_opt_logs",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T08:25:10.645Z",
                    "updatedAt": "2023-07-07T08:25:10.645Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a7d30aacc04191a405fb61",
                    "name": "批量删除",
                    "key": "sys:users_opt_logs:deleteAll",
                    "parent_key": "sys:users_opt_logs",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T08:55:38.696Z",
                    "updatedAt": "2023-07-09T13:57:08.966Z",
                    "disabled": false
                  },
                  {
                    "_id": "64aabc5804fd30a2ac31c2a9",
                    "name": "导出",
                    "key": "sys:users_opt_logs:export",
                    "parent_key": "sys:users_opt_logs",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-07-09T13:55:36.412Z",
                    "updatedAt": "2023-07-09T13:55:36.412Z"
                  },
                  {
                    "_id": "64aabc6b04fd30a2ac31c2b5",
                    "name": "导入",
                    "key": "sys:users_opt_logs:import",
                    "parent_key": "sys:users_opt_logs",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-07-09T13:55:55.856Z",
                    "updatedAt": "2023-07-09T13:55:55.856Z"
                  }
                ]
              },
              {
                "_id": "64b4c7dad6ac9bf24cecc6d1",
                "name": "资源管理",
                "key": "sys:resources",
                "parent_key": "sys",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "disabled": false,
                "createdAt": "2023-07-17T04:47:22.912Z",
                "updatedAt": "2023-07-17T04:47:22.912Z",
                "children": [
                  {
                    "_id": "64b4c7dad6ac9bf24cecc6d2",
                    "name": "查询",
                    "key": "sys:resources:list",
                    "parent_key": "sys:resources",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-07-17T04:47:22.913Z",
                    "updatedAt": "2023-07-17T04:47:22.913Z"
                  },
                  {
                    "_id": "64b4c7dad6ac9bf24cecc6d3",
                    "name": "增加",
                    "key": "sys:resources:create",
                    "parent_key": "sys:resources",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-07-17T04:47:22.913Z",
                    "updatedAt": "2023-07-17T04:47:22.913Z"
                  },
                  {
                    "_id": "64b4c7dad6ac9bf24cecc6d4",
                    "name": "删除",
                    "key": "sys:resources:delete",
                    "parent_key": "sys:resources",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-07-17T04:47:22.913Z",
                    "updatedAt": "2023-07-17T04:47:22.913Z"
                  },
                  {
                    "_id": "64b4c7dad6ac9bf24cecc6d5",
                    "name": "更新",
                    "key": "sys:resources:update",
                    "parent_key": "sys:resources",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-07-17T04:47:22.913Z",
                    "updatedAt": "2023-07-17T04:47:22.913Z"
                  }
                ]
              },
              {
                "_id": "64d4a6d9f8b9690fab537f02",
                "name": "访客记录",
                "key": "sys:visitors",
                "parent_key": "sys",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "disabled": false,
                "createdAt": "2023-08-10T08:59:05.870Z",
                "updatedAt": "2023-08-10T08:59:05.870Z",
                "children": [
                  {
                    "_id": "64d4a6d9f8b9690fab537f03",
                    "name": "查询",
                    "key": "sys:visitors:list",
                    "parent_key": "sys:visitors",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-10T08:59:05.870Z",
                    "updatedAt": "2023-08-10T08:59:05.870Z"
                  },
                  {
                    "_id": "64d4a6d9f8b9690fab537f04",
                    "name": "增加",
                    "key": "sys:visitors:create",
                    "parent_key": "sys:visitors",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-10T08:59:05.871Z",
                    "updatedAt": "2023-08-10T08:59:05.871Z"
                  },
                  {
                    "_id": "64d4a6d9f8b9690fab537f05",
                    "name": "删除",
                    "key": "sys:visitors:delete",
                    "parent_key": "sys:visitors",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-10T08:59:05.871Z",
                    "updatedAt": "2023-08-10T08:59:05.871Z"
                  },
                  {
                    "_id": "64d4a6d9f8b9690fab537f06",
                    "name": "更新",
                    "key": "sys:visitors:update",
                    "parent_key": "sys:visitors",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-10T08:59:05.871Z",
                    "updatedAt": "2023-08-10T08:59:05.871Z"
                  }
                ]
              },
              {
                "_id": "6509b7827efd16fb4d8e384e",
                "name": "数据字典",
                "key": "sys:dictionaries",
                "parent_key": "sys",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "disabled": false,
                "createdAt": "2023-09-19T15:00:18.192Z",
                "updatedAt": "2023-09-19T15:00:18.192Z",
                "children": [
                  {
                    "_id": "6509b7827efd16fb4d8e384f",
                    "name": "查询",
                    "key": "sys:dictionaries:list",
                    "parent_key": "sys:dictionaries",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:00:18.192Z",
                    "updatedAt": "2023-09-19T15:00:18.192Z"
                  },
                  {
                    "_id": "6509b7827efd16fb4d8e3850",
                    "name": "增加",
                    "key": "sys:dictionaries:create",
                    "parent_key": "sys:dictionaries",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:00:18.192Z",
                    "updatedAt": "2023-09-19T15:00:18.192Z"
                  },
                  {
                    "_id": "6509b7827efd16fb4d8e3851",
                    "name": "删除",
                    "key": "sys:dictionaries:delete",
                    "parent_key": "sys:dictionaries",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:00:18.192Z",
                    "updatedAt": "2023-09-19T15:00:18.192Z"
                  },
                  {
                    "_id": "6509b7827efd16fb4d8e3852",
                    "name": "更新",
                    "key": "sys:dictionaries:update",
                    "parent_key": "sys:dictionaries",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:00:18.192Z",
                    "updatedAt": "2023-09-19T15:00:18.192Z"
                  },
                  {
                    "_id": "6509b7bf7efd16fb4d8e385d",
                    "name": "字典类型查询",
                    "key": "sys:dictionariesvalues:list",
                    "parent_key": "sys:dictionaries",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:01:19.834Z",
                    "updatedAt": "2023-09-19T15:01:19.834Z"
                  },
                  {
                    "_id": "6509b7bf7efd16fb4d8e385e",
                    "name": "字典类型增加",
                    "key": "sys:dictionariesvalues:create",
                    "parent_key": "sys:dictionaries",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:01:19.834Z",
                    "updatedAt": "2023-09-19T15:01:19.834Z"
                  },
                  {
                    "_id": "6509b7bf7efd16fb4d8e385f",
                    "name": "字典类型删除",
                    "key": "sys:dictionariesvalues:delete",
                    "parent_key": "sys:dictionaries",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:01:19.834Z",
                    "updatedAt": "2023-09-19T15:01:19.834Z"
                  },
                  {
                    "_id": "6509b7bf7efd16fb4d8e3860",
                    "name": "字典类型更新",
                    "key": "sys:dictionariesvalues:update",
                    "parent_key": "sys:dictionaries",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:01:19.834Z",
                    "updatedAt": "2023-09-19T15:01:19.834Z"
                  }
                ]
              }
            ]
          },
          {
            "_id": "64a6bce2210858fb6ec32f55",
            "name": "开发工具",
            "key": "dev",
            "auth": false,
            "sortOrder": 0,
            "status": true,
            "createdAt": "2023-07-06T13:08:50.188Z",
            "updatedAt": "2023-07-06T13:27:34.278Z",
            "disabled": false,
            "children": [
              {
                "_id": "64a6ec18bbab6245325057dc",
                "name": "图标列表",
                "key": "dev:icon",
                "parent_key": "dev",
                "auth": false,
                "sortOrder": 1,
                "status": true,
                "createdAt": "2023-07-06T16:30:16.901Z",
                "updatedAt": "2023-07-07T03:22:12.747Z",
                "disabled": false
              },
              {
                "_id": "64a784d104a94eaa96595abb",
                "name": "代码生成",
                "key": "dev:codes",
                "parent_key": "dev",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "createdAt": "2023-07-07T03:21:53.616Z",
                "updatedAt": "2023-07-07T03:21:53.616Z",
                "disabled": false,
                "children": [
                  {
                    "_id": "64a784d104a94eaa96595abc",
                    "name": "查询",
                    "key": "dev:codes:list",
                    "parent_key": "dev:codes",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T03:21:53.616Z",
                    "updatedAt": "2023-07-07T03:21:53.616Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a784d104a94eaa96595abd",
                    "name": "创建",
                    "key": "dev:codes:singleCurdFrontAndBack",
                    "parent_key": "dev:codes",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T03:21:53.616Z",
                    "updatedAt": "2023-07-07T05:28:34.029Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a784d104a94eaa96595abe",
                    "name": "删除",
                    "key": "dev:codes:delete",
                    "parent_key": "dev:codes",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T03:21:53.617Z",
                    "updatedAt": "2023-07-07T03:21:53.617Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a784d104a94eaa96595abf",
                    "name": "批量删除",
                    "key": "dev:codes:deleteAll",
                    "parent_key": "dev:codes",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T03:21:53.617Z",
                    "updatedAt": "2023-07-07T05:28:50.417Z",
                    "disabled": false
                  }
                ]
              }
            ]
          },
          {
            "_id": "64a7a633f97cdac3cb1bbbcf",
            "name": "页面示例",
            "key": "pages",
            "auth": false,
            "sortOrder": 0,
            "status": true,
            "createdAt": "2023-07-07T05:44:19.405Z",
            "updatedAt": "2023-07-07T05:44:19.405Z",
            "disabled": false,
            "children": [
              {
                "_id": "64a7a9dda971facd04696235",
                "name": "综合页面",
                "key": "pages:all",
                "parent_key": "pages",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "createdAt": "2023-07-07T05:59:57.159Z",
                "updatedAt": "2023-07-07T05:59:57.159Z",
                "disabled": false
              }
            ]
          },
          {
            "_id": "64a7a67af97cdac3cb1bbbee",
            "name": "组件示例",
            "key": "components",
            "auth": false,
            "sortOrder": 0,
            "status": true,
            "createdAt": "2023-07-07T05:45:30.168Z",
            "updatedAt": "2023-07-07T05:45:30.168Z",
            "disabled": false,
            "children": [
              {
                "_id": "64a7a695f97cdac3cb1bbbf4",
                "name": "图表地图",
                "key": "components:echart",
                "parent_key": "components",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "createdAt": "2023-07-07T05:45:57.351Z",
                "updatedAt": "2023-07-07T05:45:57.351Z",
                "disabled": false,
                "children": [
                  {
                    "_id": "64a7a695f97cdac3cb1bbbf5",
                    "name": "贵州地图",
                    "key": "components:echart:guizhouMap",
                    "parent_key": "components:echart",
                    "auth": false,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T05:45:57.351Z",
                    "updatedAt": "2023-07-07T05:46:19.623Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a7a695f97cdac3cb1bbbf6",
                    "name": "中国地图",
                    "key": "components:echart:chinaMap",
                    "parent_key": "components:echart",
                    "auth": false,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T05:45:57.351Z",
                    "updatedAt": "2023-07-07T05:46:33.902Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a7a695f97cdac3cb1bbbf7",
                    "name": "世界地图",
                    "key": "components:echart:worldMap",
                    "parent_key": "components:echart",
                    "auth": false,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T05:45:57.351Z",
                    "updatedAt": "2023-07-07T05:46:44.697Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a7a695f97cdac3cb1bbbf8",
                    "name": "折线图",
                    "key": "components:echart:line",
                    "parent_key": "components:echart",
                    "auth": false,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T05:45:57.352Z",
                    "updatedAt": "2023-07-07T05:46:56.584Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a7a6e1f97cdac3cb1bbc16",
                    "name": "饼图",
                    "key": "components:echart:pie",
                    "parent_key": "components:echart",
                    "auth": false,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T05:47:13.846Z",
                    "updatedAt": "2023-07-07T05:47:20.216Z",
                    "disabled": false
                  }
                ]
              },
              {
                "_id": "64a7ab9da971facd04696299",
                "name": "富文本",
                "key": "components:editor",
                "parent_key": "components",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "createdAt": "2023-07-07T06:07:25.737Z",
                "updatedAt": "2023-07-07T06:07:25.737Z",
                "disabled": false,
                "children": [
                  {
                    "_id": "64a7abb7a971facd0469629f",
                    "name": "Tinymce",
                    "key": "components:editor:Tinymce",
                    "parent_key": "components:editor",
                    "auth": false,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T06:07:51.383Z",
                    "updatedAt": "2023-07-07T06:08:04.393Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a7abe1a971facd046962ab",
                    "name": "Vditor",
                    "key": "components:editor:Vditor",
                    "parent_key": "components:editor",
                    "auth": false,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T06:08:33.975Z",
                    "updatedAt": "2023-07-07T06:08:33.975Z",
                    "disabled": false
                  },
                  {
                    "_id": "64a7abefa971facd046962b1",
                    "name": "VMdEditor",
                    "key": "components:editor:VMdEditor",
                    "parent_key": "components:editor",
                    "auth": false,
                    "sortOrder": 0,
                    "status": true,
                    "createdAt": "2023-07-07T06:08:47.735Z",
                    "updatedAt": "2023-07-07T06:08:47.735Z",
                    "disabled": false
                  }
                ]
              }
            ]
          },
          {
            "_id": "64cfada9c3794728bc32ac40",
            "name": "博客管理",
            "key": "blog",
            "auth": false,
            "sortOrder": 0,
            "status": true,
            "disabled": false,
            "createdAt": "2023-08-06T14:26:49.389Z",
            "updatedAt": "2023-08-06T14:26:49.389Z",
            "children": [
              {
                "_id": "64cfade2c3794728bc32ac4c",
                "name": "博文管理",
                "key": "blog:blog_articles",
                "parent_key": "blog",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "disabled": false,
                "createdAt": "2023-08-06T14:27:46.488Z",
                "updatedAt": "2023-08-06T14:27:46.488Z",
                "children": [
                  {
                    "_id": "64cfade2c3794728bc32ac4d",
                    "name": "查询",
                    "key": "blog:blog_articles:list",
                    "parent_key": "blog:blog_articles",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-06T14:27:46.488Z",
                    "updatedAt": "2023-08-06T14:27:46.488Z"
                  },
                  {
                    "_id": "64cfade2c3794728bc32ac4e",
                    "name": "增加",
                    "key": "blog:blog_articles:create",
                    "parent_key": "blog:blog_articles",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-06T14:27:46.489Z",
                    "updatedAt": "2023-08-06T14:27:46.489Z"
                  },
                  {
                    "_id": "64cfade2c3794728bc32ac4f",
                    "name": "删除",
                    "key": "blog:blog_articles:delete",
                    "parent_key": "blog:blog_articles",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-06T14:27:46.489Z",
                    "updatedAt": "2023-08-06T14:27:46.489Z"
                  },
                  {
                    "_id": "64cfade2c3794728bc32ac50",
                    "name": "更新",
                    "key": "blog:blog_articles:update",
                    "parent_key": "blog:blog_articles",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-06T14:27:46.489Z",
                    "updatedAt": "2023-08-06T14:27:46.489Z"
                  }
                ]
              },
              {
                "_id": "64cfae09c3794728bc32ac5c",
                "name": "作品管理",
                "key": "blog:portfolios",
                "parent_key": "blog",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "disabled": false,
                "createdAt": "2023-08-06T14:28:25.623Z",
                "updatedAt": "2023-08-06T14:28:25.623Z",
                "children": [
                  {
                    "_id": "64cfae09c3794728bc32ac5d",
                    "name": "查询",
                    "key": "blog:portfolios:list",
                    "parent_key": "blog:portfolios",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-06T14:28:25.623Z",
                    "updatedAt": "2023-08-06T14:28:25.623Z"
                  },
                  {
                    "_id": "64cfae09c3794728bc32ac5e",
                    "name": "增加",
                    "key": "blog:portfolios:create",
                    "parent_key": "blog:portfolios",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-06T14:28:25.623Z",
                    "updatedAt": "2023-08-06T14:28:25.623Z"
                  },
                  {
                    "_id": "64cfae09c3794728bc32ac5f",
                    "name": "删除",
                    "key": "blog:portfolios:delete",
                    "parent_key": "blog:portfolios",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-06T14:28:25.623Z",
                    "updatedAt": "2023-08-06T14:28:25.623Z"
                  },
                  {
                    "_id": "64cfae09c3794728bc32ac60",
                    "name": "更新",
                    "key": "blog:portfolios:update",
                    "parent_key": "blog:portfolios",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-06T14:28:25.624Z",
                    "updatedAt": "2023-08-06T14:28:25.624Z"
                  }
                ]
              },
              {
                "_id": "64d1d19153d1c684a73c8412",
                "name": "留言管理",
                "key": "blog:messages",
                "parent_key": "blog",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "disabled": false,
                "createdAt": "2023-08-08T05:24:33.901Z",
                "updatedAt": "2023-08-08T05:24:33.901Z",
                "children": [
                  {
                    "_id": "64d1d19153d1c684a73c8413",
                    "name": "查询",
                    "key": "blog:messages:list",
                    "parent_key": "blog:messages",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-08T05:24:33.901Z",
                    "updatedAt": "2023-08-08T05:24:33.901Z"
                  },
                  {
                    "_id": "64d1d19153d1c684a73c8414",
                    "name": "增加",
                    "key": "blog:messages:create",
                    "parent_key": "blog:messages",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-08T05:24:33.902Z",
                    "updatedAt": "2023-08-08T05:24:33.902Z"
                  },
                  {
                    "_id": "64d1d19153d1c684a73c8415",
                    "name": "删除",
                    "key": "blog:messages:delete",
                    "parent_key": "blog:messages",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-08T05:24:33.902Z",
                    "updatedAt": "2023-08-08T05:24:33.902Z"
                  },
                  {
                    "_id": "64d1d19153d1c684a73c8416",
                    "name": "更新",
                    "key": "blog:messages:update",
                    "parent_key": "blog:messages",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-08T05:24:33.902Z",
                    "updatedAt": "2023-08-08T05:24:33.902Z"
                  },
                  {
                    "_id": "64eef85fa0d58a3cda8ce53f",
                    "name": "回复",
                    "key": "blog:messages:reply",
                    "parent_key": "blog:messages",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-08-30T08:05:51.963Z",
                    "updatedAt": "2023-08-30T08:06:33.791Z"
                  },
                  {
                    "_id": "6509b94d7efd16fb4d8e38b7",
                    "name": "清除所有留言",
                    "key": "blog:messages:deleteAll",
                    "parent_key": "blog:messages",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:07:57.376Z",
                    "updatedAt": "2023-09-19T15:07:57.376Z"
                  }
                ]
              },
              {
                "_id": "6509b8667efd16fb4d8e386e",
                "name": "前台管理",
                "key": "blog:frontendsetups",
                "parent_key": "blog",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "disabled": false,
                "createdAt": "2023-09-19T15:04:06.719Z",
                "updatedAt": "2023-09-19T15:04:06.719Z",
                "children": [
                  {
                    "_id": "6509b8667efd16fb4d8e386f",
                    "name": "查询",
                    "key": "blog:frontendsetups:list",
                    "parent_key": "blog:frontendsetups",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:04:06.720Z",
                    "updatedAt": "2023-09-19T15:04:06.720Z"
                  },
                  {
                    "_id": "6509b8667efd16fb4d8e3870",
                    "name": "增加",
                    "key": "blog:frontendsetups:create",
                    "parent_key": "blog:frontendsetups",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:04:06.720Z",
                    "updatedAt": "2023-09-19T15:04:06.720Z"
                  },
                  {
                    "_id": "6509b8667efd16fb4d8e3871",
                    "name": "删除",
                    "key": "blog:frontendsetups:delete",
                    "parent_key": "blog:frontendsetups",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:04:06.720Z",
                    "updatedAt": "2023-09-19T15:04:06.720Z"
                  },
                  {
                    "_id": "6509b8667efd16fb4d8e3872",
                    "name": "更新",
                    "key": "blog:frontendsetups:update",
                    "parent_key": "blog:frontendsetups",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:04:06.720Z",
                    "updatedAt": "2023-09-19T15:04:06.720Z"
                  }
                ]
              },
              {
                "_id": "6509b8967efd16fb4d8e387c",
                "name": "博文评论",
                "key": "blog:comments",
                "parent_key": "blog",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "disabled": false,
                "createdAt": "2023-09-19T15:04:54.559Z",
                "updatedAt": "2023-09-19T15:04:54.559Z",
                "children": [
                  {
                    "_id": "6509b8967efd16fb4d8e387d",
                    "name": "查询",
                    "key": "blog:comments:list",
                    "parent_key": "blog:comments",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:04:54.559Z",
                    "updatedAt": "2023-09-19T15:04:54.559Z"
                  },
                  {
                    "_id": "6509b8967efd16fb4d8e387e",
                    "name": "增加",
                    "key": "blog:comments:create",
                    "parent_key": "blog:comments",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:04:54.559Z",
                    "updatedAt": "2023-09-19T15:04:54.559Z"
                  },
                  {
                    "_id": "6509b8967efd16fb4d8e387f",
                    "name": "删除",
                    "key": "blog:comments:delete",
                    "parent_key": "blog:comments",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:04:54.559Z",
                    "updatedAt": "2023-09-19T15:04:54.559Z"
                  },
                  {
                    "_id": "6509b8967efd16fb4d8e3880",
                    "name": "更新",
                    "key": "blog:comments:update",
                    "parent_key": "blog:comments",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:04:54.559Z",
                    "updatedAt": "2023-09-19T15:04:54.559Z"
                  },
                  {
                    "_id": "6509b9207efd16fb4d8e38a3",
                    "name": "清除所有评论",
                    "key": "blog:comments:deleteAll",
                    "parent_key": "blog:comments",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-09-19T15:07:12.869Z",
                    "updatedAt": "2023-09-19T15:07:28.770Z"
                  }
                ]
              },
              {
                "_id": "6526b4d429ab376fbabf23e1",
                "name": "公告管理",
                "key": "blog:anouncements",
                "parent_key": "blog",
                "auth": false,
                "sortOrder": 0,
                "status": true,
                "disabled": false,
                "createdAt": "2023-10-11T14:44:36.434Z",
                "updatedAt": "2023-10-11T14:44:36.434Z",
                "children": [
                  {
                    "_id": "6526b4d429ab376fbabf23e2",
                    "name": "查询",
                    "key": "blog:anouncements:list",
                    "parent_key": "blog:anouncements",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-10-11T14:44:36.434Z",
                    "updatedAt": "2023-10-11T14:44:36.434Z"
                  },
                  {
                    "_id": "6526b4d429ab376fbabf23e3",
                    "name": "增加",
                    "key": "blog:anouncements:create",
                    "parent_key": "blog:anouncements",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-10-11T14:44:36.434Z",
                    "updatedAt": "2023-10-11T14:44:36.434Z"
                  },
                  {
                    "_id": "6526b4d429ab376fbabf23e4",
                    "name": "删除",
                    "key": "blog:anouncements:delete",
                    "parent_key": "blog:anouncements",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-10-11T14:44:36.434Z",
                    "updatedAt": "2023-10-11T14:44:36.434Z"
                  },
                  {
                    "_id": "6526b4d429ab376fbabf23e5",
                    "name": "更新",
                    "key": "blog:anouncements:update",
                    "parent_key": "blog:anouncements",
                    "auth": true,
                    "sortOrder": 0,
                    "status": true,
                    "disabled": false,
                    "createdAt": "2023-10-11T14:44:36.434Z",
                    "updatedAt": "2023-10-11T14:44:36.434Z"
                  }
                ]
              }
            ]
          }
        ]
      }
    }
    const {current, pageSize, result, total} = dataList.data
    query.pagination.current = current
    query.pagination.pageSize = pageSize
    tempData.total = total
    for (const data of result) {
      data.createdAt = TimeUtils.formatTime(data.createdAt)
      data.updatedAt = TimeUtils.formatTime(data.updatedAt)
    }
    result.forEach(node => {
      traverseTree(node);
    });
    tableData.value = result
    loading.value.list = false
  } catch (e) {
    loading.value.list = false
  }
}
// 修改
const goEdit = (row, title,add) => {
  tempData.showEdit = true
  tempData.updateData = row ? {...row} : {}
  if (add || !row){
    tempData.updateData.add=true
  }
  tempData.dialogTitle = title ? title : row ? '修改' : '新增'
}
// 删除
const goDelete = (row) => {
  ZyConfirm('确认删除该条数据？').then(ok => {
    // ok && fwsbRemove(row.id).then(res => {
    //   if (res.data) {
    //     goPage(1)
    //     ZyNotification.success('删除成功！')
    //   }
    // })
  })
}
// 详情
const goView = (row) => {
  tempData.updateData = row
  tempData.showView = true
}

// 关闭
const close = (_t) => {
  tempData.showView = false
  tempData.showEdit = false
  tempData.updateData={}
  _t && goPage(1)
}

goPage(1)
</script>

<template>
  <section>
    <transition
        enter-active-class="animate__animated animate__fadeIn"
        mode="out-in"
    >
      <section>
        <ZyTableQueryForm
            :ruleForm="query.params"
            :rules="queryRule"
            @query="goPage(1)"
            @reset="goReset"
        >
          <el-form-item prop="name">
            <el-input v-model="query.params.name" clearable @change="goPage(1)" placeholder="权限名称查询"/>
          </el-form-item>
        </ZyTableQueryForm>
        <ZyTableFilter :fields="fields"
                       :showDelete="false"
                       @add="goEdit"/>
        <ZyElTable :datas="tableData"
                   ref="datatableRef"
                   :loading="loading.list"
                   :loading-txt="loading.text"
                   @sortChange="handleSortChange"
                   @selectionChange="handleSelectionChange"
        >
          <template v-for="field in fields" :key="field.key">
            <template v-if="field.show">
              <el-table-column v-if="field.key==='checkBox'"
                               :align="field.align"
                               type="selection"></el-table-column>
              <el-table-column v-else-if="field.key==='auth'"
                               :label="field.name"
                               :width="field.width"
                               :fixed="field.fixed"
                               :align="field.align">
                <template #default="scope">
                  <el-tag :type="scope.row.auth?'success':'info'">{{ scope.row.auth ? '是' : '否' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column v-else-if="field.key==='status'"
                               :label="field.name"
                               :width="field.width"
                               :fixed="field.fixed"
                               :align="field.align">
                <template #default="scope">
                  <el-switch
                      active-text="正常"
                      inactive-text="停用"
                      v-model="scope.row.status"></el-switch>
                </template>
              </el-table-column>
              <el-table-column v-else-if="field.key==='key'"
                               :label="field.name"
                               :width="field.width"
                               :fixed="field.fixed"
                               :align="field.align">
                <template #default="scope">
                  <el-tag v-if="scope.row.key">{{ scope.row.key }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column v-else-if="field.key==='parent_key'"
                               :label="field.name"
                               :width="field.width"
                               :fixed="field.fixed"
                               :align="field.align">
                <template #default="scope">
                  <el-tag v-if="scope.row.parent_key">{{ scope.row.parent_key }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column v-else-if="field.key==='toolButton'"
                               :align="field.align"
                               :label="field.name"
                               :width="field.width"
                               :fixed="field.fixed">
                <template #default="scope">
                  <ZyTableButtons
                      viewAuth="sys:users:list"
                      editAuth="sys:users:update"
                      deleteAuth="sys:users:delete"
                      :showView="false"
                      @view="goView(scope.row)"
                      @edit="goEdit(scope.row)"
                      @delete="goDelete(scope.row)"
                  >
                    <el-button type="primary" @click="goEdit(scope.row,'新增下级','add')">新增下级</el-button>
                  </ZyTableButtons>
                </template>
              </el-table-column>
              <el-table-column
                  v-else
                  show-overflow-tooltip
                  :prop="field.key"
                  :align="field.align"
                  :label="field.name"
                  :width="field.width"
                  :sortable="field.enableSort?'custom':false"
                  :fixed="field.fixed"
              ></el-table-column>
            </template>
          </template>
        </ZyElTable>
        <!--        <ZyElPagination-->
        <!--            :currentPage="query.pagination.current"-->
        <!--            :pageSize="query.pagination.pageSize"-->
        <!--            :total="tempData.total"-->
        <!--            @sizeChange="sizeChange"-->
        <!--            @currentChange="currentChange"-->
        <!--        />-->
      </section>
    </transition>

    <ZyElDialog :show="tempData.showEdit"
                width="40%"
                :title="tempData.dialogTitle"
                @close="close">
      <GetPermissions :update-data="tempData.updateData" @close="close"/>
    </ZyElDialog>
    <ZyElDialog :show="tempData.showView"
                title="查看详情"
                @close="close">
      <ViewPermissions :update-data="tempData.updateData" @close="close"/>
    </ZyElDialog>

  </section>
</template>

<style scoped lang="scss">

</style>
