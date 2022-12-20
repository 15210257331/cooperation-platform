<template>
  <div>
    <n-button @click="show">显示loading</n-button>
    <n-button @click="hide">关闭loading</n-button>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
const instance = getCurrentInstance()

const show = () => {
  instance?.proxy?.$loading.show()
}
const hide = () => {
  instance?.proxy?.$loading.hide()
}
</script>

<style lang="scss" scoped></style>
