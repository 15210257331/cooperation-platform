<template>
  <n-layout-header bordered>
    <div style="flex: 1">
      <n-breadcrumb>
        <n-breadcrumb-item> <n-icon :component="Home" :size="15" /> 主页 </n-breadcrumb-item>
        <n-breadcrumb-item>
          <n-icon :component="currentRoute.meta.icon" :size="15" />
          {{ currentRoute.meta.title }}
        </n-breadcrumb-item>
      </n-breadcrumb>
    </div>
    <FullScreen />
    <Message />
    <ThemeSwitch />
    <n-dropdown :options="options" @select="handleSelect">
      <div
        class="action-wrap"
        :style="{ backgroundColor: appStore.darkTheme ? 'rgb(40, 40, 42)' : 'rgba(46, 51, 56, .05)' }"
      >
        <n-avatar round size="small">{{ userStore.userInfo.nickname.slice(0, 1) }}</n-avatar>
        <div class="nickname">{{ userStore.userInfo.nickname }}</div>
        <n-icon :size="18" :component="ChevronDownOutline" />
      </div>
    </n-dropdown>
    <ProfileModal v-model:value="showProfileModal" />
    <ThemeSetting v-model:value="showThemeSettingModal" />
  </n-layout-header>
</template>

<script setup lang="ts">
import Message from './Message.vue'
import FullScreen from '@/components/FullScreen.vue'
import ProfileModal from './ProfileModal.vue'
import ThemeSetting from './ThemeSetting.vue'
import { useAppStore, useUserStore, useProjectStore } from '@/store'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Home,
  ExpandSharp,
  ContractSharp,
  PersonCircleOutline,
  ColorPalette,
  LogOutOutline,
  ChevronDownOutline
} from '@vicons/ionicons5'
import { useRender } from '@/hooks'
import { DropdownOption, useDialog } from 'naive-ui'
import ThemeSwitch from '@/components/ThemeSwitch.vue'

const userStore = useUserStore()
const appStore = useAppStore()
const projectStore = useProjectStore()
const router = useRouter()
const route = useRoute()
const { renderIcon } = useRender()
const dialog = useDialog()
const showProfileModal = ref<boolean>(false)
const showThemeSettingModal = ref<boolean>(false)

const currentRoute = ref<any>(null)
watch(
  () => route.matched,
  value => {
    if (value) {
      currentRoute.value = value[value.length - 1]
    }
  },
  {
    immediate: true
  }
)

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
}
</script>

<style lang="scss" scoped>
.n-layout-header {
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
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
.user-info {
  height: 30px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  .username {
    display: inline-block;
    height: 15px;
    font-size: 13px;
    line-height: 14px;
    font-weight: 500;
  }
}

.action-wrap {
  min-width: 38px;
  width: auto;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 19px;
  padding: 0 6px;
}
.nickname {
  font-size: 14px;
  margin: 0 4px 0 8px;
  font-weight: 500;
  line-height: 16px;
}
</style>
