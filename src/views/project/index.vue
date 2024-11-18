<template>
  <div class="project-wrap">
    <div class="project-header">
      <IconSelect :default="currentProject?.icon" only-show></IconSelect>
      <span class="name">{{ currentProject?.name }}</span>
      <n-icon color="#888" :component="Calendar" />
      <span class="time"
        >{{ formatDate(currentProject?.startDate, 'YYYY年MM月DD日') }} -
        {{ formatDate(currentProject?.endDate, 'YYYY年MM月DD日') }}</span
      >
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
      <n-tabs type="line" :value="selectValue" @update:value="handleTabChange">
        <n-tab v-for="item in tabs" :key="item.value" :name="item.value">{{ item.label }} </n-tab>
      </n-tabs>
      <div class="project-member">
        <n-avatar-group expand-on-hover :options="members" size="small" :max="5">
          <template #avatar="{ option: { name, src } }">
            <n-tooltip>
              <template #trigger>
                <n-avatar :src="src" :fallback-src="defaultAvatar" />
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
        <n-dropdown :options="projectActions1" trigger="click" @select="handleProjectAction1">
          <n-button tertiary circle size="small" type="info">
            <template #icon>
              <n-icon :component="Add" />
            </template>
          </n-button>
        </n-dropdown>
        <!-- <n-popover style="width: 260px; padding: 0; border-radius: 5px" trigger="click">
          <template #trigger>
            <n-button tertiary circle type="info" size="small" @click="queryMembers">
              <template #icon>
                <n-icon :component="Add" />
              </template>
            </n-button>
          </template>
          <div class="member-wrap">
            <div class="member-header">
              <span>邀请项目成员</span>
              <span style="flex: 1"></span>
              <n-button tertiary size="tiny">
                <template #icon>
                  <n-icon :component="Close"></n-icon>
                </template>
              </n-button>
            </div>
            <div class="member-info">共 {{ members?.length || 0 }} 位成员</div>
            <ul class="member-content">
              <li v-for="item in allMembers" :key="item.id">
                <n-avatar round :size="30" :src="item.avatar" :fallback-src="defaultAvatar" />
                <div>
                  <h5>{{ item.nickname }}</h5>
                  <span>{{ item.username }}</span>
                </div>
                <n-button v-if="isInProject(item)" secondary strong size="tiny"> 项目成员 </n-button>
                <n-button v-else secondary strong type="warning" size="tiny"
                  @click="handleAddMember(item)">添加</n-button>
              </li>
            </ul>
          </div>
        </n-popover> -->
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
import { ref, onMounted, computed, watch, markRaw, reactive } from 'vue'
import { useAppStore, useProjectStore } from '@/store'
import PlaceholderContainer from '@/components/PlaceholderContainer.vue'
import IconSelect from '@/components/IconSelect.vue'
import { useRoute, useRouter } from 'vue-router'
import { useCssVariable, useRender } from '@/hooks'
import CreateGroupModal from '@/modals/CreateGroupModal.vue'
import CreateProjectModal from '@/modals/CreateProjectModal.vue'
import Board from './Board.vue'
import List from './List.vue'
import TaskCalendar from './Calendar.vue'
import Iteration from './Iteration.vue'
import { defaultAvatar } from '@/config'
import { deleteUser, userList, updateUserRole, addProjectMembers } from '@/api'
import {
  Calendar,
  EllipsisHorizontal,
  Star,
  Add,
  TrashBin,
  DocumentText,
  Albums,
  BagHandle,
  Duplicate,
  Close,
  Reader,
  BagAdd,
  PersonAdd
} from '@vicons/ionicons5'
import { ProjectType } from '@/interface'
import { useDialog, useMessage } from 'naive-ui'
import { projectToggleStar } from '@/api'
import { formatDate } from '@/utils'

const projectStore = useProjectStore()
const appStore = useAppStore()
const route = useRoute()
const { renderIcon } = useRender()
const dialog = useDialog()
const message = useMessage()

const currentProject = computed(() => projectStore.currentProject)

const currentView = ref(markRaw(Board))
const selectValue = ref('board')
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
    label: '迭代',
    value: 'iteration',
    component: markRaw(Iteration)
  },
  {
    label: '项目日历',
    value: 'calendar',
    component: markRaw(TaskCalendar)
  }
])
function handleTabChange(value: string) {
  selectValue.value = value
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
    label: '修改项目信息',
    key: '1',
    icon: renderIcon(Albums)
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

const projectActions1 = [
  {
    label: '添加分组',
    key: '1',
    icon: renderIcon(BagAdd)
  },
  {
    label: '添加项目成员',
    key: '2',
    icon: renderIcon(PersonAdd)
  },
  {
    type: 'divider',
    key: '3'
  },
  {
    label: '添加项目组件',
    key: '4',
    icon: renderIcon(Reader)
  }
]
function handleProjectAction1($event: any) {
  console.log($event)
  switch ($event) {
    case '1':
      createGroup()
      break
    case '2':
      console.log('添加项目成员')
      break
    case '4':
      console.log('添加组件')
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

// 查询所有用户
const allMembers = ref<any>([])
const allMembersLoading = ref<boolean>(false)
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 100,
  nickname: ''
})
function queryMembers() {
  allMembersLoading.value = true
  userList(queryParams)
    .then(res => {
      if (res.code === 10000) {
        allMembers.value = res.data.list || []
      }
    })
    .finally(() => {
      allMembersLoading.value = false
    })
}

// 添加项目成员
function handleAddMember(item: any) {
  const data = {
    projectId: currentProject.value?.id,
    memberId: item.id
  }
  addProjectMembers(data).then(res => {
    console.log(res)
    if (res.code === 10000) {
      message.success('操作成功')
    }
  })
}

// 该项目已包含的成员
const members = computed(() => {
  return projectStore.currentProject?.members.map(item => {
    return { ...item, name: item.nickname, src: item.avatar }
  })
})
function createDropdownOptions(options: Array<{ name: string; src: string }>) {
  return options.map(option => ({
    key: option.name,
    label: option.name
  }))
}

function isInProject(member: any) {
  return members.value?.find(item => item.id === member.id)
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
    handleTabChange('board')
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

.member-wrap {
  // padding: 16px 10px;
  .member-header {
    height: 36px;
    display: flex;
    align-items: center;
    font-weight: 500;
    padding: 0 10px;
    border-bottom: 1px solid rgb(239, 239, 245);

    span {
      margin-right: 10px;
      font-size: 13px;
      cursor: pointer;

      &:hover {
        color: #18a058;
      }
    }
  }

  .member-info {
    font-size: 12px;
    line-height: 30px;
    padding-left: 16px;
    // margin-bottom: 10px;
  }

  .member-content {
    overflow: auto;
    min-height: 280px;
    height: 280px;
    padding-bottom: 10px;

    li {
      padding: 3px 6px;
      margin: 6px 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border-radius: 3px;

      &:hover {
        // background-color: #ededed;
      }

      & > div {
        flex: 1;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        h5 {
          font-size: 12px;
          font-weight: 400;
        }

        span {
          font-size: 11px;
          color: #888;
        }
      }
    }
  }
}

::v-deep(.n-input .n-input__border, .n-input .n-input__state-border) {
  border: none;
}
</style>
