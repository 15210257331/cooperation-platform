<template>
  <div class="task-calendar" :style="{ backgroundColor: appStore.darkTheme ? 'rgba(255, 255, 255, 0.12)' : '#f9f9f9' }">
    <n-calendar v-model:value="value"
      :style="{ backgroundColor: appStore.darkTheme ? 'rgb(24, 24, 28)' : 'white', padding: '12px', height: 'auto' }"
      #="{ year, month, date }" :is-date-disabled="isDateDisabled" @update:value="handleUpdateValue">
      <div class="calendar-cell">
        <div v-for="item in filterTasksByDate(year, month, date)" :key="item.id" :class="['task-item']">
          {{ item.name }}
        </div>
      </div>
    </n-calendar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, h } from 'vue'
import { useDialog, useMessage, NButton, NIcon, DropdownOption } from 'naive-ui'
import { Apps, ReorderFour, ChevronDown } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import SectionArea from '@/components/SectionArea.vue'
import { useAppStore, useProjectStore } from '@/store'
import { TaskType } from '@/interface'
import dayjs from 'dayjs'

const appStore = useAppStore()
const dialog = useDialog()
const message = useMessage()
const router = useRouter()
const projectStore = useProjectStore()

const taskList = computed(() => {
  let taskList: any = []
  projectStore.currentProject?.groups.map(item => {
    item.tasks.map(sonItem => {
      sonItem.status = item.name
    })
    taskList = [...taskList, ...item.tasks]
  })
  return taskList
})

function filterTasksByDate(year: any, month: any, date: any) {
  const list = taskList.value
    .filter((item: TaskType) => {
      return (
        dayjs(item.startDate).date() <= date &&
        dayjs(item.endDate).date() >= date &&
        dayjs(item.startDate).month() + 1 === month
      )
    })
  // console.log(list)
  return list
}

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

.calendar-cell {
  width: 100%;
  height: 100px;
  overflow-y: auto;
}

.task-item {
  padding: 0 10px;
  color: #f0a020;
  box-sizing: border-box;
  border-radius: 3px;
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  background-color: rgba(240, 160, 32, 0.15);
  margin-bottom: 3px;
}
</style>
