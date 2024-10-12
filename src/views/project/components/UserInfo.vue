<template>
  <div class="user-info">
    <n-avatar dot :round="true" size="small" :src="avatar" />
    <span>{{ nickname }}</span>
  </div>
</template>

<script setup lang="ts">
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
