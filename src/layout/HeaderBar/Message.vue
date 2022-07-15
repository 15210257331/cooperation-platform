<template>
  <n-popover trigger="click">
    <template #trigger>
      <ActionContainer :tooltip-content="'消息通知'">
        <n-icon size="25" :component="Notifications" />
        <n-badge :value="9" :max="15" style="position: absolute; top: 10px; right: 2px" />
      </ActionContainer>
    </template>
    <n-space vertical>
      <n-alert title="Info 类型" type="info" closable> Gee it's good to be back home </n-alert>
      <n-alert title="Success 类型" type="success" closable> Leave it till tomorrow to unpack my case </n-alert>
      <n-alert title="Warning 类型" type="warning" closable> Honey disconnect the phone </n-alert>
      <n-alert title="Error 类型" type="error" closable> I'm back in the U.S.S.R. </n-alert>
    </n-space>
  </n-popover>
</template>

<script setup lang="ts">
import { Notifications } from '@vicons/ionicons5';
</script>

<style lang="scss" scoped></style>
