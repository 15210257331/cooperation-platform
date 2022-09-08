<template>
  <n-card
    size="small"
    title="消息中心"
    :segmented="{
      content: true
    }"
  >
    <n-timeline>
      <n-timeline-item
        v-for="(item, index) in messgeList"
        :key="index"
        type="success"
        :title="item.title"
        :content="item.content"
        :time="item.time"
      />
    </n-timeline>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  title: string;
  content: string;
  avatar: string;
  time: string;
}

const messgeList = ref<Array<Message>>([
  {
    title: '通知消息',
    content: '小xx新建了一个任务',
    avatar: 'http://www.example.com',
    time: '2020年07月16日'
  },
  {
    title: '通知消息',
    content: '小xx新建了一个任务',
    avatar: 'http://www.example.com',
    time: '2020年07月16日'
  },
  {
    title: '通知消息',
    content: '小xx新建了一个任务',
    avatar: 'http://www.example.com',
    time: '2020年07月16日'
  },
  {
    title: '通知消息',
    content: '小xx新建了一个任务',
    avatar: 'http://www.example.com',
    time: '2020年07月16日6'
  },
  {
    title: '通知消息',
    content: '小xx新建了一个任务',
    avatar: 'http://www.example.com',
    time: '2020年07月16日'
  }
])
</script>

<style lang="scss" scoped></style>
