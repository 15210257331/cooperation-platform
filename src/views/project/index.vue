<template>
  <div class="dashboard">
    <SectionArea title="快捷操作">
      <ShortcutItem
        v-for="item in shortcutActionList"
        :key="item.title"
        :icon="item.icon"
        :title="item.title"
        :type="item.type"
        @card:click="handleShortcutClick(item.type)"
      />
    </SectionArea>
    <SectionArea title="我的项目" :sub-title="'(共' + projectList.length + '个项目)'">
      <template #action>
        <n-dropdown trigger="hover" :options="orderOptions" @select="handleOrderOptionChange">
          <n-button icon-placement="right" text style="margin-right: 20px">
            <template #icon>
              <n-icon :component="ChevronDown" />
            </template>
            {{ selectOrderType }}
          </n-button>
        </n-dropdown>
        <n-dropdown trigger="hover" :options="options" @select="handleSelect">
          <n-icon size="20" :component="showType === 'card' ? Apps : ReorderFour"> </n-icon>
        </n-dropdown>
      </template>
      <PlaceholderContainer v-if="projectList.length === 0">
        <n-empty size="huge" description="暂无数据"></n-empty>
      </PlaceholderContainer>
      <ProjectCardList
        v-if="showType === 'card'"
        :data="projectList"
        @update-project="handleUpdateProject"
        @delete-project="removeProject"
        @click-project="clickProject"
      />
      <ProjectTableList
        v-if="showType === 'list'"
        :data="projectList"
        @update-project="handleUpdateProject"
        @delete-project="removeProject"
        @click-project="clickProject"
      />
    </SectionArea>
  </div>
  <!-- 新增/修改项目弹窗 -->
  <CreateProjectModal ref="createProjectModalRef" @result="result" />
</template>

<script setup lang="ts">
import { computed, ref, h } from 'vue'
import { useDialog, useMessage, NButton, NIcon } from 'naive-ui'
import { Apps, ReorderFour, ChevronDown } from '@vicons/ionicons5'
import ProjectCardList from './components/ProjectCardList.vue'
import ProjectTableList from './components/ProjectTableList.vue'
import ShortcutItem from './components/ShortcutItem.vue'
import { useProjectStore } from '@/store'
import { ProjectType } from '@/interface'
import { useRouter } from 'vue-router'
import { useRender } from '@/hooks'
import SectionArea from '@/components/SectionArea.vue'
import { getProjectList, deleteProject } from '@/api'
import PlaceholderContainer from '@/components/PlaceholderContainer.vue'
import CreateProjectModal from './components/CreateProjectModal.vue'

const dialog = useDialog()
const projectStore = useProjectStore()
const message = useMessage()
const router = useRouter()
const { renderIcon } = useRender()

const createProjectModalRef = ref<InstanceType<typeof CreateProjectModal> | null>(null)
const showType = ref<string>('card')
const selectOrderType = ref<string>('打开时间排序')

const options = [
  {
    label: '卡片模式',
    key: 'card',
    icon: renderIcon(Apps)
  },
  {
    label: '列表模式',
    key: 'list',
    icon: renderIcon(ReorderFour)
  }
]
const orderOptions = [
  {
    type: 'group',
    label: '排序类型',
    key: 'sort',
    children: [
      {
        label: '创建时间排序',
        key: '1'
      },
      {
        label: '打开时间排序',
        key: '2'
      },
      {
        label: '名称排序',
        key: '3'
      }
    ]
  }
]
const shortcutActionList = [
  {
    title: '新增项目',
    icon: 'https://lhcdn.lanhuapp.com/dashboard/production/assets/dc_prj.8ef4ddf0.svg',
    type: 1
  },
  {
    title: '新建任务',
    icon: 'https://lhcdn.lanhuapp.com/dashboard/production/assets/master_go.529dd3fa.svg',
    type: 2
  },
  {
    title: '文档',
    icon: 'https://lhcdn.lanhuapp.com/dashboard/production/assets/ts_doc.58db84fd.svg',
    type: 3
  }
]

const projectList = ref([])

queryProjectList()

function queryProjectList() {
  getProjectList().then(res => {
    if (res.code === 10000) {
      projectList.value = res.data || []
      console.log(projectList)
    }
  })
}

function handleSelect(key: string) {
  showType.value = key
}
function handleOrderOptionChange(key: string, option: any) {
  selectOrderType.value = option.label
}
function handleShortcutClick(type: number) {
  // 新建项目
  if (type === 1) {
    createProjectModalRef.value?.show()
  }
}

function handleUpdateProject($event: ProjectType) {
  createProjectModalRef.value?.show($event)
}

function result() {
  queryProjectList()
}
function clickProject($event: ProjectType) {
  router.push({
    name: 'task'
  })
  projectStore.setCurrentProject($event)
}
function removeProject($event: ProjectType) {
  const id = $event.id
  dialog.warning({
    title: '警告',
    content: '你确定删除当前项目吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      deleteProject(id as number).then(res => {
        if (res.code === 10000) {
          message.success('项目删除成功！')
          queryProjectList()
        }
      })
    },
    onNegativeClick: () => {}
  })
}
</script>

<style lang="scss" scoped>
.n-layout-content {
  // background-color: #f3f5f7;
  height: calc(100% - 55px);
  margin-top: 10px;
  padding: 25px;
}
header {
  height: 65px;
  //   border-bottom: 1px solid #ccc;
  background-color: white;
  text-align: center;
  ul {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
