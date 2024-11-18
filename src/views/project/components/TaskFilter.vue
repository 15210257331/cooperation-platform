<template>
  <div
    class="task-filter"
    :style="{
      borderBottom: appStore.darkTheme ? '1px solid rgba(255, 255, 255, 0.09)' : '1px solid rgb(239, 239, 245)'
    }"
  >
    <n-popselect v-model:value="taskType" :options="taskTypeList" trigger="click">
      <n-button icon-placement="right" size="tiny" text>
        {{ taskType || '全部任务' }}
        <template #icon>
          <n-icon :component="ChevronDownOutline" />
        </template>
      </n-button>
    </n-popselect>
    <n-divider vertical />
    <n-input
      v-model="keywords"
      round
      size="small"
      placeholder="搜索任务标题(按enter搜索)"
      style="width: 240px"
      @change="handleSearch"
    >
      <template #prefix>
        <n-icon :component="Search" />
      </template>
    </n-input>
    <n-space justify="end" style="flex: 1">
      <n-tag size="small" closable @close="handleClose"> 30天内 </n-tag>
      <n-tag size="small" type="warning" :bordered="false">
        筛选:迭代
        <template #icon>
          <n-icon :component="FilterCircleSharp" />
        </template>
      </n-tag>
      <n-popselect v-model:value="sortType" :options="sortTypeList" size="small" trigger="click">
        <n-button icon-placement="right" size="tiny" type="primary" secondary>
          {{ sortType }}
          <template #icon>
            <n-icon :component="ChevronDownOutline" />
          </template>
        </n-button>
      </n-popselect>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search, ChevronDownOutline, FilterCircleSharp } from '@vicons/ionicons5'
import { useAppStore, useProjectStore } from '@/store'

interface Emits {
  (e: 'onSearch', val: string): void
}
const emit = defineEmits<Emits>()

const projectStore = useProjectStore()
const appStore = useAppStore()
const projectDetail = computed(() => projectStore.currentProject)

const taskType = ref<string>('全部任务')
const taskTypeList = computed(() => {
  const groups = (projectStore.currentProject?.groups || []).map(item => {
    return {
      label: `${item.name}`,
      value: item.name,
      id: item.id
    }
  })
  return [{ label: '全部任务', value: '全部任务', id: '' }, ...groups]
})

/** 任务搜索 */
const keywords = ref<string>('')
function handleSearch() {
  emit('onSearch', keywords.value)
}

const sortType = ref<string>('按优先级排序')
const sortTypeList = [
  {
    label: '按优先级排序',
    value: '按优先级排序'
  },
  {
    label: '按剩余时间排序',
    value: '按剩余时间排序'
  },
  {
    label: '按更新时间排序',
    value: '按更新时间排序'
  }
]

function handleClose() {}
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
