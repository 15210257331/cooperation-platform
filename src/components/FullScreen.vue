<template>
  <n-tooltip trigger="hover">
    全屏展示
    <template #trigger>
      <n-button tertiary circle style="margin: 0 8px" @click="toggleFullScreen">
        <template #icon>
          <n-icon :component="isFullscreen ? ContractSharp : ExpandSharp" />
        </template>
      </n-button>
    </template>
  </n-tooltip>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import {
  Home,
  ExpandSharp,
  ContractSharp,
  PersonCircleOutline,
  ColorPalette,
  LogOutOutline,
  ChevronDownOutline
} from '@vicons/ionicons5'

const { isFullscreen, toggle } = useFullscreen()

function toggleFullScreen() {
  toggle()
}
</script>

<style lang="scss" scoped></style>
