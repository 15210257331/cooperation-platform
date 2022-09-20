<template>
  <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="210" :collapsed="appStore.siderCollapse">
    <AppLogo />
    <n-menu
      :value="activeKey"
      :collapsed="appStore.siderCollapse"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      :indent="12"
      :root-indent="20"
    />
  </n-layout-sider>
</template>

<script setup lang="ts">
import { ref, Component, h, computed } from 'vue'
import { NIcon, type MenuOption } from 'naive-ui'
import { PersonSharp } from '@vicons/ionicons5'
import { useAppStore } from '@/store'
import { useRender } from '@/hooks'
import AppLogo from '@/components/AppLogo.vue'
import { RouteRecordRaw, RouterLink, useRoute } from 'vue-router'
import { routes } from '@/router'

const appStore = useAppStore()
const route = useRoute()
const { renderIcon } = useRender()

const activeKey = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string)
const homeRoutes = routes.filter(item => item.path === '/')[0].children as Array<RouteRecordRaw>
const menuOptions = computed(() => {
  const result: Array<MenuOption> = []
  getMenuOptions(homeRoutes, result)
  return result
})
// console.log(menuOptions);

// 遍历路由表数据生成左侧导航菜单数据
function getMenuOptions(arr: Array<RouteRecordRaw>, result: MenuOption[]) {
  if (arr) {
    arr.map(item => {
      const menuOption: MenuOption = {
        key: item.name as string,
        label: renderLabel(item),
        icon: renderIcon(item.meta ? (item.meta.icon as Component) : PersonSharp),
        children: []
      }
      if (Array.isArray(item.children) && item.children.length > 0) {
        getMenuOptions(item.children, menuOption.children as MenuOption[])
      } else {
        delete menuOption.children
      }
      result.push(menuOption)
      if (item.name === 'user') {
        result.push({
          key: 'divider-1',
          type: 'divider',
          props: {
            style: {
              marginLeft: '32px'
            }
          }
        })
      }
    })
  }
}
function renderLabel(routeRecordRaw: RouteRecordRaw) {
  return () => {
    if (routeRecordRaw.meta && routeRecordRaw.meta.type && routeRecordRaw.meta.type === 'M') {
      return routeRecordRaw.meta.title
    }
    return h(
      RouterLink,
      {
        to: {
          name: routeRecordRaw.name
        }
      },
      { default: () => (routeRecordRaw.meta ? routeRecordRaw.meta.title : routeRecordRaw.name) }
    )
  }
}
</script>

<style scoped></style>
