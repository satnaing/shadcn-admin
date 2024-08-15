<script setup>

import {TimeUtils} from "utils/util.time";
import {ZyConfirm, ZyNotification} from "@/utils/util.toast.js";

const tableData = ref([])
const fields = reactive([
  {key: 'checkBox', name: '选择', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'loginName', name: '登录用户', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'ipAddress', name: '登录IP', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'loginAddress', name: '登录地址', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'deviceName', name: '设备名称', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'browser', name: '浏览器', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'os', name: '操作系统', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'loginStatus', name: '登录状态', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'message', name: '登录信息', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'loginTime', name: '登录时间', show: true, align: "center", enableSort: false, fixed: false},
  {key: 'toolButton', name: '操作', show: true, align: "center", width: '', enableSort: false, fixed: 'right'},
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
    pageSize: 10
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
      data:{
        "result": [
          {
            "loginId": "1823939175027068929",
            "loginName": "ZHOUYI",
            "deviceName": "MOBILE",
            "ipAddress": "183.46.199.20",
            "loginAddress": "中国广东省汕头市",
            "browser": "Chrome Mobile",
            "os": "Android 1.x",
            "loginStatus": "0",
            "message": "登录成功",
            "loginTime": "2024-08-15 12:26:01"
          },
          {
            "loginId": "1823930085680893954",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "183.36.5.18",
            "loginAddress": "中国广东省深圳市",
            "browser": "Chrome 12",
            "os": "Windows 10",
            "loginStatus": "0",
            "message": "登录成功",
            "loginTime": "2024-08-15 11:49:54"
          },
          {
            "loginId": "1823928903465979906",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "219.139.130.238",
            "loginAddress": "中国湖北省宜昌市",
            "browser": "Chrome 12",
            "os": "Windows 10",
            "loginStatus": "0",
            "message": "登录成功",
            "loginTime": "2024-08-15 11:45:12"
          },
          {
            "loginId": "1823928566722088961",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "125.40.11.244",
            "loginAddress": "中国河南省郑州市",
            "browser": "Chrome 12",
            "os": "Windows 10",
            "loginStatus": "0",
            "message": "登录成功",
            "loginTime": "2024-08-15 11:43:52"
          },
          {
            "loginId": "1823924507202048002",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "124.200.100.14",
            "loginAddress": "中国北京北京市",
            "browser": "Chrome 11",
            "os": "Windows 10",
            "loginStatus": "0",
            "message": "登录成功",
            "loginTime": "2024-08-15 11:27:44"
          },
          {
            "loginId": "1823919286585413634",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "49.84.120.58",
            "loginAddress": "中国江苏省徐州市",
            "browser": "Chrome 12",
            "os": "Windows 10",
            "loginStatus": "1",
            "message": "登录失败",
            "loginTime": "2024-08-15 11:06:59"
          },
          {
            "loginId": "1823918517329088514",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "27.156.106.227",
            "loginAddress": "中国福建省福州市",
            "browser": "Chrome 12",
            "os": "Windows 10",
            "loginStatus": "0",
            "message": "登录成功",
            "loginTime": "2024-08-15 11:03:56"
          },
          {
            "loginId": "1823916527660322817",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "49.84.120.58",
            "loginAddress": "中国江苏省徐州市",
            "browser": "Chrome 12",
            "os": "Windows 10",
            "loginStatus": "0",
            "message": "登录成功",
            "loginTime": "2024-08-15 10:56:02"
          },
          {
            "loginId": "1823916100910862338",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "223.104.40.81",
            "loginAddress": "中国北京北京市",
            "browser": "Chrome 11",
            "os": "Windows 10",
            "loginStatus": "0",
            "message": "登录成功",
            "loginTime": "2024-08-15 10:54:20"
          },
          {
            "loginId": "1823913492376735746",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "27.156.106.227",
            "loginAddress": "中国福建省福州市",
            "browser": "Chrome 12",
            "os": "Windows 10",
            "loginStatus": "0",
            "message": "登录成功",
            "loginTime": "2024-08-15 10:43:58"
          },
          {
            "loginId": "1823907673694294017",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "14.145.141.234",
            "loginAddress": "中国广东省广州市",
            "browser": "Chrome 12",
            "os": "Windows 10",
            "loginStatus": "0",
            "message": "登录成功",
            "loginTime": "2024-08-15 10:20:51"
          },
          {
            "loginId": "1823905243141263361",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "121.231.128.240",
            "loginAddress": "中国江苏省常州市",
            "browser": "Chrome 12",
            "os": "Windows 10",
            "loginStatus": "0",
            "message": "退出登录",
            "loginTime": "2024-08-15 10:11:11"
          },
          {
            "loginId": "1823897641976090626",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "219.155.104.198",
            "loginAddress": "中国河南省郑州市",
            "browser": "Chrome 12",
            "os": "Windows 10",
            "loginStatus": "0",
            "message": "退出登录",
            "loginTime": "2024-08-15 09:40:59"
          },
          {
            "loginId": "1823897560602398721",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "219.155.104.198",
            "loginAddress": "中国河南省郑州市",
            "browser": "Chrome 12",
            "os": "Windows 10",
            "loginStatus": "1",
            "message": "登录失败",
            "loginTime": "2024-08-15 09:40:39"
          },
          {
            "loginId": "1823896056218800130",
            "loginName": "ZHOUYI",
            "deviceName": "PC",
            "ipAddress": "124.160.107.106",
            "loginAddress": "中国浙江省杭州市",
            "browser": "Chrome 12",
            "os": "Windows 10",
            "loginStatus": "0",
            "message": "登录成功",
            "loginTime": "2024-08-15 09:34:41"
          },

           
        ],
        "total": 28,
        "pageSize": 10,
        "current": 1,
      }
    }
    const {current, pageSize, result, total} = dataList.data
    query.pagination.current = current
    query.pagination.pageSize = pageSize
    tempData.total = total

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
                       :showAdd="false"
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
              <el-table-column v-else-if="field.key==='loginStatus'"
                               :label="field.name"
                               :width="field.width"
                               :fixed="field.fixed"
                               :align="field.align">
                <template #default="scope">
                  <el-tag :type="scope.row.loginStatus === '0' ? 'success' : 'danger'">
                    {{scope.row.loginStatus === '0' ? '成功' : '失败'}}
                  </el-tag>
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
                      :showEdit="false"
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
  </section>
</template>

<style scoped lang="scss">

</style>
