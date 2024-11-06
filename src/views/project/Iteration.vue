<template>
  <IterationFilter
    @on-search="handleSearch"
    @on-status-change="handleStatusChange"
    @on-create-iteration="handleCreateIteration"
  />
  <div
    class="task-iteration"
    :style="{ backgroundColor: appStore.darkTheme ? 'rgba(255, 255, 255, 0.12)' : '#f9f9f9' }"
  >
    <n-card v-for="item in iterationList" :key="item.id" :title="item.name" style="margin-bottom: 20px">
      <template #header-extra>
        <n-dropdown :options="dropdownOptions" trigger="hover" @select="handleDropDownClick($event, item)">
          <n-icon :component="EllipsisHorizontal" />
        </n-dropdown>
      </template>
      <n-descriptions label-placement="left" :column="4">
        <n-descriptions-item label="当前状态">
          <n-tag v-if="item.status === 1" size="small" :bordered="false" type="info"> 未开始 </n-tag>
          <n-tag v-if="item.status === 2" size="small" :bordered="false" type="warning"> 进行中 </n-tag>
          <n-tag v-if="item.status === 3" size="small" :bordered="false" type="success"> 已完成 </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="开始时间">
          <n-tag :bordered="false" type="info" size="small" round> {{ formatDate(item.startDate) }} </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="结束时间">
          <n-tag :bordered="false" type="error" size="small" round> {{ formatDate(item.endDate) }} </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="创建人">
          <n-space>
            <n-avatar
              round
              size="small"
              :src="item.principal.avatar"
              :fallback-src="defaultAvatar"
              :style="{ marginTop: '-4px' }"
            >
            </n-avatar>
            <span>{{ item.principal.nickname }}</span>
          </n-space>
        </n-descriptions-item>
        <n-descriptions-item label="创建时间">
          <n-tag :bordered="false" size="small" round> {{ formatDate(item.createDate) }} </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="迭代类型">
          <n-button text type="primary"> {{ getLabelFromValue(iterationTypeOptions, item.type) }} </n-button>
        </n-descriptions-item>
        <n-descriptions-item label="迭代进度" :span="4">
          <n-progress
            style="width: 160px; margin-top: 5px"
            :height="12"
            type="line"
            status="warning"
            :percentage="item.progress"
            indicator-placement="inside"
          />
        </n-descriptions-item>
        <n-descriptions-item label="迭代内容" :span="8">
          <ul>
            <li v-for="(sonItem, index) in item.content.split('\n')" :key="index">{{ index + 1 }}、{{ sonItem }}</li>
          </ul>
        </n-descriptions-item>
        <n-descriptions-item v-if="item.attachment.length > 0" label="附件资源" :span="8">
          <n-space>
            <template v-for="(sonItem, index) in item.attachment" :key="index">
              <n-button v-if="sonItem" text size="tiny" type="primary" tag="a" :href="sonItem" style="margin-top: -1px">
                <template #icon>
                  <n-icon>
                    <FileTrayFullSharp />
                  </n-icon>
                </template>
                {{ sonItem }}
              </n-button>
              <span v-else>--</span>
            </template>
          </n-space>
        </n-descriptions-item>
      </n-descriptions>
    </n-card>

    <PlaceholderContainer v-if="loading">
      <n-spin size="large" description="数据加载中" />
    </PlaceholderContainer>

    <PlaceholderContainer v-if="!loading && iterationList.length === 0">
      <n-empty size="large" description="暂无数据"></n-empty>
    </PlaceholderContainer>
  </div>

  <CreateIterationModal ref="createIterationModalRef" @result="getIterationList" />
</template>

<script setup lang="ts">
import { useRender } from '@/hooks'
import { useAppStore, useProjectStore } from '@/store'
import { EllipsisHorizontal, TrashBin, Albums, Duplicate, Add, FileTrayFullSharp } from '@vicons/ionicons5'
import { getIterationListAPI, completeIterationAPI, deleteIterationAPI } from '@/api'
import { ref } from 'vue'
import { defaultAvatar } from '@/config'
import { formatDate } from '@/utils'
import IterationFilter from './components/IterationFilter.vue'
import PlaceholderContainer from '@/components/PlaceholderContainer.vue'
import CreateIterationModal from './components/CreateIterationModal.vue'
import { useDialog, useMessage } from 'naive-ui'
import { iterationTypeOptions } from '@/config/iteration'
import { getLabelFromValue } from '@/utils/helper'

const appStore = useAppStore()
const projectStore = useProjectStore()
const { renderIcon } = useRender()
const message = useMessage()
const dialog = useDialog()

const iterationList = ref<any>([])
const loading = ref<boolean>(false)
const name = ref<string>('')
const status = ref<number | null>(null)
function getIterationList() {
  loading.value = true
  const params = {
    projectId: projectStore.currentProject?.id as string,
    name: name.value,
    status: status.value
  }
  getIterationListAPI(params)
    .then(res => {
      if (res.code === 10000) {
        iterationList.value = res.data.list || []
      }
    })
    .finally(() => {
      loading.value = false
    })
}
getIterationList()

function handleSearch($event: string) {
  console.log($event)
  name.value = $event
  getIterationList()
}

function handleStatusChange($event: number) {
  status.value = $event
  getIterationList()
}

const createIterationModalRef = ref<InstanceType<typeof CreateIterationModal> | null>(null)
function handleCreateIteration(data: any) {
  createIterationModalRef.value?.show(data)
}

const dropdownOptions = [
  {
    label: '完成迭代',
    key: '1',
    icon: renderIcon(Duplicate)
  },
  {
    label: '修改信息',
    key: '2',
    icon: renderIcon(Albums)
  },
  {
    label: '添加任务',
    key: '3',
    icon: renderIcon(Add)
  },
  {
    type: 'divider',
    key: '4'
  },
  {
    label: '删除迭代',
    key: '5',
    props: {
      style: {
        color: 'red'
      }
    },
    icon: renderIcon(TrashBin)
  }
]
function handleDropDownClick($event: string, item: any) {
  if ($event === '1') {
    const data = {
      id: item.id,
      status: 3
    }
    completeIterationAPI(data).then(res => {
      if (res.code === 10000) {
        message.success('操作成功')
        getIterationList()
      }
    })
  }
  if ($event === '2') {
    handleCreateIteration(item)
  }
  if ($event === '5') {
    dialog.warning({
      title: '警告',
      content: '你确定删除当前迭代吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        deleteIterationAPI(item.id).then(res => {
          if (res.code === 10000) {
            message.success('删除成功！')
            getIterationList()
          }
        })
      },
      onNegativeClick: () => {
        console.log('cancel')
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.task-iteration {
  flex: 1;
  width: 100%;
  padding: 16px;
  overflow-x: hidden;
  overflow-y: auto;
}

::v-deep(.n-descriptions-table-content__content) {
  max-width: calc(100% - 80px);
}
</style>
