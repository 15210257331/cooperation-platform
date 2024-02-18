<template>
  <n-layout-sider
    collapse-mode="width"
    :collapsed-width="0"
    :width="240"
    show-trigger="arrow-circle"
    content-style="padding: 0px 12px;display:flex;flex-direction: column;justify-content: flex-start; overflow: hidden"
    bordered
  >
    <AppLogo />
    <n-divider style="margin: 12px 0" />
    <div class="title">工作台</div>
    <ul class="nav-list">
      <li
        v-for="item in staticRoutes"
        :key="item.path"
        :class="['project-item', activeRoutePath === item.path && 'active']"
        @click="handleItemClick(item)"
      >
        <n-icon size="17" color="#338fe4" :component="item.meta.icon" />
        <div class="name">{{ item.meta.title }}</div>
      </li>
    </ul>
    <n-divider style="margin: 12px 0" />
    <div class="title">我的项目</div>
    <ul class="project-list" style="flex: 1">
      <li
        v-for="item in dynamicRoutes"
        :key="item.id"
        :class="['project-item', activeRoutePath === '/project/' + item.id && 'active']"
        @click="handleItemClick(item)"
      >
        <IconSelect :default="item.icon" only-show></IconSelect>
        <div class="name">{{ item.name }}</div>
        <n-dropdown trigger="hover" :options="options" @select="handleSelect($event, item)">
          <n-icon size="17" color="#999" :component="EllipsisHorizontal" class="option" />
        </n-dropdown>
      </li>
      <n-spin v-if="loading" size="small" description="加载中" style="margin-top: 50px" />
    </ul>
  </n-layout-sider>
  <!-- 新增/修改项目弹窗 -->
  <CreateProjectModal ref="createProjectModalRef" @result="result" />
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { getProjectList } from '@/api'
import { ProjectType } from '@/interface'
import { useRouter, useRoute } from 'vue-router'
import AppLogo from '@/components/AppLogo.vue'
import IconSelect from '@/components/IconSelect.vue'
import CreateProjectModal from '../views/project/components/CreateProjectModal.vue'
import { EllipsisHorizontal, TrashBin, LogoBuffer, Documents } from '@vicons/ionicons5'
import { useRender } from '@/hooks'
import { useProjectStore } from '@/store'
import { useDialog, useMessage } from 'naive-ui'

const dialog = useDialog()
const message = useMessage()
const router = useRouter()
const route = useRoute()
const { renderIcon } = useRender()
const projectStore = useProjectStore()

const activeRoutePath = ref<string | undefined>(undefined)
watchEffect(() => {
  activeRoutePath.value = route.path
})

const staticRoutes = router.getRoutes().filter(item => item.meta?.type === 'static')
const dynamicRoutes = computed(() => projectStore.projectList)
const loading = ref<boolean>(false)
queryProjectList()
function queryProjectList() {
  loading.value = true
  projectStore.queryProjectList().finally(() => {
    loading.value = false
  })
}

const handleItemClick = (item: any) => {
  const routePath = item.path ? item.path : `/project/${item.id}`
  router.push(routePath)
}

const createProjectModalRef = ref<InstanceType<typeof CreateProjectModal> | null>(null)
const options = [
  {
    label: '修改信息',
    key: 'edit',
    icon: renderIcon(Documents)
  },
  {
    label: '删除项目',
    key: 'delete',
    icon: renderIcon(TrashBin)
  }
]
function handleSelect($event: any, project: ProjectType) {
  console.log($event)
  if ($event === 'edit') {
    createProjectModalRef.value?.show(project)
  } else {
    removeProject(project)
  }
}
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
    onNegativeClick: () => {}
  })
}
function result() {}
</script>

<style lang="scss" scoped>
.n-layout-sider-scroll-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.title {
  color: rgb(51, 54, 57);
  font-size: 15px;
  padding-left: 10px;
  font-weight: 500;
  margin-bottom: 12px;
}
.nav-list,
.project-list {
  text-align: center;
  .project-item {
    margin-bottom: 6px;
    min-height: 35px;
    height: 35px;
    padding: 4px 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: rgb(243, 243, 245);
      border-radius: 3px;
      .option {
        display: block;
      }
    }
    &.active {
      background-color: rgba(24, 160, 88, 0.1);
      color: #18a058;
    }
    .name {
      flex: 1;
      text-align: left;
      color: #888;
      font-size: 13px;
      font-weight: 500;
      margin-left: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .option {
      display: none;
    }
  }
}
.project-list {
  flex: 1;
  overflow: auto;
}
</style>
