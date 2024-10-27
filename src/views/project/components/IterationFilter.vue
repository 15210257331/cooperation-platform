<template>
  <div
    class="task-filter"
    :style="{
      borderBottom: appStore.darkTheme ? '1px solid rgba(255, 255, 255, 0.09)' : '1px solid rgb(239, 239, 245)'
    }"
  >
    <n-popselect
      v-model:value="iterationStatus"
      :options="iterationStatusOptions"
      trigger="click"
      @update:value="handleStatusChange"
    >
      <n-button icon-placement="right" size="tiny" text>
        {{ iterationStatus || '全部迭代' }}
        <template #icon>
          <n-icon :component="ChevronDownOutline" />
        </template>
      </n-button>
    </n-popselect>
    <n-divider vertical />
    <n-input
      v-model:value="keywords"
      round
      size="small"
      placeholder="迭代名称搜索"
      style="width: 240px"
      @change="handleSearch"
    >
      <template #prefix>
        <n-icon :component="Search" />
      </template>
    </n-input>
    <n-space justify="end" style="flex: 1">
      <n-button type="warning" size="small" @click="handleCreateIteration">添加迭代</n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search, ChevronDownOutline, FilterCircleSharp } from '@vicons/ionicons5'
import { useAppStore, useProjectStore } from '@/store'

interface Emits {
  (e: 'onSearch', val: string): void
  (e: 'onStatusChange', val: number): void
}
const emit = defineEmits<Emits>()

const projectStore = useProjectStore()
const appStore = useAppStore()

const iterationStatus = ref<string>('全部迭代')
const iterationStatusOptions = [
  { label: '全部迭代', value: '全部迭代', id: null },
  { label: '未开始', value: '未开始', id: 1 },
  { label: '进行中', value: '进行中', id: 2 },
  { label: '已完成', value: '已完成', id: 3 }
]

/** 任务搜索 */
const keywords = ref<string>('')
function handleSearch() {
  console.log(keywords)
  emit('onSearch', keywords.value)
}

function handleStatusChange(value: string) {
  const status = iterationStatusOptions.find(item => item.value === value)?.id as number
  emit('onStatusChange', status)
}

function handleCreateIteration() {}
</script>

<style lang="scss" scoped>
.task-filter {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 18px;
}
</style>
