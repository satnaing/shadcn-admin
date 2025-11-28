<template>
  <div ref="iconSelectRef" :style="'width:' + width">
    <el-popover :visible="popoverVisible" :width="width" placement="bottom-end">
      <template #reference>
        <el-input
            class="reference"
            size="default"
            v-model="selectedIcon"
            readonly
            placeholder="点击选择图标"
            @click="popoverVisible = !popoverVisible"
        >
          <template #prepend>
            <el-icon>
              <component :is="selectedIcon"/>
            </el-icon>

          </template>
          <template #suffix>
            <el-icon
                :style="{
                transform: popoverVisible ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform .5s',
              }"
                @click="popoverVisible = !popoverVisible"
            >
              <ArrowDown/>
            </el-icon>
          </template>
        </el-input>
      </template>

      <!-- 下拉选择弹窗 -->
      <div ref="popoverContentRef">
        <el-input
            v-model="searchText"
            placeholder="搜索图标"
            clearable
            @input="filterIcons"
        />
        <el-scrollbar height="300px">
          <ul class="icon-container">
            <li
                v-for="icon in filteredEpIcons"
                :key="icon"
                class="icon-item"
                @click="selectIcon(icon)"
            >
              <el-icon>
                <component :is="icon"/>
              </el-icon>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const props = defineProps({
  modelValue: {
    type: String,
    require: false,
    default: "",
  },
  width: {
    type: String,
    require: false,
    default: "300px",
  },
});

const emit = defineEmits(["update:modelValue"]);
const selectedIcon = ref('AddLocation');

const iconSelectRef = ref();
const popoverContentRef = ref();

const searchText = ref(""); // 筛选的值
const popoverVisible = ref(false); // 弹窗显示状态


const epIcons = Object.keys(ElementPlusIconsVue); // Element Plus图标集合
const filteredEpIcons = ref([]); // 过滤后的Element Plus图标名称集合


/**
 * icon 筛选
 */
function filterIcons() {
  // 过滤Element Plus图标逻辑 TODO
  filteredEpIcons.value = searchText.value
      ? epIcons.filter((iconName) =>
          iconName.toLowerCase().includes(searchText.value.toLowerCase())
      )
      : epIcons;
}

filterIcons();

/**
 * 选择图标
 */
function selectIcon(iconName) {
  selectedIcon.value = iconName
  emit("update:modelValue", iconName);
  popoverVisible.value = false;
}

</script>

<style scoped lang="scss">
.reference :deep(.el-input__wrapper),
.reference :deep(.el-input__inner) {
  cursor: pointer;
}

.icon-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0;

  .icon-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    margin: 4px;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    transition: all 0.3s;
  }

  .icon-item:hover {
    border-color: var(--el-color-primary);
    scale: 1.2;
  }
}
</style>
