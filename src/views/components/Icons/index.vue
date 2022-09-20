<template>
  <n-space vertical>
    <n-card
      size="small"
      title="图标使用"
      :segmented="{
        content: true
      }"
    >
      <SvgIcon name="cube" class="icon" />
      <SvgIcon name="heart" class="icon" />
      <SvgIcon name="mark" class="icon" />
      <SvgIcon name="Men" class="icon" />
      <SvgIcon name="star" class="icon" />
      <SvgIcon name="user-role" class="icon" />
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import SvgIcon from './SvgIcon.vue'
</script>

<style lang="scss" scoped></style>
