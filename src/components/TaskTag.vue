<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-tag :type="type" :bordered="false" size="small">
        {{ name }}
        <template #icon>
          <n-icon :component="icon" />
        </template>
      </n-tag>
    </template>
    {{ tooltipContent }}
  </n-tooltip>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  type: string
  tooltipContent: string
  icon: any
}>()
</script>

<style lang="scss" scoped></style>
