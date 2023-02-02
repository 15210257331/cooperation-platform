<template>
  <n-layout has-sider style="height: 100%">
    <SideBar />
    <n-layout>
      <HeaderBar />
      <n-layout-content :style="{ 'background-color': appStore.darkTheme ? '#101014ff' : '#f3f5f7' }">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { onMounted, getCurrentInstance } from 'vue'
import SideBar from './SideBar/index.vue'
import HeaderBar from './HeaderBar/index.vue'
import { getUserInfo } from '@/api'
import { useLocalStorage } from '@/hooks'
import { useAppStore, useUserStore, useProjectStore } from '@/store'

const userStore = useUserStore()
const appStore = useAppStore()
const projectStore = useProjectStore()

// const { appContext } = getCurrentInstance() as any;
// console.log('组件实例');
// console.log(appContext.config.globalProperties.$title);
</script>

<style scoped lang="scss">
.n-layout-content {
  // background-color: #f3f5f7;
  height: calc(100% - 56px);
}
</style>
