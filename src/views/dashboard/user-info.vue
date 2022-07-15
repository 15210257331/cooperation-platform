<template>
  <n-card size="small">
    <div style="display: flex; justify-content: space-between; align-items: center">
      <div style="display: flex; align-items: center">
        <n-avatar round :size="60" :src="userStore.userInfo.avatar" />
        <div style="padding-left: 12px">
          <h3 style="font-size: 18px; font-weight: 600">早安，{{ userStore.nickname }}, 今天又是充满活力的一天！</h3>
          <p style="line-height: 30px; color: rgb(153, 153, 153)">今日多云转晴，20℃ - 25℃！</p>
        </div>
      </div>
      <n-space :size="24" :wrap="false">
        <n-statistic
          v-for="item in statisticData"
          :key="item.id"
          class="whitespace-nowrap"
          :label="item.label"
          :value="item.animation ? undefined : item.value"
        >
          <n-number-animation v-if="item.animation" :from="0" :to="(item.value as number)" />
        </n-statistic>
      </n-space>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';
import dayjs from 'dayjs';

interface StatisticData {
  id: number;
  label: string;
  value: number | string;
  animation: boolean;
}

const userStore = useUserStore();

const statisticData: StatisticData[] = [
  {
    id: 0,
    label: '项目数',
    value: 25,
    animation: true
  },
  {
    id: 1,
    label: '待办',
    value: 34,
    animation: true
  },
  {
    id: 2,
    label: '当前日期',
    value: dayjs().format('YYYY/MM/DD'),
    animation: false
  }
];
</script>

<style scoped></style>
