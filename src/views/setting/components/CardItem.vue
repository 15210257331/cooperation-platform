<template>
  <n-card hoverable :content-style="{ padding: '12px' }" style="width: 300px; margin: 0px 15px 15px 0px">
    <div class="card-body">
      <n-button tertiary circle>
        <template #icon>
          <n-icon :component="Notifications" :size="24" color="#18a058" />
        </template>
      </n-button>
      <div>
        <p>{{ data.name }}</p>
        <span>{{ data.description }}</span>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { Search, MenuSharp, EllipsisHorizontal, Notifications } from '@vicons/ionicons5'

interface Props {
  data: any
}
const props = defineProps<Props>()
</script>

<style lang="scss" scoped>
.card-body {
  display: flex;
  align-items: center;
  & > div {
    margin-left: 12px;
    p {
      font-size: 14px;
      font-weight: 500;
    }
    span {
      font-size: 12px;
      color: #c7c5c5;
    }
  }
}
</style>
