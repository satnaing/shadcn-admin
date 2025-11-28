<template>
    <div class="zy-fittle-row">
        <div>
            <el-popover placement="right-start" trigger="hover">
                <el-scrollbar class="float-filter">
                    <div class="float-filter_flex">
                        <el-checkbox @change="goShowChange" v-for="field in fields" v-model="field.show"
                                     :key="field.key" :label="field.name"
                        />
                    </div>
                </el-scrollbar>
                <template #reference>
                    <div class="filler-table-td">
                        <el-icon>
                            <Operation/>
                        </el-icon>
                    </div>
                </template>

            </el-popover>
        </div>
        <div class="row-btns">
            <el-space>
                <slot></slot>
                <el-button
                        type="primary"
                        :icon="Plus"
                        :disabled="disAdd"
                        @click="()=>{emit('add')}"
                        v-permission="addAuth"
                        v-if="showAdd">
                    {{ addText }}
                </el-button>
                <el-button
                        type="danger"
                        :disabled="disDelete"
                        :icon="Delete"
                        @click="()=>{emit('delete')}"
                        v-permission="deleteAuth"
                        v-if="showDelete">

                    {{ deleteText }}
                </el-button>
            </el-space>
        </div>
    </div>
</template>

<script setup>
    import {
        Plus,
        Delete,
    } from '@element-plus/icons-vue'

    const props = defineProps({
        fields: {
            type: Array,
            default() {
                return [];
            }
        },
        showFilter: {
            type: Boolean,
            default: true,
        },
        showAdd: {
            type: Boolean,
            default: true,
        },
        showDelete: {
            type: Boolean,
            default: false,
        },
      disAdd: {
        type: Boolean,
        default: false,
      },
      disDelete: {
        type: Boolean,
        default: false,
      },
        addText: {
            type: String,
            default: '增加',
        },
        deleteText: {
            type: String,
            default: '批量删除',
        },
        addAuth: {
            type: String,
            default: '',
        },
        deleteAuth: {
            type: String,
            default: '',
        },

    })
    const emit = defineEmits(['add', 'delete', 'showChange'])

    const goShowChange = (e) => {
        emits('showChange', e)
    }
</script>

<style lang="scss" scoped>
    .zy-fittle-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 8px;
    }

    .filler-table-td {
        width: 30px;
        height: 28px;
        box-shadow: 0px 0px 3px 0px rgba(80, 85, 89, 0.59);
        border-radius: 3px;
        cursor: pointer;
        color: #8A9299;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        margin-left: 2px;

        &:hover {
            box-shadow: 0px 0px 3px 0px rgba(#409EFF, 0.8);
            color: var(--el-color-primary);
        }
    }
</style>
