<template>
  <div class="not-found">
    <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬">
      <template #footer>
        <n-button @click="goDashboard">返回首页</n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function goDashboard() {
  router.push({
    name: 'dashboard'
  })
}
</script>

<style lang="scss" scoped>
.not-found {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
