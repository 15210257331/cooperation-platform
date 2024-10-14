<template>
  <div class="user-wrap" :style="{ backgroundColor: appStore.darkTheme ? 'rgba(255, 255, 255, 0.12)' : '#f9f9f9' }">
    <div class="header">
      <n-tabs type="bar">
        <n-tab v-for="item in tabs" :key="item.value" :name="item.value">{{ item.title }}</n-tab>
      </n-tabs>
    </div>
    <div class="content">
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
            重置</n-button>
        </n-space>
        <n-data-table :bordered="false" :columns="columns" :data="dataList" :remote="true" :loading="loading"
          :pagination="{ page: queryParams.pageIndex, pageSize: queryParams.pageSize, itemCount: total }"
          @update:page="pageChange" />
        <n-modal v-model:show="showModal">
          <n-card :segmented="{
            content: true,
            footer: true
          }" style="width: 520px" :title="'设置角色'" :bordered="false" role="dialog" aria-modal="true">
            <template #header-extra>
              <n-button quaternary circle>
                <template #icon>
                  <n-icon size="20" @click="showModal = false">
                    <Close />
                  </n-icon>
                </template>
              </n-button>
            </template>
            <div>
              <n-radio-group v-model:value="role" name="radiogroup">
                <n-space>
                  <n-radio v-for="(item, key) in roleMap" :key="key" :value="key">
                    {{ item }}
                  </n-radio>
                </n-space>
              </n-radio-group>
            </div>
            <template #footer>
              <n-space horizontal style="float: right">
                <n-button tertiary @click="showModal = false"> 取消 </n-button>
                <n-button type="primary" @click="setRole"> 确认 </n-button>
              </n-space>
            </template>
          </n-card>
        </n-modal>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref, onMounted, reactive } from 'vue'
import { deleteUser, userList, updateUserRole } from '@/api'
import { DataTableColumns, useMessage, NTag, NButton, useDialog } from 'naive-ui'
import dayjs from 'dayjs'
import { SearchSharp, RefreshSharp, Close } from '@vicons/ionicons5'
import { roleMap } from '@/config'
import { useAppStore } from '@/store'

const message = useMessage()
const dialog = useDialog()
const appStore = useAppStore()

type RowData = {
  id: number
  key: number
  username: string
  nickname: string
  phone: string
  role: string
  createDate: string
}
const tabs = ref<Array<any>>([
  {
    title: '用户管理',
    value: 'all'
  },
  {
    title: '角色管理',
    value: '1'
  }
])
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
          default: () => roleMap[row.role]
        }
      )
    }
  },
  {
    title: '注册时间',
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
              showModal.value = true
              role.value = row.role
              selectUserId.value = row.id
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
  pageSize: 4,
  nickname: ''
})
const showModal = ref<boolean>(false)
const role = ref<string>('')
const selectUserId = ref<number>()

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
    onNegativeClick: () => { }
  })
}

function setRole() {
  updateUserRole({ userId: selectUserId.value, role: role.value }).then(res => {
    if (res.code === 10000) {
      showModal.value = false
      message.success(res.message)
      queryData()
    }
  })
}
</script>

<style lang="scss" scoped>
.user-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    background-color: white;
  }

  .content {
    width: 100%;
    flex: 1;
    overflow: auto;
    padding: 15px;
  }
}

.user {
  padding: 10px;
}
</style>
