<template>
  <n-tooltip trigger="hover">
    {{ '任务优先级：' + priority?.label }}
    <template #trigger>
      <n-tag :type="priority?.type" :bordered="false" size="small">
        {{ priority?.label }}
        <template #icon>
          <n-icon :component="FlagSharp" />
        </template>
      </n-tag>
    </template>
  </n-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { priorityOptions } from '@/config'
import { FlagSharp } from '@vicons/ionicons5'

const props = defineProps<{
  priority: number
}>()

/**任务优先级 */
const priority = computed(() => {
  return priorityOptions.find(item => item.value === props.priority)
})
</script>

<style lang="scss" scoped></style>
