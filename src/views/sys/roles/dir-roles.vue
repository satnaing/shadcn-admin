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

const tableData = ref([])
const fields = reactive([
  // {key: 'checkBox', name: '选择', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'roleName', name: '角色名称', show: true, align: "left", enableSort: false, fixed: false},
  {key: 'roleAuth', name: '角色标识', show: true, align: "left", enableSort: false, fixed: false},
  {key: 'status', name: '状态', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'remark', name: '备注', show: true, align: "center", enableSort: false, fixed: false},
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
        "result": [
          {
            "_id": "64a423816f4197cfc70375e3",
            "roleName": "超级管理员",
            "roleAuth": "SUPER-ADMIN",
            "perms": [
              "*"
            ],
            "remark": "拥有所有权限",
            "status": true,
            "createdAt": "2023-07-04T13:49:53.993Z",
            "updatedAt": "2023-07-04T13:50:42.566Z"
          },
          {
            "_id": "64a426a56f4197cfc70375f6",
            "roleName": "普通管理员",
            "roleAuth": "NORMALL-ADMIN",
            "perms": [
              "index",
              "blog:blog_articles:list",
              "blog:comments:list",
              "blog:messages:list",
              "sys:dictionaries:list",
              "sys:dictionariesvalues:list"
            ],
            "remark": "拥有部分权限",
            "status": true,
            "createdAt": "2023-07-04T14:03:17.858Z",
            "updatedAt": "2023-11-23T04:03:48.650Z"
          },
          {
            "_id": "64a7aa20a971facd04696242",
            "roleName": "访客",
            "roleAuth": "VISITOR-ADMIN",
            "perms": [
              "index",
              "components:echart:chinaMap",
              "components:echart:worldMap",
              "components:echart:line",
              "components:echart:pie",
              "pages",
              "pages:all",
              "dev:icon",
              "dev:codes:list",
              "components:editor",
              "components:editor:Tinymce",
              "components:editor:Vditor",
              "components:editor:VMdEditor",
              "components",
              "components:echart",
              "components:echart:guizhouMap",
              "sys:permissions:list",
              "blog:blog_articles:list",
              "blog:portfolios:list",
              "sys:roles:list",
              "blog:messages:list",
              "sys:dictionaries:list",
              "sys:dictionariesvalues:list",
              "blog:frontendsetups:list",
              "blog:comments:list",
              "sys:visitors:list",
              "sys:users_opt_logs:list",
              "sys:resources:list",
              "sys:users",
              "sys:roles",
              "sys:permissions",
              "sys:resources",
              "sys:visitors",
              "sys:dictionaries",
              "sys:users:list",
              "sys:users:create",
              "sys:users:delete",
              "sys:users:reset",
              "sys:roles:create",
              "sys:roles:delete",
              "sys:roles:update",
              "sys:permissions:create",
              "sys:permissions:delete",
              "sys:permissions:update",
              "sys:permissions:stop",
              "sys:users_opt_logs:create",
              "sys:users_opt_logs:delete",
              "sys:users_opt_logs:update",
              "sys:users_opt_logs:deleteAll",
              "sys:users_opt_logs:export",
              "sys:resources:create",
              "sys:resources:delete",
              "sys:resources:update",
              "sys:visitors:create",
              "sys:visitors:delete",
              "sys:visitors:update",
              "sys:dictionaries:create",
              "sys:dictionaries:delete",
              "sys:dictionaries:update",
              "sys:dictionariesvalues:create",
              "sys:dictionariesvalues:delete",
              "sys:dictionariesvalues:update",
              "dev",
              "dev:codes",
              "dev:codes:singleCurdFrontAndBack",
              "dev:codes:delete",
              "dev:codes:deleteAll",
              "blog:blog_articles",
              "blog:portfolios",
              "blog:messages",
              "blog:frontendsetups",
              "blog:comments",
              "blog:blog_articles:create",
              "blog:blog_articles:delete",
              "blog:blog_articles:update",
              "blog:portfolios:create",
              "blog:portfolios:delete",
              "blog:portfolios:update",
              "blog:messages:create",
              "blog:messages:delete",
              "blog:messages:update",
              "blog:messages:reply",
              "blog:messages:deleteAll",
              "blog:frontendsetups:create",
              "blog:frontendsetups:delete",
              "blog:frontendsetups:update",
              "blog:comments:create",
              "blog:comments:delete",
              "blog:comments:update",
              "blog:comments:deleteAll",
              "blog:anouncements",
              "blog:anouncements:list",
              "blog:anouncements:create",
              "blog:anouncements:delete",
              "blog:anouncements:update",
              "blog",
              "sys:users_opt_logs:import",
              "sys:users_opt_logs",
              "sys"
            ],
            "remark": "一般访客，更多的是有查看权限",
            "status": true,
            "createdAt": "2023-07-07T06:01:04.121Z",
            "updatedAt": "2024-05-27T09:26:12.030Z"
          }
        ],
        "current": 1,
        "pageSize": 10,
        "total": 3
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
      <GetRoles :update-data="tempData.updateData" @close="close"/>
    </ZyElDialog>
    <ZyElDialog :show="tempData.showView"
                title="查看详情"
                @close="close">
      <ViewRoles :update-data="tempData.updateData" @close="close"/>
    </ZyElDialog>

  </section>
</template>

<style scoped lang="scss">

</style>
