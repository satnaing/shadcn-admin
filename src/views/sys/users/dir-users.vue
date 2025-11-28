<script setup>

import {usersList} from "@/api/modules/api.users";
import {TimeUtils} from "utils/util.time";
import {ZyConfirm, ZyNotification} from "@/utils/util.toast.js";
import GetPage from "@/views/components/page/get-page.vue";
import ViewPage from "@/views/components/page/view-page.vue";
import ViewPermissions from "@/views/sys/permissions/view-permissions.vue";
import GetPermissions from "@/views/sys/permissions/get-permissions.vue";
import GetRoles from "@/views/sys/roles/get-roles.vue";
import ViewRoles from "@/views/sys/roles/view-roles.vue";
import GetUsers from "@/views/sys/users/get-users.vue";
import ViewUsers from "@/views/sys/users/view-users.vue";

const tableData = ref([])
const fields = reactive([
  // {key: 'checkBox', name: '选择', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'avatar', name: '头像', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'username', name: '用户名', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'nickname', name: '昵称', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'role[0].roleName', name: '角色', show: true, align: "center", enableSort: false, fixed: false},
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


// 加载列表数据
const getDataList = async () => {
  try {
    loading.value.list = true
    // const dataList = await usersList(query)
    const dataList = {
      data: {
        "result": [
          {
            "_id": "66724424a9b358ece99a82af",
            "username": "admin",
            "nickname": "书中枫叶",
            "password": "$2a$10$OwFwtDsL7ncNF1uTLuluV.ikuu2sOqG3V6JsAgZSMNVhzvlD.Vj76",
            "roleId": "6672431d8e067423d01ca17c",
            "status": true,
            "createdAt": "2024-06-19T02:36:20.600Z",
            "updatedAt": "2024-06-19T03:39:21.246Z",
            "role": [
              {
                "_id": "6672431d8e067423d01ca17c",
                "roleName": "超级管理员",
                "roleAuth": "SUPER",
                "perms": [
                  "*"
                ],
                "status": true,
                "createdAt": "2024-06-19T02:31:57.708Z",
                "updatedAt": "2024-06-19T02:31:57.708Z"
              }
            ]
          },
          {
            "_id": "6673a68f6848a6a2da37fc8d",
            "username": "ZHOUYI123",
            "nickname": "书中枫叶",
            "password": "$2a$10$Ya/pVXZaQ3mJMy.yo27Lw.tnW81kFMsz0LIHF/KVxKwR.1hRX6hv.",
            "roleId": "667243455a75e54067c1715b",
            "status": true,
            "createdAt": "2024-06-20T03:48:31.266Z",
            "updatedAt": "2024-06-20T03:48:31.266Z",
            "role": [
              {
                "_id": "667243455a75e54067c1715b",
                "roleName": "普通管理员",
                "roleAuth": "NORMAL",
                "perms": [
                  "/index",
                  "/sys",
                  "/sys/users",
                  "/sys/users/list",
                  "/sys/users/create",
                  "/sys/menus",
                  "/sys/menus/list",
                  "/sys/menus/create",
                  "/sys/menus/update",
                  "/sys/menus/delete",
                  "/sys/optLogs",
                  "/sys/optLogs/delete",
                  "/sys/optLogs/list",
                  "/sys/optLogs/create",
                  "/sys/optLogs/update"
                ],
                "status": true,
                "createdAt": "2024-06-19T02:32:38.001Z",
                "updatedAt": "2024-06-26T08:58:42.694Z"
              }
            ]
          }
        ],
        "current": 1,
        "pageSize": 15,
        "total": 2
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
    tableData.value = result
    loading.value.list = false
  } catch (e) {
    loading.value.list = false
  }
}
// 修改
const goEdit = (row, title, add) => {
  tempData.showEdit = true
  tempData.updateData = row ? {...row} : {}
  if (add || !row) {
    tempData.updateData.add = true
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
  tempData.updateData = {}
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
              <el-table-column v-else-if="field.key==='avatar'"
                               :label="field.name"
                               :width="field.width"
                               :fixed="field.fixed"
                               :align="field.align">
                <template #default="scope">
                  <div class="flex-center">
                    <el-image style="width: 35px;border-radius: 50%"
                              src="https://q1.qlogo.cn/g?b=qq&nk=2215883082@qq.com&s=100"></el-image>
                  </div>
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
              <el-table-column v-else-if="field.key==='toolButton'"
                               :align="field.align"
                               :label="field.name"
                               :width="field.width"
                               :fixed="field.fixed">
                <template #default="scope">
                  <ZyTableButtons
                      viewAuth="sys:roles:list"
                      editAuth="sys:roles:update"
                      deleteAuth="sys:roles:delete"
                      :showView="false"
                      editText="编辑 / 权限"
                      @view="goView(scope.row)"
                      @edit="goEdit(scope.row)"
                      @delete="goDelete(scope.row)"
                  >
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
        <ZyElPagination
            :currentPage="query.pagination.current"
            :pageSize="query.pagination.pageSize"
            :total="tempData.total"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
        />
      </section>
    </transition>

    <ZyElDialog :show="tempData.showEdit"
                width="40%"
                :title="tempData.dialogTitle"
                @close="close">
      <GetUsers :update-data="tempData.updateData" @close="close"/>
    </ZyElDialog>
    <ZyElDialog :show="tempData.showView"
                title="查看详情"
                @close="close">
      <ViewUsers :update-data="tempData.updateData" @close="close"/>
    </ZyElDialog>

  </section>
</template>

<style scoped lang="scss">

</style>
