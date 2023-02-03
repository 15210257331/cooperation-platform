<template>
  <n-layout-header bordered>
    <AppLogo />
    <ul class="nav_list">
      <li
        v-for="item in list"
        :key="item.title"
        :class="{ active: route.name === item.route ? true : false }"
        @click="navigate(item.route)"
      >
        {{ item.title }}
      </li>
    </ul>
    <ActionContainer :tooltip-content="'主题模式'" @click="toggleTheme">
      <n-icon size="25" :component="appStore.darkTheme === true ? Moon : SunnyOutline" />
    </ActionContainer>
    <ActionContainer :tooltip-content="'全屏'" @click="toggleFullScreen">
      <n-icon size="25" :component="isFullscreen ? ContractSharp : ExpandSharp" />
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
import { useAppStore, useUserStore } from '@/store'
import { useFullscreen } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
const route = useRoute()
const { renderIcon } = useRender()
const { isFullscreen, toggle } = useFullscreen()
const dialog = useDialog()
const showProfileModal = ref<boolean>(false)
const showThemeSettingModal = ref<boolean>(false)
const list = ref<
  Array<{
    title: string
    route: string
  }>
>([
  {
    title: '项目概览',
    route: 'project'
  },
  {
    title: '任务看板',
    route: 'task'
  },
  {
    title: '用户',
    route: 'user'
  },
  {
    title: '组件示例',
    route: 'components'
  }
])

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

function navigate(name: string) {
  router.push({
    name: name
  })
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
  position: relative;
}
.nav_list {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  li {
    height: 60px;
    line-height: 60px;
    color: #888;
    font-size: 14px;
    font-weight: 500;
    margin: 0 20px;
    cursor: pointer;
    position: relative;
    &:hover {
      color: #18a058;
    }
  }
  li.active {
    color: #18a058;
    &::after {
      content: '';
      width: calc(100% + 10px);
      height: 2px;
      border-radius: 1px;
      background-color: #18a058;
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
