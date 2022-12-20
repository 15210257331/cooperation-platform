<template>
  <div class="b">
    <n-button disabled>订阅事件</n-button>
    订阅的值：
    {{ flag }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BUS from '../../../Bus'
const flag = ref<boolean>(false)
BUS.on('on-click', (f: boolean) => {
  flag.value = f
})
</script>

<style lang="scss" scoped>
.b {
}
</style>
