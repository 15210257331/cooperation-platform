<template>
  <n-space vertical>
    <n-card
      size="small"
      title="echarts钟表"
      :segmented="{
        content: true
      }"
    >
      <EchartsClock />
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import EchartsClock from './EchartsClock.vue'
</script>

<style lang="scss" scoped></style>
