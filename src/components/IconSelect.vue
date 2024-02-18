<template>
  <div class="icon-select">
    <template v-if="onlyShow">
      <n-icon size="17" color="#338fe4" :component="selectedIcon.component" />
    </template>
    <template v-else>
      <div v-for="item in icons" :key="item.name" class="icon-item" @click="selectItem(item.name)">
        <n-icon size="20" color="#338fe4" :component="item.component" />
        <label class="no-selected" :class="{ selected: item.name === modelValue }" for="choose">
          <input style="width: 0; height: 0" type="checkbox" clsss="choose" />
        </label>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FileTrayFull, LogoBuffer, ShieldCheckmark, BookmarksSharp, CloudDone } from '@vicons/ionicons5'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  onlyShow: {
    required: false,
    type: Boolean
  },
  default: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

const selectedIcon = computed(() => {
  const selected = icons.find(item => item.name === props.default)
  return selected ? selected : icons[0]
})

const icons = [
  {
    name: 'FileTrayFull',
    component: FileTrayFull
  },
  {
    name: 'LogoBuffer',
    component: LogoBuffer
  },
  {
    name: 'ShieldCheckmark',
    component: ShieldCheckmark
  },
  {
    name: 'BookmarksSharp',
    component: BookmarksSharp
  },
  {
    name: 'CloudDone',
    component: CloudDone
  }
]

function selectItem(name: string) {
  emit('update:modelValue', name)
}
</script>

<style lang="scss" scoped>
.icon-select {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.icon-item {
  cursor: pointer;
  width: 46px;
  height: 46px;
  border-radius: 23px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(46, 51, 56, 0.05);
  margin-right: 20px;
  position: relative;
}
.no-selected {
  display: none;
}
.selected {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #22d7bb;
  position: absolute;
  right: -5px;
  top: 26px;
  cursor: pointer;
  &:after {
    content: '';
    display: inline-block;
    border: 3px solid #fff;
    border-top-width: 0;
    border-left-width: 0;
    width: 6px;
    height: 14px;
    transform: rotate(45deg);
    position: absolute;
    top: 2px;
    left: 7px;
  }
}
</style>
