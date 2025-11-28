<script setup>
const text = ref('')
</script>

<template>
  <section>
    <h1>上传组件</h1>
    <ZyUpload/>
    <h1>ICON选择器</h1>
    <IconSelect/>
    <h1>图片列表预览</h1>
    <ZyImgList/>
    <h1>LOGO</h1>
    <ZyLogo/>
    <h1>iconfont字体图标</h1>
    <i class="iconfont icon-guanyulinggan"></i>
    <i class="iconfont icon-bilibili1"></i>
    <i class="iconfont icon-github"></i>
    <i class="iconfont icon-qq"></i>
    <i class="iconfont icon-weixin"></i>
    <i class="iconfont icon-zhihu"></i>
    <i class="iconfont icon-weibo"></i>
    <h1>WangEditor富文本编辑器</h1>
    <WangEditor v-model="text"/>
    <div>{{text}}</div>
  </section>
</template>

<style lang="scss">
.iconfont {
  display: inline-block;
  margin: 5px;
  font-size: 20px;
}
</style>