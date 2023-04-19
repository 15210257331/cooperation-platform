<template>
  <n-card
    size="small"
    title="自定义loading插件"
    :segmented="{
      content: true
    }"
  >
    <n-button @click="show">显示loading</n-button>
    <n-button @click="hide">关闭loading</n-button>
  </n-card>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const instance = getCurrentInstance()
console.log(instance)

const show = () => {
  instance?.proxy?.$loading.show()
}
const hide = () => {
  instance?.proxy?.$loading.hide()
}
</script>

<style lang="scss" scoped></style>
