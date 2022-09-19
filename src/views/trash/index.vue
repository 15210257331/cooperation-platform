<template>
  <n-data-table
    :bordered="false"
    striped
    :columns="columns"
    :data="dataList"
    :pagination="{ itemCount: total, pageSize: queryParams.size }"
  />
</template>

<script setup lang="ts">
import { h, ref, onMounted } from 'vue'
import { deleteTask, getTaskList } from '@/api'
import { DataTableColumns, useMessage, NTag, NButton, useDialog } from 'naive-ui'
import dayjs from 'dayjs'

const message = useMessage()
const dialog = useDialog()

type RowData = {
  id: number
  key: number
  name: string
  description: string
  createDate: string
}
const columns: DataTableColumns<RowData> = [
  {
    title: '任务名称',
    key: 'name'
  },
  {
    title: '任务描述',
    key: 'description'
  },
  {
    title: '创建时间',
    key: 'createDate',
    render(row) {
      return h('span', null, { default: () => dayjs(row.createDate).format('YYYY年MM月DD日 HH:mm:ss') })
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          type: 'error',
          onClick: () => {
            deleteData(row.id)
          }
        },
        { default: () => '彻底删除' }
      )
    }
  }
]

const dataList = ref<RowData[]>([])
const total = ref<number>(0)
const queryParams = ref({
  page: 1,
  size: 10,
  name: '',
  isDelete: true
})

onMounted(() => {
  queryData()
})

function queryData() {
  getTaskList(queryParams.value).then(res => {
    if (res.code === 10000) {
      dataList.value = res.data.list || []
      total.value = res.data.total
    }
  })
}

function deleteData(id: number) {
  dialog.warning({
    title: '警告',
    content: '你确定彻底删除这个任务吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      deleteTask(id).then(res => {
        if (res.code === 10000) {
          message.success('任务已删除')
          queryData()
        }
      })
    },
    onNegativeClick: () => {
      console.log('取消')
    }
  })
}
</script>

<style lang="scss" scoped></style>
