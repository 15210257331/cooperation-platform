<template>
  <n-card size="small">
    <n-space>
      <n-input v-model:value="queryParams.nickname" type="text" placeholder="请输入用户昵称" @keyup.enter="queryData" />
      <n-button type="success" @click="queryData">
        <template #icon>
          <n-icon>
            <SearchSharp />
          </n-icon>
        </template>
        搜索
      </n-button>
      <n-button @click="reset">
        <template #icon>
          <n-icon>
            <RefreshSharp />
          </n-icon>
        </template>
        重置</n-button
      >
    </n-space>
  </n-card>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="dataList"
    :remote="true"
    :loading="loading"
    :pagination="{ page: queryParams.pageIndex, pageSize: queryParams.pageSize, itemCount: total }"
    @update:page="pageChange"
  />
</template>

<script setup lang="ts">
import { h, ref, onMounted, reactive } from 'vue'
import { deleteUser, userList } from '@/api'
import { DataTableColumns, useMessage, NTag, NButton, useDialog } from 'naive-ui'
import dayjs from 'dayjs'
import { SearchSharp, RefreshSharp } from '@vicons/ionicons5'

const message = useMessage()
const dialog = useDialog()

type RowData = {
  id: number;
  key: number;
  username: string;
  nickname: string;
  phone: string;
  role: number;
  createDate: string;
};
const columns: DataTableColumns<RowData> = [
  {
    title: '用户名',
    key: 'username'
  },
  {
    title: '昵称',
    key: 'nickname'
  },
  {
    title: '手机号',
    key: 'phone'
  },
  {
    title: '角色',
    key: 'tags',
    render(row) {
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
          default: () => (row.role === 1 ? '管理员' : '普通用户')
        }
      )
    }
  },
  {
    title: '注册时间',
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
            userDelete(row.id)
          }
        },
        { default: () => '删除' }
      )
    }
  }
]

const options = [
  {
    label: '普通用户',
    value: 2
  },
  {
    label: '管理员',
    value: 1
  }
]

const dataList = ref<RowData[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 4,
  nickname: ''
})

onMounted(() => {
  queryData()
})

function queryData() {
  loading.value = true
  userList(queryParams)
    .then(res => {
      if (res.code === 10000) {
        dataList.value = res.data.list || []
        total.value = res.data.total
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function reset() {
  queryParams.pageIndex = 1
  queryParams.nickname = ''
  queryData()
}

function pageChange(page: number) {
  queryParams.pageIndex = page
  queryData()
}

function userDelete(id: number) {
  dialog.warning({
    title: '警告',
    content: '你确定？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      deleteUser(id).then(res => {
        if (res.code === 10000) {
          message.success(res.message)
        }
      })
    },
    onNegativeClick: () => {}
  })
}
</script>

<style lang="scss" scoped></style>
