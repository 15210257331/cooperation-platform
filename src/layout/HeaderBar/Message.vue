<template>
  <n-popover trigger="click" placement="bottom-start">
    <template #trigger>
      <ActionContainer :tooltip-content="'消息通知'">
        <n-icon size="25" :component="Notifications" />
        <n-badge :value="unreadCount" :max="99" style="position: absolute; top: 10px; right: 2px" />
      </ActionContainer>
    </template>
    <div style="width: 420px; height: 400px; overflow: auto; padding: 4px">
      <n-space vertical>
        <n-card :bordered="true" :content-style="{ padding: '10px' }" v-for="item in notificationList" :key="item.id">
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
import { Notifications } from '@vicons/ionicons5';
import { useUserStore } from '@/store';
import { computed } from 'vue';
import dayjs from 'dayjs';

const userStore = useUserStore();

const unreadCount = computed(() => {
  return userStore.unReadCount;
});
const notificationList = computed(() => {
  return userStore.notificationList;
});

function readNotification(id: number) {
  userStore.readNotification({ id });
}

function format(value: any) {
  return dayjs(value).format('YYYY年MM月DD日 HH:mm:ss');
}
</script>

<style lang="scss" scoped>
.notification-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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
  margin-bottom: 10px;
}
.notification-footer {
  padding: 0 10px 0 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  span {
    color: rgb(118, 124, 130);
    font-size: 12px;
    font-weight: 600;
  }
}
</style>
