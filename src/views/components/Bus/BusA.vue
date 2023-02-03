<template>
  <div class="a">
    <n-button @click="emit">派发事件</n-button>
    值： {{ flag }}
  </div>
</template>

<script setup lang="ts">
import BUS from '../../../Bus'
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
