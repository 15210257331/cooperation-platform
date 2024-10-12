<template>
  <div class="task-status">
    <n-badge dot :type="type" />
    <span>{{ name }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: string
  name: string
}>()
</script>

<style lang="scss" scoped>
.task-status {
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    margin-left: 8px;
    font-size: 14px;
  }
}
</style>
