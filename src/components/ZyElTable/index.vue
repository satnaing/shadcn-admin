<script setup>
const props = defineProps({
  datas: {
    type: Array,
    required: true,
    default() {
      return [];
    }
  },
  query: {
    type: Object,
    default() {
      return {};
    }
  },
  loading: {
    type: Boolean,
    default() {
      return true;
    }
  },
  rowKey: {
    type: String,
    default() {
      return '_id';
    }
  },
  loadingTxt: {
    type: String,
    default() {
      return '数据加载中...';
    }
  },

  maxHeight: {
    type: [String, Number],
    default() {
      return 'auto'
    }
  },
  height: {
    type: [String, Number],
    default() {
      return 'auto'
    }
  },
  //显示汇总数据？
  showSum: {
    type: Boolean,
    default() {
      return false;
    }
  },
  //开启条纹？
  stripe: {
    type: Boolean,
    default() {
      return true;
    }
  },

  /**
   * 合并单元格
   * */
  spanMethod: {
    type: Function,
    default() {
      return function () {

      };
    }
  }
})

const emits = defineEmits(['sortChange', 'selectionChange', 'rowDbClick'])
const tableRef = ref()
defineExpose({
  tableRef
})
</script>

<template>
  <el-table
      :data="datas"
      size="default"
      border
      :stripe="stripe"
      :showSum="showSum"
      ref="tableRef"
      :height="height"
      :max-height="maxHeight"
      :span-method="spanMethod"
      :row-key="rowKey"
      v-loading="loading"
      @row-dblclick="((row, column, event)=>emits('rowDbClick',{row, column}))"
      @selection-change="(selection)=>emits('selectionChange',selection)"
      @sort-change="({column, prop, order})=>emits('sortChange',{column, prop, order})"
      :element-loading-text="loadingTxt"
      style="width: 100%;">
    <slot/>
  </el-table>
</template>

<style scoped lang="scss">

</style>
