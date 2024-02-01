<template>
  <div class="task-board">
    <div class="task-header">
      <p class="project-name">{{ projectDetail?.name }}</p>
      <div class="search">
        <n-input v-model:value="keywords" placeholder="搜索任务" size="small" @keyup.enter="handleSearch">
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
      </div>
    </div>
    <div class="task-content">
      <PlaceholderContainer v-if="loading">
        <n-spin size="large" description="数据加载中" />
      </PlaceholderContainer>
      <GroupList :data="projectDetail?.groups" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useAppStore, useProjectStore } from '@/store'
import { AppsSharp, Search, ChevronDown } from '@vicons/ionicons5'
import GroupList from './components/GroupList.vue'
import { ProjectType } from '@/interface'
import PlaceholderContainer from '@/components/PlaceholderContainer.vue'
import { useRoute, useRouter } from 'vue-router'
import { useCssVariable } from '@/hooks'

const projectStore = useProjectStore()
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()

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
</script>

<style lang="scss" scoped>
.task-board {
  flex: 1;
  height: 100%;
  margin-right: 24px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}
.task-header {
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .project-name {
    font-size: 27px;
    color: black;
    font-weight: 700px;
  }
  .toggle {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
}
.task-content {
  flex: 1;
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
