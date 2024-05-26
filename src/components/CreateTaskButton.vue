<template>
  <n-card hoverable :content-style="{ padding: '15px' }" style="margin-bottom: 10px" @click="handleClick">
    <span class="task-add">新建任务</span>
  </n-card>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'click'): void
}
const emit = defineEmits<Emits>()

function handleClick() {
  emit('click')
}
</script>

<style lang="scss" scoped>
.task-add {
  cursor: pointer;
  display: block;
  text-align: center;
  line-height: 40px;
  font-weight: 600;
  font-size: 16px;
}
</style>
