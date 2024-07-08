<template>
  <div v-if="showTooltip" :class="['action-item', appStore.darkTheme ? 'dark' : 'light']" @click="handleClick">
    <n-tooltip :placement="placement" trigger="hover">
      <template #trigger>
        <div class="icon-wrap">
          <slot></slot>
        </div>
      </template>
      {{ tooltipContent }}
    </n-tooltip>
  </div>
  <div v-else :class="['action-item', appStore.darkTheme ? 'dark' : 'light']">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PopoverPlacement } from 'naive-ui'
import { useAppStore } from '@/store'

interface Props {
  /** tooltip显示文本 */
  tooltipContent?: string
  /** tooltip的位置 */
  placement?: PopoverPlacement
}

const appStore = useAppStore()

const props = withDefaults(defineProps<Props>(), {
  tooltipContent: '',
  placement: 'bottom'
})

const emit = defineEmits<{
  (e: 'onClick'): void
}>()

const showTooltip = computed(() => Boolean(props.tooltipContent))

function handleClick() {
  emit('onClick')
}
</script>

<style scoped lang="scss">
.action-item {
  padding: 0 10px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
  .icon-wrap {
    width: 36px;
    height: 36px;
    // background-color: #f6f6f6ff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
}

.light {
  .icon-wrap {
    background-color: #f6f6f6ff;
  }
  &:hover {
    background-color: #f6f6f6ff;
  }
}
.dark {
  .icon-wrap {
    background-color: #333333ff;
  }
  &:hover {
    background-color: #333333ff;
  }
}
</style>
