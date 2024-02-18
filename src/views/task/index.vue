<template>
  <TopBar></TopBar>
  <div class="task-board">
    <div class="task-header">
      <div class="project-name">
        <IconSelect :default="projectDetail?.icon" only-show></IconSelect>
        <span>{{ projectDetail?.name }}</span>
      </div>
      <div class="placeholder"></div>
      <div class="search">
        <n-input v-model:value="keywords" placeholder="搜索任务" round @keyup.enter="handleSearch">
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
import { AppsSharp, Search, ChevronDown, LogoBuffer, StarSharp, StarOutline } from '@vicons/ionicons5'
import GroupList from './components/GroupList.vue'
import TopBar from '../../layout/TopBar.vue'
import { ProjectType } from '@/interface'
import PlaceholderContainer from '@/components/PlaceholderContainer.vue'
import IconSelect from '@/components/IconSelect.vue'
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

function handleStar() {}
</script>

<style lang="scss" scoped>
.task-board {
  width: 100%;
  height: calc(100% - 45px);
  padding: 16px 24px 4px 24px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  .task-header {
    display: flex;
    justify-content: flex-start;
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
        font-weight: 500;
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
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  }
}
</style>
