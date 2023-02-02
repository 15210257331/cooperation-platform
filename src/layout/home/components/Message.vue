<template>
  <n-popover trigger="hover" placement="bottom-start">
    <template #trigger>
      <ActionContainer :tooltip-content="'消息通知'">
        <n-icon size="25" :component="Notifications" />
        <n-badge :value="unreadCount" :max="99" style="position: absolute; top: 10px; right: 2px" />
      </ActionContainer>
    </template>
    <div style="width: 370px; height: 400px; overflow: auto; padding: 10px 10px 0 0">
      <n-space vertical>
        <n-card
          v-for="item in notificationList"
          :key="item.id"
          class="notification"
          :bordered="false"
          :content-style="{ padding: '8px 0px 8px 0' }"
        >
          <div class="notification-header">
            <n-avatar size="small" round :src="item.avatar" />
            <h2>{{ item.title }}</h2>
            <n-button v-if="item.read === 0" text type="success" @click="readNotification(item.id)">标记已读</n-button>
          </div>
          <div class="notification-content" v-html="item.content"></div>
          <div class="notification-footer">
            <span>{{ format(item.sendDate) }}</span>
          </div>
        </n-card>
      </n-space>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { Notifications } from '@vicons/ionicons5'
import { useUserStore } from '@/store'
import { computed } from 'vue'
import dayjs from 'dayjs'

const userStore = useUserStore()

const unreadCount = computed(() => {
  return userStore.unReadCount
})
const notificationList = computed(() => {
  return userStore.notificationList
})

function readNotification(id: number) {
  userStore.readNotification({ id })
}

function format(value: any) {
  return dayjs(value).format('MM月DD日 HH:mm:ss')
}
</script>

<style lang="scss" scoped>
.notification {
  cursor: pointer;
  &:hover {
    background-color: #f8f8f9;
  }
}
.notification-header {
  display: flex;
  align-items: center;
  padding: 0 4px;
  h2 {
    font-size: 17px;
    font-weight: 600;
    margin-left: 10px;
    flex: 1;
  }
}
.notification-content {
  padding: 0 0 0 40px;
}
.notification-footer {
  padding: 0 10px 0 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  span {
    color: #888;
    font-size: 12px;
    font-weight: 600;
  }
}
</style>
