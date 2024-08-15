<script setup>
// docs: https://www.wangeditor.com/v5/for-frame.html#demo-1
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const props = defineProps({
  modelValue: String,
})
// 内容 HTML
const valueHtml = ref('')

// 模拟 ajax 异步获取内容
onMounted(() => {
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty(`--w-e-textarea-bg-color`, 'var(---el-bg-color)');
  rootStyle.setProperty(`--w-e-toolbar-bg-color`, 'var(--el-menu-bg-color)');
  rootStyle.setProperty(`--w-e-toolbar-border-color`, 'var(--el-border-color)');
  rootStyle.setProperty(`--w-e-textarea-color`, 'var(--el-text-color)');
})

const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  editor.setHtml(props.modelValue)
}
const emits = defineEmits(['update:modelValue'])
const handleChange = (editor) => {
  let valueHtml = editor.getHtml()
  let valueText = editor.getText()
  if (valueText) {
    emits('update:modelValue', valueHtml)
  } else {
    emits('update:modelValue', valueText)
  }
}


</script>

<template>
  <div class="wangEdit-box">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
    />
    <Editor
        style="height: 300px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
        @onChange="handleChange"
    />
  </div>
</template>

<style lang="scss">

.w-e-full-screen-container {
  z-index: 1000 !important;
}


.wangEdit-box {
  width: 100%;
  height: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 20px var(--el-border-color);

}
</style>