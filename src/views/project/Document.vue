<template>
  <div class="task-document" :style="{ backgroundColor: appStore.darkTheme ? 'rgba(255, 255, 255, 0.12)' : '#f9f9f9' }">
    this is a Documents
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.task-document {
  flex: 1;
  width: 100%;
  padding: 16px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
