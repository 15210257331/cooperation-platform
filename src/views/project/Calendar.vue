<template>
  <div class="task-calendar">
    <n-calendar
      v-model:value="value"
      #="{ year, month, date }"
      style="background-color: white; padding: 12px"
      :is-date-disabled="isDateDisabled"
      @update:value="handleUpdateValue"
    >
      {{ year }}-{{ month }}-{{ date }}
    </n-calendar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, h } from 'vue'
import { useDialog, useMessage, NButton, NIcon, DropdownOption } from 'naive-ui'
import { Apps, ReorderFour, ChevronDown } from '@vicons/ionicons5'
import TopBar from '../../layout/TopBar.vue'
import { useRouter } from 'vue-router'
import SectionArea from '@/components/SectionArea.vue'

const dialog = useDialog()
const message = useMessage()
const router = useRouter()

const value = ref()
function handleUpdateValue(_: number, { year, month, date }: { year: number; month: number; date: number }) {
  message.success(`${year}-${month}-${date}`)
}
function isDateDisabled(timestamp: number) {
  //   if (isYesterday(timestamp)) {
  //     return true
  //   }
  return false
}
</script>

<style lang="scss" scoped>
.task-calendar {
  flex: 1;
  width: 100%;
  padding: 16px;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #f9f9f9;
}
</style>
