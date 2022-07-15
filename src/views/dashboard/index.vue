<template>
  <n-space vertical>
    <UserInfo />
    <n-grid x-gap="12" :cols="24">
      <n-gi :span="16">
        <n-space vertical>
          <TaskStatistics />
          <TaskTrend />
          <UserRank />
        </n-space>
      </n-gi>
      <n-gi :span="8">
        <n-space vertical>
          <CardItem />
          <UserStatus />
          <!-- <Clock /> -->
        </n-space>
      </n-gi>
    </n-grid>
  </n-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import UserInfo from './user-info.vue';
import TaskStatistics from './task-statistics.vue';
import TaskTrend from './task-trend.vue';
import CardItem from './card-item.vue';
import UserRank from './user-rank.vue';
import Clock from './clock.vue';
import UserStatus from './UserStatus.vue';

const message = useMessage();

function info() {
  message.info("I don't know why nobody told you how to unfold your love", {
    keepAliveOnHover: true
  });
}

const text = ref('dashaboard');
</script>

<style scoped></style>
