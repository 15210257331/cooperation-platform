<template>
  <n-config-provider :theme="appStore.darkTheme ? darkTheme : lightTheme" style="height: 100%">
    <n-dialog-provider>
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { lightTheme, darkTheme } from 'naive-ui';
import { useAppStore } from '@/store/index';

const appStore = useAppStore();
</script>

<style lang="scss"></style>
