<template>
  <n-icon size="17" :component="fill ? StarSharp : StarOutline" :color="fill ? '#efe80eff' : '#999'" />
</template>

<script setup lang="ts">
import { StarSharp, StarOutline } from '@vicons/ionicons5'
const props = defineProps<{
  fill: boolean
}>()
</script>

<style lang="scss" scoped></style>
