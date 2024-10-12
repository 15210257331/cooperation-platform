<template>
  <TaskFilter />
  <div class="task-list" :style="{ backgroundColor: appStore.darkTheme ? 'rgba(255, 255, 255, 0.12)' : '#f9f9f9' }">
    <n-data-table striped :columns="columns" :data="taskList" :pagination="pagination" />
  </div>
</template>

<script setup lang="ts">
import { h, defineComponent, computed } from 'vue'
import { NTag, NButton, useMessage, NSpace, NAvatar, NBadge, NProgress } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import TaskFilter from './components/TaskFilter.vue'
import { useAppStore, useProjectStore } from '@/store'
import TaskStatus from './components/TaskStatus.vue'
import UserInfo from './components/UserInfo.vue'
import TaskPriority from './components/TaskPriority.vue'
import TaskOperation from './components/TaskOperation.vue'

const message = useMessage()
const appStore = useAppStore()
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
console.log(taskList)

const pagination = {
  pageSize: 10
}
const columns: DataTableColumns<any> = [
  {
    title: '标题',
    key: 'name',
    align: 'center'
  },
  {
    title: '状态',
    key: 'status',
    align: 'center',
    render: (rowData, rowIndex) => {
      return h(TaskStatus, {
        type: 'success',
        name: rowData.status
      })
    }
  },
  {
    title: '持有者',
    key: 'age',
    align: 'center',
    render: (rowData, rowIndex) => {
      const { owner } = rowData
      return h(UserInfo, {
        nickname: owner.nickname,
        avatar: owner.avatar
      })
    }
  },
  {
    title: '任务进度',
    key: 'progress',
    align: 'center',
    render: rowData => {
      return h(NProgress, {
        type: 'line',
        height: 6,
        status: 'info',
        percentage: rowData.progress,
        showIndicator: false
      })
    }
  },
  {
    title: '优先级',
    key: 'priority',
    align: 'center',
    render: (rowData, rowIndex) => {
      return h(TaskPriority, {
        priority: rowData.priority
      })
    }
  },
  {
    title: '标签',
    key: 'tags',
    align: 'center',
    render(row) {
      return row.tags.map((item: { name: any }) => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            size: 'small',
            type: 'info',
            bordered: false
          },
          {
            default: () => item.name
          }
        )
      })
    }
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    render(rowData) {
      return h(TaskOperation, {
        task: rowData
      })
    }
  }
]
</script>

<style lang="scss" scoped>
.task-list {
  flex: 1;
  width: 100%;
  padding: 16px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
