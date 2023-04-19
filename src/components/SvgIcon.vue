<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>
<!-- 
     使用示例
     <SvgIcon name="cube" class="icon" />
      <SvgIcon name="heart" class="icon" />
      <SvgIcon name="mark" class="icon" />
      <SvgIcon name="Men" class="icon" />
      <SvgIcon name="star" class="icon" />
      <SvgIcon name="user-role" class="icon" />
 -->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#333'
  }
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style scope lang="scss">
.svg-icon {
  display: inline-block;
  margin: 0 6px;
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.1em; /* 因icon大小被设置为和字体大小一致，而span等标签的下边缘会和字体的基线对齐，故需设置一个往下的偏移比例，来纠正视觉上的未对齐效果 */
  fill: currentColor; /* 定义元素的颜色，currentColor是一个变量，这个变量的值就表示当前元素的color值，如果当前元素未设置color值，则从父元素继承 */
  overflow: hidden;
}
</style>
