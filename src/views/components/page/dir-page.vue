<script setup>

import {usersList} from "@/api/modules/api.users";
import {TimeUtils} from "utils/util.time";
import {ZyConfirm, ZyNotification} from "@/utils/util.toast.js";
import GetPage from "@/views/components/page/get-page.vue";
import ViewPage from "@/views/components/page/view-page.vue";

const tableData = ref([])
const fields = reactive([
  {key: 'checkBox', name: '选择', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'username', name: '用户名', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'nickname', name: '昵称', show: true, align: "center", enableSort: false, fixed: false},
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
    const dataList = await usersList(query)
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
const goEdit = (row) => {
  tempData.showEdit = true
  tempData.updateData = row ? {...row} : null
  tempData.dialogTitle = row ? '修改' : '新增'
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
          <el-form-item prop="username">
            <el-input v-model="query.params.username" clearable @change="goPage(1)" placeholder="输入用户名查询"/>
          </el-form-item>
        </ZyTableQueryForm>
        <ZyTableFilter :fields="fields"
                       :showDelete="true"
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
                      @view="goView(scope.row)"
                      @edit="goEdit(scope.row)"
                      @delete="goDelete(scope.row)"
                  />
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
                :title="tempData.dialogTitle"
                @close="close">
      <GetPage :update-data="tempData.updateData" @close="close"/>
    </ZyElDialog>
    <ZyElDialog :show="tempData.showView"
                title="查看详情"
                @close="close">
      <ViewPage :update-data="tempData.updateData" @close="close"/>
    </ZyElDialog>

  </section>
</template>

<style scoped lang="scss">

</style>
