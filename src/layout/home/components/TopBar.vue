<template>
  <n-layout-header bordered>
    <AppLogo />
    <NavList />
    <Message />
    <ActionContainer :tooltip-content="'全屏'" @click="toggleFullScreen">
      <n-icon size="25" :component="isFullscreen ? ContractSharp : ExpandSharp" />
    </ActionContainer>
    <ActionContainer :tooltip-content="'主题模式'" @click="toggleTheme">
      <n-icon size="25" :component="appStore.darkTheme === true ? Moon : SunnyOutline" />
    </ActionContainer>
    <n-dropdown :options="options" @select="handleSelect">
      <ActionContainer>
        <n-avatar round size="small" :src="userStore.userInfo.avatar" />
        <!-- <span class="user-name">{{ userStore.nickname }}</span> -->
      </ActionContainer>
    </n-dropdown>
    <ProfileModal v-model:value="showProfileModal" />
    <ThemeSetting v-model:value="showThemeSettingModal" />
  </n-layout-header>
</template>

<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
import Message from './Message.vue'
import NavList from './NavList.vue'
import ProfileModal from './ProfileModal.vue'
import ThemeSetting from './ThemeSetting.vue'
import ActionContainer from '@/components/ActionContainer.vue'
import { useAppStore, useUserStore } from '@/store'
import { useFullscreen } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  SunnyOutline,
  Moon,
  ListSharp,
  ExpandSharp,
  ContractSharp,
  PersonCircleOutline,
  ColorPalette,
  LogOutOutline,
  CogSharp
} from '@vicons/ionicons5'
import { useRender } from '@/hooks'
import { DropdownOption, useDialog } from 'naive-ui'

const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()
const { renderIcon } = useRender()
const { isFullscreen, toggle } = useFullscreen()
const dialog = useDialog()
const showProfileModal = ref<boolean>(false)
const showThemeSettingModal = ref<boolean>(false)

function toggleTheme() {
  appStore.toggleTheme()
}
function toggleCollapse() {
  appStore.toggleCollapse()
}
function toggleFullScreen() {
  toggle()
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
    label: '系统管理',
    key: 'admin',
    icon: renderIcon(CogSharp)
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutOutline)
  }
]
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

  if (key === 'admin') {
    router.push({
      name: 'admin'
    })
  }
}
</script>

<style lang="scss" scoped>
.n-layout-header {
  padding: 0 15px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  box-sizing: border-box;
}
</style>
