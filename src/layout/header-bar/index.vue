<template>
  <n-layout-header bordered>
    <ActionContainer :tooltip-content="'折叠'" @click="toggleCollapse">
      <n-icon
        size="25"
        :style="{ transition: 'all 0.3s' }"
        :class="{ collapse: appStore.siderCollapse }"
        :component="ListSharp"
      />
    </ActionContainer>

    <Breadcrumb />

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
  </n-layout-header>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import type { Component } from 'vue';
import { useAppStore, useUserStore } from '@/store';
import {
  SunnyOutline,
  Moon,
  ListSharp,
  ExpandSharp,
  ContractSharp,
  PersonCircleOutline,
  Pencil,
  LogOutOutline
} from '@vicons/ionicons5';
import { DropdownOption, NIcon, useDialog } from 'naive-ui';
import { useRouter } from 'vue-router';
import Breadcrumb from './breadcrumb.vue';
import { useFullscreen } from '@vueuse/core';
import ProfileModal from './profile-modal.vue';
import ActionContainer from '@/components/action-container/index.vue';
import Message from './message.vue';

const showProfileModal = ref<boolean>(false);

const userStore = useUserStore();
const appStore = useAppStore();
const router = useRouter();
const { isFullscreen, toggle } = useFullscreen();
const dialog = useDialog();

function toggleTheme() {
  appStore.toggleTheme();
}
function toggleCollapse() {
  appStore.toggleCollapse();
}
function toggleFullScreen() {
  toggle();
}
const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    });
  };
};
const options = [
  {
    label: '用户资料',
    key: 'profile',
    icon: renderIcon(PersonCircleOutline)
  },
  {
    label: '编辑用户资料',
    key: 'editProfile',
    icon: renderIcon(Pencil)
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutOutline)
  }
];
function handleSelect(key: string | number, option: DropdownOption) {
  console.log(key, option);
  if (key === 'logout') {
    dialog.warning({
      title: '警告',
      content: '你确定退出当前登录吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        localStorage.removeItem('token');
        userStore.clearUserInfo();
        router.push({
          name: 'login'
        });
      },
      onNegativeClick: () => {}
    });
  }
  if (key === 'profile') {
    showProfileModal.value = true;
  }
}
</script>

<style lang="scss" scoped>
.n-layout-header {
  padding: 0 15px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  box-sizing: border-box;
}
span.user-name {
  font-weight: 500;
  font-size: 16px;
  padding-left: 8px;
  vertical-align: super;
}
.collapse {
  transform: rotate(180deg);
}
</style>
