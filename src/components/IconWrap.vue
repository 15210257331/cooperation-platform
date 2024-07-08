<template>
  <div class="icon-wrap">
    <div :class="['content', dashesBorder && 'dashes-border']">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  dashesBorder: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.icon-wrap {
  display: inline-block;
  width: 32px;
  height: 32px;
  cursor: pointer;
  margin: 0 4px;
  .content {
    width: 100%;
    height: 100%;
    background-color: #f6f6f6ff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .dashes-border {
    border: 1px dashed #2080f0;
  }
}
</style>
