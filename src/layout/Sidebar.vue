<template>
  <n-layout-sider
    bordered
    :width="240"
    :content-style="{
      padding: '0px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      overflow: 'hidden'
    }"
  >
    <AppLogo />
    <n-divider style="margin: 0" />
    <n-input round size="small" placeholder="搜索项目..." style="margin: 10px 15px; width: auto">
      <template #prefix>
        <n-icon :component="Search" />
      </template>
    </n-input>
    <n-menu
      v-if="!loading"
      v-model:value="activeKey"
      :icon-size="16"
      :indent="18"
      :options="menuData"
      default-expand-all
      style="--n-item-height: 36px; overflow: auto"
      @update:value="handleItemClick"
    />
    <n-spin v-if="loading" size="small" description="加载中" style="margin-top: 100px" />
  </n-layout-sider>
</template>

<script setup lang="ts">
import { Component, computed, h, ref, watchEffect } from 'vue'
import { getProjectList } from '@/api'
import { ProjectType } from '@/interface'
import { useRouter, useRoute } from 'vue-router'
import AppLogo from '@/components/AppLogo.vue'
import IconSelect from '@/components/IconSelect.vue'
import {
  EllipsisHorizontal,
  TrashBin,
  LogoBuffer,
  Documents,
  Search,
  PersonOutline,
  Grid,
  Star,
  ChevronDownOutline,
  Settings,
  FileTrayFull,
  AppsSharp
} from '@vicons/ionicons5'
import { useRender } from '@/hooks'
import { useProjectStore } from '@/store'
import { MenuOption, NEllipsis, NIcon, TreeOption, useDialog, useMessage } from 'naive-ui'

const dialog = useDialog()
const message = useMessage()
const router = useRouter()
const route = useRoute()
const { renderIcon } = useRender()
const projectStore = useProjectStore()

const activeKey = ref<string | null>(null)
watchEffect(() => {
  activeKey.value = route.path
  console.log(router)
})

const menuData = computed<MenuOption[]>(() => {
  const arr = router.options.routes.filter(item => item.path === '/')[0].children
  return (arr || []).map(item => {
    if (item.name === 'project') {
      return {
        label: `所有项目(${projectStore.projectList.length})`,
        key: '/project',
        icon: renderIcon(item.meta?.icon as Component),
        children: [
          {
            type: 'group',
            label: `我参与的(${projectStore.projectList.length})`,
            key: '11',
            children: projectStore.projectList.map(item => {
              return {
                ...item,
                label: () => h(NEllipsis, null, { default: () => item.name }),
                key: `/project/${item.id}`,
                icon: renderIcon(FileTrayFull)
              }
            })
          },
          {
            type: 'group',
            label: '已归档(3)',
            key: '33',
            children: projectStore.projectList.map(item => {
              return {
                ...item,
                label: () => h(NEllipsis, null, { default: () => item.name }),
                key: `/project/${item.id}`,
                icon: renderIcon(LogoBuffer)
              }
            })
          }
        ]
      }
    }
    return {
      label: item.meta?.title,
      key: item.path,
      icon: renderIcon(item.meta?.icon as Component)
    }
  })
})

const handleItemClick = (key: string, item: MenuOption) => {
  const routePath = item.key as string
  router.push(routePath)
}

const loading = ref<boolean>(false)
queryProjectList()
function queryProjectList() {
  loading.value = true
  projectStore.queryProjectList().finally(() => {
    loading.value = false
  })
}
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

::v-deep(.n-input .n-input__border, .n-input .n-input__state-border) {
  border: none;
}
</style>
