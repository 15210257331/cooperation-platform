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
import { onMounted } from 'vue';
import SiderBar from './SiderBar/index.vue';
import HeaderBar from './HeaderBar/index.vue';
import { getUserInfo } from '@/api';
import { useAppStore, useUserStore } from '@/store';

const userStore = useUserStore();
const appStore = useAppStore();

onMounted(() => {
  queryUserInfo();
});

function queryUserInfo() {
  getUserInfo().then(res => {
    if (res.code === 10000) {
      const userInfo = res.data;
      userStore.setUserInfo(userInfo);
    }
  });
}
</script>

<style scoped lang="scss">
.n-layout-content {
  // background-color: #f3f5f7;
  height: calc(100% - 56px);
}
</style>
