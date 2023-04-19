<template>
  <div class="a">
    <n-button @click="emit">派发事件</n-button>
    <span>值： {{ flag }}</span>
  </div>
</template>

<script setup lang="ts">
import BUS from './index'
import { ref } from 'vue'
const flag = ref<boolean>(false)
const emit = () => {
  flag.value = !flag.value
  BUS.emit('on-click', flag.value)
}
</script>

<style lang="scss" scoped>
.a {
}
</style>
