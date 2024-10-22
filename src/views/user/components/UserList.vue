<template>
  <n-card size="small">
    <n-space style="margin-bottom: 20px">
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
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="dataList"
      :remote="true"
      :loading="loading"
      :pagination="{ page: queryParams.pageIndex, pageSize: queryParams.pageSize, itemCount: total }"
      @update:page="pageChange"
    />
  </n-card>

  <!-- 角色配置 -->
  <RoleConfigModal ref="roleConfigModalRef" @result="handleResult" />
</template>

<script setup lang="ts">
import { h, ref, onMounted, reactive, markRaw } from 'vue'
import { deleteUser, userList } from '@/api'
import { DataTableColumns, useMessage, NTag, NButton, useDialog } from 'naive-ui'
import dayjs from 'dayjs'
import { SearchSharp, RefreshSharp, Close } from '@vicons/ionicons5'
import { useAppStore } from '@/store'
import RoleConfigModal from './RoleConfigModal.vue'
import { getRandomNumber } from '@/utils'

const message = useMessage()
const dialog = useDialog()
const appStore = useAppStore()

type RowData = {
  id: number
  key: number
  username: string
  nickname: string
  phone: string
  roles: any[]
  createDate: string
}
const columns: DataTableColumns<RowData> = [
  {
    title: '用户名',
    key: 'username',
    align: 'center'
  },
  {
    title: '昵称',
    key: 'nickname',
    align: 'center'
  },
  {
    title: '手机号',
    key: 'phone',
    align: 'center'
  },
  {
    title: '角色',
    key: 'tags',
    align: 'center',
    render(row) {
      return row.roles.map(item => {
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: ['success', 'warning', 'error', 'info'][getRandomNumber(3)],
            size: 'small',
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
    title: '创建时间',
    key: 'createDate',
    align: 'center',
    render(row) {
      return h('span', null, { default: () => dayjs(row.createDate).format('YYYY年MM月DD日 HH:mm:ss') })
    }
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'warning',
            quaternary: true,
            onClick: () => {
              roleConfig(row)
            }
          },
          { default: () => '配置角色' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            quaternary: true,
            onClick: () => {
              userDelete(row.id)
            }
          },
          { default: () => '删除' }
        )
      ]
    }
  }
]

const dataList = ref<RowData[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10,
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

const roleConfigModalRef = ref<InstanceType<typeof RoleConfigModal> | null>(null)
function roleConfig(row: RowData) {
  roleConfigModalRef.value?.show(row)
}

function handleResult() {
  queryData()
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
