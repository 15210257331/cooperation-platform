<template>
  <div class="theme-switch" :style="{ backgroundColor: appStore.darkTheme ? 'rgb(40, 40, 42)' : 'rgba(46, 51, 56, .05)' }">
    <span
      class="theme-bg"
      :style="{
        left: isDarkTheme ? '6px' : '46px',
        backgroundColor: appStore.darkTheme ? 'rgb(24, 24, 28)' : '#FFFFFF'
      }"
    ></span>
    <n-icon size="20" :component="Moon" class="theme-item" @click="toggleTheme" />
    <n-icon size="20" :component="SunnyOutline" class="theme-item" @click="toggleTheme" />
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store'
import { SunnyOutline, Moon } from '@vicons/ionicons5'
import { computed, ref, watch } from 'vue'
import { useCssVariable } from '@/hooks'

const appStore = useAppStore()

const isDarkTheme = computed(() => {
  return appStore.darkTheme
})

/** 切换主题时动态重新获取一下最新的主题颜色 */
const nicePrimaryColor = ref<string>()
watch(
  () => appStore.theme,
  () => {
    nicePrimaryColor.value = useCssVariable('--nice-primary-color') as string
    console.log('nicePrimaryColor:', nicePrimaryColor)
  },
  {
    immediate: true
  }
)

function toggleTheme() {
  appStore.toggleTheme()
}
</script>

<style lang="scss" scoped>
.theme-switch {
  width: auto;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 19px;
  padding: 0 10px;
  position: relative;
  margin: 0 8px;
  .theme-item {
    cursor: pointer;
    &:last-child {
      margin-left: 20px;
    }
  }
  .theme-bg {
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    transition: all 0.3s linear;
  }
}
</style>
