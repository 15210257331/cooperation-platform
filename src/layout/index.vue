<template>
  <n-layout :style="{ height: '100%', 'background-color': appStore.darkTheme ? 'rgb(40, 40, 42)' : '#f4f7fd' }">
    <TopBar />
    <n-layout-content :style="{ 'background-color': appStore.darkTheme ? '#101014ff' : '#FFFFFF' }">
      <router-view />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import TopBar from './TopBar.vue'
import { onMounted, getCurrentInstance } from 'vue'
import { getUserInfo } from '@/api'
import { useLocalStorage } from '@/hooks'
import { useAppStore, useUserStore, useProjectStore } from '@/store'

const appStore = useAppStore()
const userStore = useUserStore()

const queryParams = {
  pageIndex: 1,
  pageSize: 10
}

queryUserInfo()

onMounted(async () => {
  queryNotificationList()
  queryUnreadCount()
})

/** 请求用户信息 */
function queryUserInfo() {
  getUserInfo().then(res => {
    if (res.code === 10000) {
      const userInfo = res.data
      userStore.setUserInfo(userInfo)
    }
  })
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
  height: calc(100% - 70px);
  margin-top: 10px;
  padding: 0 25px 25px 25px;
}
</style>
