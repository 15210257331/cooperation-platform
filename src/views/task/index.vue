<template>
  <div class="task">
    <div class="task-header">
      <div class="toggle">
        <n-tooltip placement="top" trigger="hover">
          <span>点击返回项目概览</span>
          <template #trigger>
            <n-icon
              :component="AppsSharp"
              :color="nicePrimaryColor"
              style="margin-right: 10px; cursor: pointer"
              :size="20"
              @click="handleNavigate"
            />
          </template>
        </n-tooltip>
        <n-dropdown
          v-model:value="currenProjectId"
          size="large"
          style="width: 280px"
          :options="options"
          scrollable
          @select="handleSelect"
        >
          <n-button text icon-placement="right">
            <template #icon>
              <n-icon :component="ChevronDown" />
            </template>
            <span style="font-weight: 500; font-size: 15px">{{ currenProjectName }}</span>
          </n-button>
        </n-dropdown>
      </div>
      <div class="search">
        <n-input v-model:value="keywords" round placeholder="搜索任务" @keyup.enter="handleSearch">
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
      </div>
    </div>
    <n-divider style="margin-top: 0; margin-bottom: 15px" />
    <div class="task-content">
      <PlaceholderContainer v-if="loading">
        <n-spin size="large" description="数据加载中" />
      </PlaceholderContainer>
      <GroupList :data="currenProject?.groups" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useAppStore, useProjectStore } from '@/store'
import { getProjectList } from '@/api'
import { AppsSharp, Search, ChevronDown } from '@vicons/ionicons5'
import GroupList from './components/GroupList.vue'
import { ProjectType } from '@/interface'
import PlaceholderContainer from '@/components/PlaceholderContainer.vue'
import { useRouter } from 'vue-router'
import { useCssVariable } from '@/hooks'

const projectStore = useProjectStore()
const appStore = useAppStore()
const router = useRouter()

const projectList = ref<Array<ProjectType>>([])
const loading = ref<boolean>(true)
const keywords = ref<string>('')
const nicePrimaryColor = ref<string>()

const currenProject = computed(() => projectStore.currentProject)
const currenProjectId = computed(() => {
  if (projectStore.currentProject) {
    return projectStore.currentProject.id
  }
  return null
})
const currenProjectName = computed(() => {
  if (projectStore.currentProject) {
    return projectStore.currentProject.name
  }
  return '暂无项目'
})
const options = computed(() => {
  const starList: Array<any> = []
  const normalList: Array<any> = []
  projectList.value.map(item => {
    if (item.star) {
      starList.push({
        label: item.name,
        key: item.id,
        star: true
      })
    } else {
      normalList.push({ label: item.name, key: item.id, star: false })
    }
  })
  return [
    {
      type: 'group',
      label: '星标项目',
      key: 'star',
      children: starList
    },
    {
      type: 'group',
      label: '普通项目',
      key: 'normal',
      children: normalList
    }
  ]
})

/** 切换主题是动态重新获取一下最新的主题颜色 */
watch(
  () => appStore.theme,
  () => {
    nicePrimaryColor.value = useCssVariable('--nice-primary-color') as string
  },
  {
    immediate: true
  }
)

queryProjectList()

function queryProjectList() {
  getProjectList('').then(res => {
    if (res.code === 10000) {
      projectList.value = res.data || []
      if (!currenProject.value && projectList.value.length > 0) {
        queryProjectDetail(projectList.value[0].id as string)
        return
      }
      queryProjectDetail(currenProject.value?.id as string)
    }
  })
}
/** 查询项目详情 */
function queryProjectDetail(projectId: number | string, keyword = '') {
  loading.value = true
  projectStore.queryProjectDetail(projectId as number, keyword).finally(() => {
    loading.value = false
  })
}

/** 更改当前选中的项目 */
function handleSelect(key: string | number, option: any) {
  // console.log(key, option)
  queryProjectDetail(key)
}

/** 任务搜索 */
function handleSearch() {
  if (currenProject.value) {
    queryProjectDetail(currenProject.value?.id as string, keywords.value)
  }
}

function handleNavigate() {
  router.push({
    name: 'project'
  })
}
</script>

<style lang="scss" scoped>
.task {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .task-header {
    height: 65px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .toggle {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
  }
  .task-content {
    height: 100%;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    padding-bottom: 15px;
  }
}
</style>
