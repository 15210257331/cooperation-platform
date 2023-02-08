<template>
  <n-space vertical style="margin-top: 15px">
    <n-card
      size="small"
      title="图片验证码"
      :segmented="{
        content: true
      }"
    >
      <ImageCode v-model:code="imgCode" />
      <span>验证码的值为{{ imgCode }}</span>
    </n-card>

    <n-card
      size="small"
      title="自定义主题测试"
      :segmented="{
        content: true
      }"
    >
      <div class="theme">自定义主题测试</div>
    </n-card>

    <n-card
      size="small"
      title="自定义全局属性测试"
      :segmented="{
        content: true
      }"
    >
      <GlobalProperty />
    </n-card>

    <n-card
      size="small"
      title="动画"
      :segmented="{
        content: true
      }"
    >
      <Animation />
    </n-card>

    <n-card
      size="small"
      title="全局事件总线"
      :segmented="{
        content: true
      }"
    >
      <n-space horizontal>
        <BusA></BusA>
        <BusB></BusB>
      </n-space>
    </n-card>

    <n-card
      size="small"
      title="自定义loading插件"
      :segmented="{
        content: true
      }"
    >
      <n-button @click="show">显示loading</n-button>
      <n-button @click="hide">关闭loading</n-button>
    </n-card>

    <n-card
      size="small"
      title="svgIcon图标使用"
      :segmented="{
        content: true
      }"
    >
      <SvgIcon name="cube" class="icon" />
      <SvgIcon name="heart" class="icon" />
      <SvgIcon name="mark" class="icon" />
      <SvgIcon name="Men" class="icon" />
      <SvgIcon name="star" class="icon" />
      <SvgIcon name="user-role" class="icon" />
    </n-card>

    <n-card
      size="small"
      title="echarts钟表"
      :segmented="{
        content: true
      }"
    >
      <EchartsClock />
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import SectionArea from '@/components/SectionArea.vue'
import ImageCode from './ImageCode/index.vue'
import GlobalProperty from './GlobalProperty/index.vue'
import Animation from './Animation/index.vue'
import BusA from './Bus/BusA.vue'
import BusB from './Bus/BusB.vue'
import SvgIcon from './SvgIcon/index.vue'
import EchartsClock from './EchartsClock/index.vue'

const imgCode = ref<string>('')

const instance = getCurrentInstance()
console.log(instance)

const show = () => {
  instance?.proxy?.$loading.show()
}
const hide = () => {
  instance?.proxy?.$loading.hide()
}
</script>

<style lang="scss" scoped>
.theme {
  color: $test-color;
  background-color: var(--nice-primary-color);
}
</style>
