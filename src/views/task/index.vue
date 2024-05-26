<template>
  <div class="task-board">
    <div class="task-header">
      <div class="project-name">
        <IconSelect :default="projectDetail?.icon" only-show></IconSelect>
        <span>{{ projectDetail?.name }}</span>
      </div>
      <div class="placeholder"></div>
      <!-- <div class="search">
        <n-input v-model:value="keywords" placeholder="搜索任务" round @keyup.enter="handleSearch">
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
      </div> -->
      <n-avatar-group :options="options" :size="32" :max="4" expand-on-hover>
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
    </div>
    <div class="task-content">
      <PlaceholderContainer v-if="loading">
        <n-spin size="large" description="数据加载中" />
      </PlaceholderContainer>
      <GroupList :data="projectDetail?.groups" />
    </div>
    <n-float-button
      position="absolute"
      shape="square"
      :right="20"
      :bottom="20"
      type="primary"
      menu-trigger="click"
      :show-menu="showMenu"
      @update:show-menu="handleShow"
    >
      <n-icon>
        <cash-icon />
      </n-icon>
      <template #menu>
        <n-float-button shape="square" @click="createProject">
          <n-icon>
            <cash-icon />
          </n-icon>
          <template #description>新增项目</template>
        </n-float-button>
        <n-float-button shape="square" @click="createGroup">
          <n-icon>
            <cash-icon />
          </n-icon>
          <template #description>新增分组</template>
        </n-float-button>
      </template>
    </n-float-button>

    <!-- 新增/修改项目弹窗 -->
    <CreateProjectModal ref="createProjectModalRef" />

    <!-- 新增/修改分组dialog -->
    <CreateGroupModal v-model:value="showCreateGroupModal" :data="null" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useAppStore, useProjectStore } from '@/store'
import { AppsSharp, Search, ChevronDown, LogoBuffer, StarSharp, StarOutline } from '@vicons/ionicons5'
import GroupList from './components/GroupList.vue'
import TopBar from '../../layout/TopBar.vue'
import { ProjectType } from '@/interface'
import PlaceholderContainer from '@/components/PlaceholderContainer.vue'
import IconSelect from '@/components/IconSelect.vue'
import { useRoute, useRouter } from 'vue-router'
import { useCssVariable } from '@/hooks'
import CreateGroupModal from './components/CreateGroupModal.vue'
import CreateProjectModal from '../project/components/CreateProjectModal.vue'
import { CashOutline as CashIcon } from '@vicons/ionicons5'

const projectStore = useProjectStore()
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()

const showMenu = ref<boolean>(false)
function handleShow($event: boolean) {
  showMenu.value = $event
}
const showCreateGroupModal = ref<boolean>(false)
function createGroup() {
  showMenu.value = false
  showCreateGroupModal.value = true
}
const createProjectModalRef = ref<InstanceType<typeof CreateProjectModal> | null>(null)
function createProject() {
  showMenu.value = false
  createProjectModalRef.value?.show()
}

const options = [
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
  options.map(option => ({
    key: option.name,
    label: option.name
  }))
}

/** 切换主题是动态重新获取一下最新的主题颜色 */
const nicePrimaryColor = ref<string>()
const loading = ref<boolean>(true)
watch(
  () => appStore.theme,
  () => {
    nicePrimaryColor.value = useCssVariable('--nice-primary-color') as string
  },
  {
    immediate: true
  }
)
/** 监听路由变化请求项目详情 */
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

const projectDetail = computed(() => projectStore.currentProject)

/** 查询项目详情 */
function queryProjectDetail(projectId: string, keyword = '') {
  loading.value = true
  projectStore.queryProjectDetail(projectId, keyword).finally(() => {
    loading.value = false
  })
}

/** 任务搜索 */
const keywords = ref<string>('')
function handleSearch() {
  if (projectDetail.value) {
    queryProjectDetail(projectDetail.value?.id as string, keywords.value)
  }
}

function handleStar() {}
</script>
gba(250, 250, 252, 1);
<style lang="scss" scoped>
.task-board {
  width: 100%;
  height: 100%;
  padding: 16px 24px 0px 24px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .project-name {
      display: flex;
      height: 40px;
      align-items: center;
      max-width: 210px;
      span {
        font-size: 16px;
        margin-left: 8px;
        color: rgb(51, 54, 57);
        font-weight: 700;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .placeholder {
      flex: 1;
    }
    .search {
      // flex: 1;
    }
  }
  .task-content {
    flex: 1;
    width: 100%;
    padding-bottom: 12px;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>
