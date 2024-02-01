<template>
  <n-layout :style="styleObj">
    <TopBar />
    <n-layout-content :style="{ 'background-color': appStore.darkTheme ? '#101014ff' : 'rgba(236, 241, 250,0)' }">
      <SideBar />
      <router-view />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import TopBar from './TopBar.vue'
import SideBar from './Sidebar.vue'
import { onMounted, getCurrentInstance, computed, Component, h, ref } from 'vue'
import { getUserInfo } from '@/api'
import { useAppStore, useUserStore, useProjectStore } from '@/store'

const appStore = useAppStore()
const userStore = useUserStore()

const styleObj = computed(() => {
  return {
    height: '100%',
    background: appStore.darkTheme ? 'rgb(40, 40, 42)' : 'linear-gradient(180deg, #fccae7, #dbe0ed)'
  }
})

onMounted(async () => {
  queryNotificationList()
  queryUnreadCount()
})

/** 请求用户信息 */
queryUserInfo()
function queryUserInfo() {
  getUserInfo().then(res => {
    if (res.code === 10000) {
      const userInfo = res.data
      userStore.setUserInfo(userInfo)
    }
  })
}

const queryParams = {
  pageIndex: 1,
  pageSize: 10
}
function queryNotificationList() {
  userStore.queryNotificationList(queryParams)
}

function queryUnreadCount() {
  userStore.queryUnreadCount()
}
</script>

<style lang="scss" scoped>
.n-layout-content {
  height: calc(100% - 56px);
  width: 100%;
  box-sizing: border-box;
  padding: 24px 0;
  ::v-deep(.n-layout-scroll-container) {
    width: 100%;
    display: flex;
    // overflow: hidden;
  }
}
</style>
