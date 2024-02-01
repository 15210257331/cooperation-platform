<template>
  <n-layout-header bordered>
    <AppLogo />
    <!-- <nav class="nav_list">
      <router-link v-for="item in routes" :key="item.path" active-class="active" :to="item.path">
        {{ item.meta.title }}
      </router-link>
    </nav> -->
    <div style="flex: 1; display: flex; justify-content: center; align-items: center">
      <slot></slot>
    </div>
    <ActionContainer :tooltip-content="'全屏'" @click="toggleFullScreen">
      <n-icon size="25" :component="isFullscreen ? ContractSharp : ExpandSharp" />
    </ActionContainer>
    <ActionContainer :tooltip-content="'主题模式'" @click="toggleTheme">
      <n-icon size="25" :component="appStore.darkTheme === true ? Moon : SunnyOutline" />
    </ActionContainer>
    <Message />
    <n-dropdown :options="options" @select="handleSelect">
      <ActionContainer>
        <n-avatar round size="small" :src="userStore.userInfo.avatar" />
        <span class="user-name">{{ userStore.nickname }}</span>
      </ActionContainer>
    </n-dropdown>
    <ProfileModal v-model:value="showProfileModal" />
    <ThemeSetting v-model:value="showThemeSettingModal" />
  </n-layout-header>
</template>

<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
import Message from './Message.vue'
import ProfileModal from './ProfileModal.vue'
import ThemeSetting from './ThemeSetting.vue'
import ActionContainer from '@/components/ActionContainer.vue'
import { AppsSharp, Search, ChevronDown } from '@vicons/ionicons5'
import { useAppStore, useUserStore, useProjectStore } from '@/store'
import { useFullscreen } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  SunnyOutline,
  Moon,
  ExpandSharp,
  ContractSharp,
  PersonCircleOutline,
  ColorPalette,
  LogOutOutline
} from '@vicons/ionicons5'
import { useRender } from '@/hooks'
import { DropdownOption, useDialog } from 'naive-ui'

const userStore = useUserStore()
const appStore = useAppStore()
const projectStore = useProjectStore()
const router = useRouter()
const { renderIcon } = useRender()
const { isFullscreen, toggle } = useFullscreen()
const dialog = useDialog()
const showProfileModal = ref<boolean>(false)
const showThemeSettingModal = ref<boolean>(false)
const routes = router.getRoutes().filter(item => item.meta?.show)
const keywords = ref<string>('')
function handleSearch(params: any) {
  console.log(params)
}

const options = [
  {
    label: '编辑用户资料',
    key: 'profile',
    icon: renderIcon(PersonCircleOutline)
  },
  {
    label: '自定义主題',
    key: 'themeSetting',
    icon: renderIcon(ColorPalette)
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutOutline)
  }
]
function toggleTheme() {
  appStore.toggleTheme()
}
function toggleFullScreen() {
  toggle()
}
function handleSelect(key: string | number, option: DropdownOption) {
  if (key === 'logout') {
    dialog.warning({
      title: '警告',
      content: '你确定退出当前登录吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        localStorage.removeItem('token')
        userStore.clearUserInfo()
        router.push({
          name: 'login'
        })
      },
      onNegativeClick: () => {}
    })
  }
  if (key === 'profile') {
    showProfileModal.value = true
  }
  if (key === 'themeSetting') {
    showThemeSettingModal.value = true
  }
}
</script>

<style lang="scss" scoped>
.n-layout-header {
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  box-sizing: border-box;
  position: relative;
}
.view-list {
  flex: 1;
}
.nav_list {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  a {
    height: 56px;
    list-style: none;
    line-height: 56px;
    color: #888;
    font-size: 14px;
    font-weight: 500;
    margin: 0 20px;
    cursor: pointer;
    position: relative;
    &:hover {
      color: var(--nice-primary-color);
    }
  }
  a.active {
    color: var(--nice-primary-color);
    &::after {
      content: '';
      width: calc(100% + 10px);
      height: 2px;
      border-radius: 1px;
      background-color: var(--nice-primary-color);
      position: absolute;
      bottom: 0;
      left: -5px;
    }
  }
}
span.user-name {
  font-weight: 500;
  font-size: 16px;
  padding-left: 8px;
  vertical-align: super;
}
</style>
