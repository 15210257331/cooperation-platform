<template>
  <div class="create-card" @click="handleClick">
    <img :src="icon" alt="" />
    <span>{{ title }}</span>
    <n-icon size="20" :component="Add"></n-icon>
  </div>
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
  border: 1px solid #e4e4e5;
  cursor: pointer;
  border-radius: 8px;
  align-items: center;
  padding: 0 16px;
  background-color: white;
  transition: all 0.3s ease;
  margin: 0 16px 0 0;
  &:hover {
    border: 1px solid #eee;
    background: #eee;
  }
  img {
    width: 36px;
    height: 36px;
    margin-right: 6px;
  }
  span {
    flex: 1;
    color: rgb(51, 54, 57);
    font-size: 14px;
  }
}
</style>
