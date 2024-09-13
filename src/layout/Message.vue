<template>
  <n-tooltip trigger="hover">
    消息通知
    <template #trigger>
      <n-button tertiary circle @click="handleOnClick">
        <template #icon>
          <n-icon :component="Notifications" />
          <n-badge :value="unreadCount" dot style="position: absolute; top: -2px; right: -2px; z-index: 99"> </n-badge>
        </template>
      </n-button>
    </template>
  </n-tooltip>
  <n-drawer v-model:show="drawerShow" :width="430" placement="right">
    <n-drawer-content title="消息通知" closable :native-scrollbar="false">
      <n-card
        v-for="item in notificationList"
        :key="item.id"
        :bordered="false"
        :content-style="{ padding: '0px', marginBottom: '20px' }"
      >
        <div class="message-item">
          <n-avatar
            size="small"
            round
            :src="item.avatar"
            fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            class="message-avatar"
          />
          <div class="message-body">
            <h4 class="title">{{ item.title }}</h4>
            <div class="content" v-html="item.content"></div>
            <div class="bottom">
              <span class="date">{{ format(item.sendDate) }}</span>
              <n-button v-if="item.read === 0" text type="info" size="tiny" @click="markRead(item.id)"
                >标记已读</n-button
              >
            </div>
          </div>
        </div>
      </n-card>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { Notifications } from '@vicons/ionicons5'
import { useUserStore } from '@/store'
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useMessage } from 'naive-ui'

const userStore = useUserStore()
const message = useMessage()

const drawerShow = ref<boolean>(false)
function handleOnClick() {
  drawerShow.value = true
}

const unreadCount = computed(() => {
  return userStore.unReadCount
})
const notificationList = computed(() => {
  console.log(userStore.notificationList)
  return userStore.notificationList
})

function markRead(id: number) {
  userStore.readNotification({ id }).then(res => {
    message.success('操作成功', {
      keepAliveOnHover: true
    })
  })
}

function format(value: any) {
  return dayjs(value).format('MM月DD日 HH:mm:ss')
}
</script>

<style lang="scss" scoped>
.message-item {
  display: flex;
  align-items: flex-start;
  .message-avatar {
    margin: 10px 10px 0 0;
  }
  .message-body {
    height: 100%;
    flex: 1;
    .title {
      color: #303133;
      font-size: 14px;
      font-weight: 700;
      height: 25px;
      line-height: 25px;
      &:hover {
        color: #18a058;
        cursor: pointer;
      }
    }
    .content {
      margin: 4px 0;
      color: #606266;
      font-size: 13px;
    }
    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .date {
        font-size: 12px;
        color: #c2c3c5;
      }
    }
  }
}
</style>
