<template>
  <div class="user-info">
    <n-avatar dot :round="true" size="small" :src="avatar" :fallback-src="defaultAvatar"/>
    <span>{{ nickname }}</span>
  </div>
</template>

<script setup lang="ts">
import { defaultAvatar } from '@/config'
const props = defineProps<{
  avatar: string
  nickname: string
}>()
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    margin-left: 8px;
    font-size: 14px;
  }
}
</style>
