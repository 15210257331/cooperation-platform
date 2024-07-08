<template>
  <TaskFilter />
  <div class="task-list">
    <n-data-table :columns="columns" :data="data" :pagination="pagination" default-expand-all />
  </div>
</template>

<script setup lang="ts">
import { h, defineComponent } from 'vue'
import { NTag, NButton, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import TaskFilter from './TaskFilter.vue'

type RowData = {
  key: number
  name: string
  age: number
  address: string
  tags: string[]
}

const message = useMessage()

const data = [
  {
    key: 0,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: 1,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['wow']
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
]
const pagination = {
  pageSize: 10
}
const columns = createColumns({
  sendMail(rowData) {
    message.info('send mail to ' + rowData.name)
  }
})

function createColumns({ sendMail }: { sendMail: (rowData: RowData) => void }): DataTableColumns<RowData> {
  return [
    {
      type: 'expand',
      expandable: rowData => rowData.name !== 'Jim Green',
      renderExpand: rowData => {
        return `${rowData.name} is a good guy.`
      }
    },
    {
      title: '标题',
      key: 'key',
      render: (_, index) => {
        return `${index + 1}`
      }
    },
    {
      title: '状态',
      key: 'name'
    },
    {
      title: '持有者',
      key: 'age'
    },
    {
      title: '任务进度',
      key: 'address'
    },
    {
      title: '优先级',
      key: 'address'
    },
    {
      title: '标签',
      key: 'tags',
      render(row) {
        const tags = row.tags.map(tagKey => {
          return h(
            NTag,
            {
              style: {
                marginRight: '6px'
              },
              type: 'info',
              bordered: false
            },
            {
              default: () => tagKey
            }
          )
        })
        return tags
      }
    },
    {
      title: 'Action',
      key: 'actions',
      render(row) {
        return h(
          NButton,
          {
            size: 'small',
            onClick: () => sendMail(row)
          },
          { default: () => 'Send Email' }
        )
      }
    }
  ]
}
</script>

<style lang="scss" scoped>
.task-list {
  flex: 1;
  width: 100%;
  padding: 16px;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #f9f9f9;
}
</style>
