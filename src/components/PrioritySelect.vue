<template>
  <div class="priority-select">
    <div class="bg" :style="{ left: selectedIndex * 65 + 4 + 'px' }"></div>
    <div v-for="(item, index) in options" :key="item.value" class="priority-item">
      <n-button text size="tiny" :type="item.type" @click="handleClick(index)">
        <template #icon>
          <n-icon :component="FlagSharp" />
        </template>
        {{ item.label }}
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FlagSharp } from '@vicons/ionicons5'

interface Props {
  value: boolean | string | null
}
const props = defineProps<Props>()

interface Emits {
  (e: 'update:value', val: boolean): void
}
const emit = defineEmits<Emits>()

const options = ref([
  {
    label: '首要',
    type: 'error',
    value: 1
  },
  {
    label: '重要',
    type: 'warning',
    value: 2
  },
  {
    label: '次要',
    type: 'success',
    value: 3
  }
])

const selectedIndex = ref<number>(0)
function handleClick(index: number) {
  selectedIndex.value = index
}
</script>

<style lang="scss" scoped>
.priority-select {
  height: 32px;
  box-sizing: border-box;
  background-color: #f6f6f6ff;
  width: auto;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .bg {
    width: 53px;
    height: calc(100% - 8px);
    background-color: #2080f0;
    border-radius: 5px;
    position: absolute;
    transition: all 0.3s ease-in-out;
    left: 4px;
    top: 4px;
  }
  .priority-item {
    margin: 10px;
    cursor: pointer;
    span {
      font-size: 12px;
      font-weight: 500;
    }
  }
}
</style>
