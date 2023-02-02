<template>
  <div class="task">
    <div class="task-header">
      <div class="toggle">
        <n-icon :component="Grid" color="#0e7a0d" style="margin-right: 10px" :size="20" />
        <n-dropdown
          v-model:value="currenProjectId"
          size="large"
          style="width: 300px"
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
        <n-divider vertical />
        <!-- <n-icon
          size="17"
          :component="selectedProject?.type === 2 ? StarSharp : StarOutline"
          :color="selectedProject?.type === 2 ? '#efe80eff' : '#999'"
        /> -->
      </div>
      <!-- <NavList /> -->
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
      <PositionContainer v-if="loading">
        <n-spin size="large" description="数据加载中" />
      </PositionContainer>
      <PositionContainer v-if="!loading && currenProject?.groups?.length === 0">
        <n-empty description="暂无数据" size="huge"> </n-empty>
      </PositionContainer>
      <GroupList :data="currenProject?.groups" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAppStore, useProjectStore } from '@/store'
import { useMessage, useDialog, FormInst } from 'naive-ui'
import { getFlowList, getProjectList } from '@/api'
import { Apps, ReorderFour, Search, StarOutline, Close, ChevronDown, Grid } from '@vicons/ionicons5'
import GroupList from './components/GroupList.vue'
import NavList from '../../layout/home/components/NavList.vue'
import { GroupType, ProjectType } from '@/interface'
import PositionContainer from '@/components/PositionContainer.vue'

const appStore = useAppStore()
const projectStore = useProjectStore()
const message = useMessage()
const dialog = useDialog()

const projectList = ref<Array<ProjectType>>([])
const loading = ref<boolean>(false)
const keywords = ref<string>('')

const showCreateGroupModal = ref<boolean>(false)
const showCreateTaskModal = ref<boolean>(false)
const selectedGroupData = ref<GroupType | null>(null)

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
    if (item.type === 2) {
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

queryProjectList()

function queryProjectList() {
  getProjectList().then(res => {
    if (res.code === 10000) {
      projectList.value = res.data || []
      if (!currenProject.value && projectList.value.length > 0) {
        queryProjectDetail(projectList.value[0].id as number)
        return
      }
      queryProjectDetail(currenProject.value?.id as number)
    }
  })
}
/** 查询项目详情 */
function queryProjectDetail(projectId: number | string, keyword?: string) {
  loading.value = true
  projectStore.queryProjectDetail(projectId as number).finally(() => {
    loading.value = false
  })
}

/** 更改当前选中的项目 */
function handleSelect(key: string | number, option: any) {
  // console.log(key, option)
  queryProjectDetail(key)
}

function handleSearch() {
  // console.log(keywords.value)
  if (currenProject.value) {
    queryProjectDetail(currenProject.value?.id as number, keywords.value)
  }
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
    // border-bottom: 1px solid rgb(239, 239, 245);
    // margin-bottom: 15px;
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

    .group-add {
      display: inline-block;
      width: 280px;
      height: 100%;
      margin: 0 20px 0 0;
      border-radius: 4px;
      overflow: hidden;
      border: 1px dashed #999;
      color: #999;
      text-align: center;
      position: relative;
      cursor: pointer;
      background-color: #fdfdfd;
      &:hover {
        border: 1px dashed #333;
      }
      span {
        display: inline-block;
        text-align: center;
        width: 100%;
        line-height: 100px;
        height: 100px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50px);
        font-size: 24px;
        font-weight: 600;
      }
    }
  }
}
</style>
