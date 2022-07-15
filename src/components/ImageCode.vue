<template>
  <div>
    <canvas ref="domRef" width="152" height="40" class="cursor-pointer" @click="getImgCode"></canvas>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useImageCode } from '@/hooks';

interface Props {
  code?: string;
}

interface Emits {
  (e: 'update:code', code: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  code: ''
});

const emit = defineEmits<Emits>();

const { domRef, imgCode, setImgCode, getImgCode } = useImageCode();

watch(
  () => props.code,
  newValue => {
    setImgCode(newValue);
  }
);
watch(imgCode, newValue => {
  emit('update:code', newValue);
});

defineExpose({ getImgCode });
</script>

<style lang="scss" scoped></style>
