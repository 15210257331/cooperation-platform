<template>
  <n-space vertical>
    <p>平面过渡动画</p>
    <n-button @click="random">random</n-button>
    <transition-group move-class="mmm" tag="div" class="wraps">
      <div v-for="item in list" :key="item.id" class="item">{{ item.number }}</div>
    </transition-group>

    <p>状态过渡</p>
    <input v-model="number.current" type="number" step="20" />
    <div>{{ number.listNumber.toFixed(0) }}</div>
  </n-space>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import _ from 'lodash'
import gsap from 'gsap'
const list = ref(
  Array.apply(null, { length: 81 } as number[]).map((_, index) => {
    return {
      id: index,
      number: (index % 9) + 1
    }
  })
)
console.log(Array.call(null, { length: 81 }))
const random = () => {
  list.value = _.shuffle(list.value)
}

const number = reactive({
  current: 0,
  listNumber: 0
})
watch(
  () => number.current,
  (newValue, oldValue) => {
    gsap.to(number, {
      duration: 2,
      listNumber: newValue
    })
    number.listNumber = newValue
  }
)
</script>

<style lang="scss" scoped>
.wraps {
  display: flex;
  flex-wrap: wrap;
  width: calc(40px * 9 + 9px);
  .item {
    width: 40px;
    height: 40px;
    border: 1px solid #ccc;
    line-height: 40px;
    text-align: center;
  }
}
.mmm {
  transition: all 0.5s;
}
</style>
