<template>
  <n-card size="small">
    <div style="display: flex">
      <n-space style="margin-bottom: 20px">
        <n-input v-model:value="queryParams.name" type="text" placeholder="请输入角色名称" @keyup.enter="queryData" />
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
      <div v-permission="2048" style="flex: 1">
        <n-button type="warning" style="float: right" @click="handleRoleOrUpdateAdd(null)">
          <template #icon>
            <n-icon>
              <Add />
            </n-icon>
          </template>
          添加角色
        </n-button>
      </div>
    </div>

    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="tableList"
      :remote="true"
      :loading="loading"
      :pagination="{ page: queryParams.pageIndex, pageSize: queryParams.pageSize, itemCount: total }"
      @update:page="pageChange"
    />

    <!-- 添加/修改角色 -->
    <RoleAddModal ref="roleAddModalRef" @result="handleResult" />
    <!-- 权限配置 -->
    <PermissionConfigModal ref="permissionConfigModalRef" @result="handleResult" />
  </n-card>
</template>

<script setup lang="ts">
import { h, ref, onMounted, reactive, markRaw } from 'vue'
import { roleListAPI, deleteRoleAPI } from '@/api'
import { DataTableColumns, useMessage, NTag, NButton, useDialog } from 'naive-ui'
import dayjs from 'dayjs'
import { SearchSharp, RefreshSharp, Add } from '@vicons/ionicons5'
import { useAppStore } from '@/store'
import PermissionConfigModal from './PermissionConfigModal.vue'
import RoleAddModal from './RoleAddModal.vue'

const message = useMessage()
const dialog = useDialog()
const appStore = useAppStore()

type RowData = {
  id: string
  key: number
  name: string
  inlay: number
  description: string
  permission: number
  createDate: string
}
const columns: DataTableColumns<RowData> = [
  {
    title: '角色名称',
    key: 'name',
    align: 'center'
  },
  {
    title: '角色描述',
    key: 'description',
    align: 'center'
  },
  {
    title: '角色权限值',
    key: 'permission',
    align: 'center'
  },
  {
    title: '角色类型',
    key: 'inlay',
    align: 'center',
    render(row) {
      return h(
        NTag,
        {
          type: row.inlay === 0 ? 'warning' : 'info',
          size: 'small',
          bordered: false
        },
        {
          default: () => (row.inlay === 0 ? '普通角色' : '内置角色')
        }
      )
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
    title: '更新时间',
    key: 'updateDate',
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
              permissionConfig(row)
            }
          },
          { default: () => '权限配置' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            disabled: row.inlay === 1,
            quaternary: true,
            onClick: () => {
              handleRoleOrUpdateAdd(row)
            }
          },
          { default: () => '修改' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            disabled: row.inlay === 1,
            quaternary: true,
            onClick: () => {
              roleDelete(row.id)
            }
          },
          { default: () => '删除' }
        )
      ]
    }
  }
]

const tableList = ref<RowData[]>([])
const total = ref<number>(0)
const loading = ref<boolean>(false)
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 10,
  name: ''
})
function queryData() {
  loading.value = true
  roleListAPI(queryParams)
    .then(res => {
      if (res.code === 10000) {
        tableList.value = res.data.list || []
        total.value = res.data.total
      }
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  queryData()
})

function reset() {
  queryParams.pageIndex = 1
  queryParams.name = ''
  queryData()
}

function pageChange(page: number) {
  queryParams.pageIndex = page
  queryData()
}

function roleDelete(id: string) {
  dialog.warning({
    title: '警告',
    content: '你确定？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      deleteRoleAPI(id).then(res => {
        if (res.code === 10000) {
          message.success(res.message)
          queryData()
        }
      })
    },
    onNegativeClick: () => {}
  })
}

const permissionConfigModalRef = ref<InstanceType<typeof PermissionConfigModal> | null>(null)
function permissionConfig(row) {
  permissionConfigModalRef.value?.show(row)
}

const roleAddModalRef = ref<InstanceType<typeof RoleAddModal> | null>(null)
function handleRoleOrUpdateAdd(row) {
  roleAddModalRef.value?.show(row)
}

function handleResult() {
  queryData()
}
</script>

<style lang="scss" scoped></style>
