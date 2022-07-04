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
import { ref, Component, h, computed } from 'vue';
import type { MenuOption } from 'naive-ui';
import { NIcon } from 'naive-ui';
import { Grid, CalendarNumber, Layers, PersonSharp, Settings } from '@vicons/ionicons5';
import { useAppStore } from '@/store';
import AppLogo from '@/components/app-logo/index.vue';
import { RouterLink, useRoute } from 'vue-router';

const appStore = useAppStore();
const route = useRoute();
const activeKey = computed(() => (route.meta?.activeMenu ? route.meta.activeMenu : route.name) as string);
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'dashboard'
          }
        },
        { default: () => '概览' }
      ),
    key: 'dashboard',
    icon: renderIcon(Grid)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'task'
          }
        },
        { default: () => '我的任务' }
      ),
    key: 'task',
    icon: renderIcon(Layers)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'schedule'
          }
        },
        { default: () => '日程' }
      ),
    key: 'schedule',
    icon: renderIcon(CalendarNumber)
  },
  {
    label: '系统管理',
    key: 'sys',
    icon: renderIcon(Settings),
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'user'
              }
            },
            { default: () => '用户管理' }
          ),
        key: 'user',
        icon: renderIcon(PersonSharp)
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'role'
              }
            },
            { default: () => '角色管理' }
          ),
        key: 'role',
        icon: renderIcon(PersonSharp)
      },
      {
        label: '权限管理',
        key: 'food',
        icon: renderIcon(PersonSharp)
      }
    ]
  }
];
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
</script>

<style scoped></style>
