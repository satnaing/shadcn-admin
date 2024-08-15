<script setup>
    const props = defineProps({
        currentPage: {
            type: Number,
            default: function () {
                return 1
            }
        },
        pageSize: {
            type: Number,
            default: function () {
                return 15
            }
        },
        pageSizes: {
            type: Array,
            default: function () {
                return [10, 20, 30, 40]
            }
        },
        disabled: {
            type: Boolean,
            default: function () {
                return false
            }
        },
        background: {
            type: Boolean,
            default: function () {
                return false
            }
        },
        hideOnSinglePage: {
            type: Boolean,
            default: function () {
                return false
            }
        },
        total: {
            type: Number,
            default: function () {
                return 100
            }
        }

    })
    const emits = defineEmits(['sizeChange', 'currentChange'])

    const handleSizeChange = (val) => {
        emits('sizeChange', val)

    }
    const handleCurrentChange = (val) => {
        emits('currentChange', val)

    }

</script>

<template>
    <section class="pagination-box">
        <el-pagination
                :current-page="currentPage"
                :page-size="pageSize"
                :page-sizes="pageSizes"
                :hide-on-single-page="hideOnSinglePage"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
        />
    </section>

</template>

<style scoped lang="scss">
    .pagination-box {
        padding: 15px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

</style>
