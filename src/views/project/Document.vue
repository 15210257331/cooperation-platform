<template>
  <div class="task-document" :style="{ backgroundColor: appStore.darkTheme ? 'rgba(255, 255, 255, 0.12)' : '#f9f9f9' }">
    <n-descriptions label-placement="left" title="描述">
      <n-descriptions-item>
        <template #label>
          早餐
        </template>
        苹果
      </n-descriptions-item>
      <n-descriptions-item label="早午餐">
        苹果
      </n-descriptions-item>
      <n-descriptions-item label="午餐">
        苹果
      </n-descriptions-item>
      <n-descriptions-item label="晚餐">
        苹果
      </n-descriptions-item>
      <n-descriptions-item label="夜宵">
        苹果
      </n-descriptions-item>
    </n-descriptions>
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
