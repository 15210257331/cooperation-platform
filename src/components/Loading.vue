<template>
  <div class="spin-container">
    <n-spin size="large" :description="description" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  description?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: '正在努力加载中'
});
</script>

<style lang="scss" scoped>
.spin-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
