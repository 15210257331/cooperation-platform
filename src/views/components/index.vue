<template>
  <n-space vertical>
    <n-card title="图片验证码">
      <ImageCode v-model:code="imgCode" />
      <span>验证码的值为{{ imgCode }}</span>
    </n-card>
    <n-card title="按钮">
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
  </n-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ImageCode from '@/components/ImageCode.vue';

const imgCode = ref<string>('');
</script>

<style lang="scss" scoped></style>
