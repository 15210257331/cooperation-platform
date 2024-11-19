<template>
  <n-config-provider
    :theme="appStore.darkTheme ? darkTheme : lightTheme"
    style="height: 100%"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <router-view />
          <NaiveProviderContent />
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { lightTheme, darkTheme, useMessage, useNotification, zhCN, dateZhCN } from 'naive-ui'
import { useAppStore } from '@/store/index'
import { defineComponent, h, onMounted } from 'vue'

const appStore = useAppStore()

onMounted(() => {
  const theme = localStorage.getItem('theme') || 'default'
  appStore.setTheme(theme)
})

// 将消息和通知挂载到window上以供非组件的ts文件中使用
function registerNaiveTools() {
  window.$message = useMessage()
  window.$notification = useNotification()
}

const NaiveProviderContent = defineComponent({
  setup() {
    registerNaiveTools()
  },
  render() {
    return h('div')
  }
})
</script>

<style lang="scss"></style>
