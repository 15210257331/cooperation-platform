<template>
    <div>这是一个测试自定义全局属性的组件</div>
    <n-button @click="showGlobalProperty">显示全局属性</n-button>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'GlobalProperty',
    data() {
      return {
        testName: 'text'
      }
    },
    mounted() {
      console.log(this.$title)
      // console.log(PROJECT_BUILD_TIME);
    },
    methods: {
      showGlobalProperty() {
        window.$message?.success(`属性名：$title,属性值：${this.$title}`)
      }
    }
  })
  </script>
  
  <style lang="scss" scoped></style>
  