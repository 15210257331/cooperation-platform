<template>
  <n-card :bordered="false">
    <n-calendar v-model:value="value" #default="{ year, month, date }" @update:value="handleUpdateValue">
      {{ year }}-{{ month }}-{{ date }}
    </n-calendar>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { isYesterday, addDays } from 'date-fns/esm';

const message = useMessage();
const value = ref(addDays(Date.now(), 1).valueOf());
function handleUpdateValue(_: number, { year, month, date }: { year: number; month: number; date: number }) {
  message.success(`${year}-${month}-${date}`);
}
</script>

<style lang="scss" scoped></style>
