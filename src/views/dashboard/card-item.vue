<template>
  <n-card>
    <n-statistic label="你一共处理了" tabular-nums>
      <n-number-animation ref="numberAnimationInstRef" :from="0" :to="12039" />
      <template #suffix> 条群消息 </template>
    </n-statistic>
    <n-space vertical>
      花时间、花精力、花心思，愿你每一份努力都不负所望
      <n-button @click="handleClick"> 播放 </n-button>
    </n-space>
    <n-timeline>
      <n-timeline-item content="啊" />
      <n-timeline-item type="success" title="成功" content="哪里成功" time="2018-04-03 20:46" />
      <n-timeline-item type="error" content="哪里错误" time="2018-04-03 20:46" />
      <n-timeline-item type="warning" title="警告" content="哪里警告" time="2018-04-03 20:46" />
      <n-timeline-item type="info" title="信息" content="是的" time="2018-04-03 20:46" line-type="dashed" />
      <n-timeline-item content="啊" />
    </n-timeline>
  </n-card>
</template>

<script setup lang="ts">
import { NumberAnimationInst } from 'naive-ui';
import { ref } from 'vue';
const numberAnimationInstRef = ref<NumberAnimationInst | null>(null);
function handleClick() {
  numberAnimationInstRef.value?.play();
}
</script>

<style lang="scss" scoped></style>
