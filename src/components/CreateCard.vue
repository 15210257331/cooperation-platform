<template>
  <n-card hoverable :content-style="{ padding: '0', width: '100%'}" class="create-card">
    <div class="create-card-content" @click="handleClick">
      <img :src="icon" alt="" />
      <span>{{ title }}</span>
      <n-icon size="20" :component="Add"></n-icon>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { Add } from '@vicons/ionicons5'

const props = defineProps<{
  icon: string
  title: string
  type: number
}>()
const emits = defineEmits<{
  (e: 'card:click', type: number): void
}>()

function handleClick() {
  emits('card:click', props.type)
}
</script>

<style lang="scss" scoped>
.create-card {
  display: flex;
  height: 72px;
  width: 220px;
  margin-right: 20px;
  cursor: pointer;
}
.create-card-content {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  padding: 0 20px;
  img {
    width: 36px;
    height: 36px;
    margin-right: 6px;
  }
  span {
    flex: 1;
    // color: rgb(51, 54, 57);
    font-size: 14px;
  }
}
</style>
