<template>
  <!-- 全局路由切换进度条 -->
  <div class="wrap">
    <div ref="bar" class="bar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const bar = ref<HTMLElement>()
const speed = ref<number>(0)
const timer = ref<number>(0)

const startLoading = () => {
  // console.log('kaishi')
  const dom = bar.value as HTMLElement
  speed.value = 1
  timer.value = window.requestAnimationFrame(function fn() {
    if (speed.value < 90) {
      speed.value += 1
      // console.log(dom)
      dom.style.width = speed.value + '%'
      timer.value = window.requestAnimationFrame(fn)
    } else {
      speed.value = 1
      window.cancelAnimationFrame(timer.value)
    }
  })
}

const endLoading = () => {
  // console.log('jieshu')
  const dom = bar.value as HTMLElement
  setTimeout(() => {
    window.requestAnimationFrame(() => {
      speed.value = 100
      dom.style.width = speed.value + '%'
      setTimeout(() => {
        dom.style.width = '0px'
      }, 200)
    })
  }, 500)
}

defineExpose({
  startLoading,
  endLoading
})
</script>

<style lang="scss" scoped>
.wrap {
  position: fixed;
  top: 0;
  width: 100%;
  height: 3px;
  z-index: 999;
  .bar {
    height: inherit;
    width: 0;
    background-color: #999;
  }
}
</style>
