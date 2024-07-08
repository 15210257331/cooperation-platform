<template>
  <div class="project-wrap" >
    <div class="project-header">
      <IconSelect :default="currentProject?.icon" only-show></IconSelect>
      <span class="name">{{ currentProject?.name }}</span>
      <n-icon color="#888" :component="Calendar" />
      <span class="time">2023年4月23日 - 2023年6月15日</span>
      <n-space justify="end" style="flex: 1">
        <n-tooltip trigger="hover">
          {{ currentProject?.star ? '该项目已收藏' : '点击收藏该项目' }}
          <template #trigger>
            <n-button
              tertiary
              circle
              size="small"
              :type="currentProject?.star ? 'warning' : 'default'"
              @click="toggleStar(currentProject as ProjectType)"
            >
              <template #icon>
                <n-icon :component="Star" />
              </template>
            </n-button>
          </template>
        </n-tooltip>
        <n-dropdown :options="projectActions" trigger="click" @select="handleProjectAction">
          <n-button tertiary circle size="small">
            <template #icon>
              <n-icon :component="EllipsisHorizontal" />
            </template>
          </n-button>
        </n-dropdown>
      </n-space>
    </div>
    <div class="project-view">
      <n-tabs type="line" @update:value="handleTabChange">
        <n-tab v-for="item in tabs" :key="item.value" :name="item.value">{{ item.label }} </n-tab>
      </n-tabs>
      <div class="project-member" style="">
        <n-avatar-group expand-on-hover :options="projectMember" size="small" :max="6">
          <template #avatar="{ option: { name, src } }">
            <n-tooltip>
              <template #trigger>
                <n-avatar :src="src" />
              </template>
              {{ name }}
            </n-tooltip>
          </template>
          <template #rest="{ options: restOptions, rest }">
            <n-dropdown :options="createDropdownOptions(restOptions)" placement="top">
              <n-avatar>+{{ rest }}</n-avatar>
            </n-dropdown>
          </template>
        </n-avatar-group>
        <n-divider vertical />
        <n-button tertiary circle type="info" size="small">
          <template #icon>
            <n-icon :component="Add" />
          </template>
        </n-button>
      </div>
    </div>

    <PlaceholderContainer v-if="loading">
      <n-spin size="large" description="数据加载中" />
    </PlaceholderContainer>
    <component :is="currentView" v-else />

    <!-- 新增/修改项目弹窗 -->
    <CreateProjectModal ref="createProjectModalRef" />

    <!-- 新增/修改分组dialog -->
    <CreateGroupModal v-model:value="showCreateGroupModal" :data="null" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, markRaw } from 'vue'
import { useAppStore, useProjectStore } from '@/store'
import PlaceholderContainer from '@/components/PlaceholderContainer.vue'
import IconSelect from '@/components/IconSelect.vue'
import { useRoute, useRouter } from 'vue-router'
import { useCssVariable, useRender } from '@/hooks'
import CreateGroupModal from './CreateGroupModal.vue'
import CreateProjectModal from '../dashboard/components/CreateProjectModal.vue'
import Board from './Board.vue'
import List from './List.vue'
import TaskCalendar from './Calendar.vue'
import Document from './Document.vue'
import {
  Calendar,
  EllipsisHorizontal,
  Star,
  Add,
  TrashBin,
  DocumentText,
  ArrowForwardCircleSharp,
  Notifications,
  Albums,
  BagHandle,
  Duplicate,
  ShareSocialSharp
} from '@vicons/ionicons5'
import { ProjectType } from '@/interface'
import { useDialog, useMessage } from 'naive-ui'
import { projectToggleStar } from '@/api'

const projectStore = useProjectStore()
const appStore = useAppStore()
const route = useRoute()
const { renderIcon } = useRender()
const dialog = useDialog()
const message = useMessage()

const currentProject = computed(() => projectStore.currentProject)

const currentView = ref(markRaw(Board))
const tabs = ref<Array<{ label: string; value: string; component: any }>>([
  {
    label: '看板',
    value: 'board',
    component: markRaw(Board)
  },
  {
    label: '列表',
    value: 'list',
    component: markRaw(List)
  },
  {
    label: '项目日历',
    value: 'calendar',
    component: markRaw(TaskCalendar)
  },
  {
    label: '文档',
    value: 'document',
    component: markRaw(Document)
  }
])
function handleTabChange(value: string) {
  currentView.value = tabs.value.find(item => item.value === value)?.component
}

function toggleStar($event: ProjectType) {
  projectToggleStar({ id: $event.id as string, star: !$event.star }).then(res => {
    if (res.code === 10000) {
      message.success(res.message)
    }
  })
}

const projectActions = [
  {
    label: '修改信息',
    key: '1',
    icon: renderIcon(Albums)
  },
  {
    label: '添加分组',
    key: '2',
    icon: renderIcon(Duplicate)
  },
  {
    type: 'divider',
    key: '33'
  },
  {
    label: '重命名',
    key: '4',
    icon: renderIcon(DocumentText)
  },
  {
    label: '归档',
    key: '5',
    icon: renderIcon(BagHandle)
  },
  {
    type: 'divider',
    key: '6'
  },
  {
    label: '移到回收站',
    key: '7',
    props: {
      style: {
        color: 'red'
      }
    },
    icon: renderIcon(TrashBin)
  }
]
function handleProjectAction($event: any) {
  console.log($event)
  switch ($event) {
    case '1':
      createProject(currentProject.value as ProjectType)
      break
    case '2':
      createGroup()
      break
    case '7':
      removeProject(currentProject.value as ProjectType)
      break
    default:
      break
  }
}
// 修改项目信息
const createProjectModalRef = ref<InstanceType<typeof CreateProjectModal> | null>(null)
function createProject(currentProject: ProjectType) {
  createProjectModalRef.value?.show(currentProject)
}
// 新建项目分组
const showCreateGroupModal = ref<boolean>(false)
function createGroup() {
  showCreateGroupModal.value = true
}
// 删除项目
function removeProject($event: ProjectType) {
  const id = $event.id as string
  dialog.warning({
    title: '警告',
    content: '你确定删除当前项目吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      projectStore.deleteProject(id).then(res => {
        if (res) {
          message.success('项目删除成功！')
        }
      })
    },
    onNegativeClick: () => {
      console.log('cancel')
    }
  })
}

const projectMember = [
  {
    name: '张三',
    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
  },
  {
    name: '李四',
    src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
  },
  {
    name: '王五',
    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
  },
  {
    name: '赵六',
    src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
  },
  {
    name: '七仔',
    src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
  }
]
function createDropdownOptions(options: Array<{ name: string; src: string }>) {
  return options.map(option => ({
    key: option.name,
    label: option.name
  }))
}

/** 监听路由变化请求项目详情 */
const loading = ref<boolean>(true)
watch(
  () => route.params.id,
  value => {
    if (value) {
      queryProjectDetail(value as string)
    }
  },
  {
    immediate: true
  }
)
/** 查询项目详情 */
function queryProjectDetail(projectId: string, keyword = '') {
  loading.value = true
  projectStore.queryProjectDetail(projectId, keyword).finally(() => {
    loading.value = false
  })
}
</script>
<style lang="scss" scoped>
.project-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  .project-header {
    width: 100%;
    padding: 18px 18px 0px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span.name {
      font-size: 16px;
      margin: 0 20px 0 6px;
      font-weight: 500;
    }
    span.time {
      font-size: 12px;
      color: #888;
      vertical-align: text-bottom;
      margin-left: 4px;
      font-weight: 500;
    }
  }
  .project-view {
    position: relative;
    padding: 0 18px;
    margin-top: 10px;
    .project-member {
      position: absolute;
      right: 18px;
      bottom: 15px;
      top: 16px;
      display: flex;
      align-items: center;
    }
  }
}

::v-deep(.n-input .n-input__border, .n-input .n-input__state-border) {
  border: none;
}
</style>
