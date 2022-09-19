<template>
  <n-space vertical>
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
      title="按钮"
      :segmented="{
        content: true
      }"
    >
      <n-space>
        <n-button>Default</n-button>
        <n-button type="tertiary"> Tertiary </n-button>
        <n-button type="primary"> Primary </n-button>
        <n-button type="info"> Info </n-button>
        <n-button type="success"> Success </n-button>
        <n-button type="warning"> Warning </n-button>
        <n-button type="error"> Error </n-button>
      </n-space>
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
      <TextDemo />
    </n-card>

    <n-card
      size="small"
      title="图标使用"
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
      title="钟表"
      :segmented="{
        content: true
      }"
    >
      <EchartsClock />
    </n-card>
  </n-space>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageCode from '@/components/ImageCode.vue'
import EchartsClock from './EchartsClock.vue'
import TextDemo from './Text.vue'
import SvgIcon from './SvgIcon.vue'

const imgCode = ref<string>('')
</script>

<style lang="scss" scoped>
.theme {
  color: $test-color;
  background-color: var(--nice-primary-color);
}
</style>
