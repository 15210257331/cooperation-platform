<template>
  <div class="task-calendar" :style="{ backgroundColor: appStore.darkTheme ? 'rgba(255, 255, 255, 0.12)' : '#f9f9f9' }">
    <n-calendar
      v-model:value="value"
      #="{ year, month, date }"
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
import { useAppStore } from '@/store'

const appStore = useAppStore()
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
}
</style>
