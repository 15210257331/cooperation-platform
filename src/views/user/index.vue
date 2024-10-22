<template>
  <div class="user-wrap" :style="{ backgroundColor: appStore.darkTheme ? 'rgba(255, 255, 255, 0.12)' : '#f9f9f9' }">
    <div class="header" :style="{ backgroundColor: appStore.darkTheme ? 'rgb(24, 24, 28)' : 'white' }">
      <n-tabs type="bar" @update:value="handleChange">
        <n-tab v-for="item in tabs" :key="item.value" :name="item.value">{{ item.title }}</n-tab>
      </n-tabs>
    </div>
    <div class="content">
      <component :is="currentView"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref, markRaw } from 'vue'
import { useAppStore } from '@/store'
import UserList from './components/UserList.vue'
import RoleList from './components/RoleList.vue'

const appStore = useAppStore()

const tabs = ref<Array<any>>([
  {
    title: '用户管理',
    value: 'user',
    component: markRaw(UserList)
  },
  {
    title: '角色管理',
    value: 'role',
    component: markRaw(RoleList)
  }
])
const currentView = ref(markRaw(UserList))
function handleChange(value: string) {
  currentView.value = tabs.value.find(item => item.value === value).component
}
</script>

<style lang="scss" scoped>
.user-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    background-color: white;
  }

  .content {
    width: 100%;
    flex: 1;
    overflow: auto;
    padding: 15px;
  }
}

.user {
  padding: 10px;
}
</style>
