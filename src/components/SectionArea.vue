<template>
  <div class="section-area">
    <div class="section-area-title">
      <div class="title">
        <p>{{ title }}</p>
        <span>{{ subTitle }}</span>
      </div>
      <slot name="action"></slot>
    </div>
    <div class="section-area-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  subTitle?: string
}>()
</script>

<style lang="scss" scoped>
.section-area {
  margin-bottom: 10px;
  .section-area-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px 0 4px;
    margin-bottom: 5px;
    .title {
      flex: 1;
      p {
        text-align: left;
        font-size: 16px;
        font-weight: 500;
        display: inline-block;
      }
      span {
        font-size: 12px;
        font-weight: 500;
        color: #666;
        vertical-align: text-bottom;
      }
    }
  }
  .section-area-content {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
