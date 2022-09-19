<template>
  <n-layout has-sider style="height: 100%">
    <SiderBar />
    <n-layout>
      <HeaderBar />
      <n-layout-content
        content-style="padding: 15px;"
        :style="{ 'background-color': appStore.darkTheme ? '#101014ff' : '#f3f5f7' }"
      >
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { onMounted, getCurrentInstance } from 'vue'
import SiderBar from './SiderBar/index.vue'
import HeaderBar from './HeaderBar/index.vue'
import { getUserInfo } from '@/api'
import { useLocalStorage } from '@/hooks'
import { useAppStore, useUserStore, useProjectStore } from '@/store'

const userStore = useUserStore()
const appStore = useAppStore()
const projectStore = useProjectStore()
const queryParams = {
  pageIndex: 1,
  pageSize: 10
}

// const { appContext } = getCurrentInstance() as any;
// console.log('组件实例');
// console.log(appContext.config.globalProperties.$title);

onMounted(async () => {
  queryUserInfo()
  queryNotificationList()
  queryUnreadCount()
  await queryProjectList()
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

/** 请求项目列表 */
async function queryProjectList() {
  await projectStore.getProjectList()
}

function queryNotificationList() {
  userStore.queryNotificationList(queryParams)
}
function queryUnreadCount() {
  userStore.queryUnreadCount()
}
</script>

<style scoped lang="scss">
.n-layout-content {
  // background-color: #f3f5f7;
  height: calc(100% - 56px);
}
</style>
