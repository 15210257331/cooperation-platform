<template>
  <n-layout has-sider :style="styleObj">
    <SideBar />
    <n-layout>
      <TopBar></TopBar>
      <n-layout-content has-sider>
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import TopBar from './TopBar.vue'
import { onMounted, getCurrentInstance, computed, Component, h, ref } from 'vue'
import { getUserInfo } from '@/api'
import { useAppStore, useUserStore, useProjectStore } from '@/store'
import SideBar from './SideBar.vue'

const appStore = useAppStore()
const userStore = useUserStore()
const styleObj = computed(() => {
  return {
    height: '100%',
    background: appStore.darkTheme ? 'rgb(40, 40, 42)' : '#F5F5F5'
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
  height: calc(100% - 50px);
  width: 100%;
  box-sizing: border-box;
  ::v-deep(.n-layout-scroll-container) {
    width: 100%;
    // display: flex;
    // overflow: hidden;
  }
}
</style>
