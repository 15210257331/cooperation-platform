<template>
  <ul class="nav_list">
    <li
      v-for="item in list"
      :key="item.title"
      :class="{ active: route.name === item.route ? true : false }"
      @click="navigate(item.route)"
    >
      {{ item.title }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

console.log(route.name)

const list = ref<
  Array<{
    title: string
    route: string
  }>
>([
  {
    title: '项目概览',
    route: 'project'
  },
  {
    title: '任务看板',
    route: 'task'
  },
  {
    title: '回收站',
    route: 'trash'
  }
])

function navigate(name: string) {
  router.push({
    name: name
  })
}
</script>

<style lang="scss" scoped>
.nav_list {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  li {
    height: 60px;
    line-height: 60px;
    color: #888;
    font-size: 14px;
    font-weight: 500;
    margin: 0 20px;
    cursor: pointer;
    position: relative;
    &:hover {
      color: #18a058;
    }
  }
  li.active {
    color: #18a058;
    &::after {
      content: '';
      width: calc(100% + 10px);
      height: 2px;
      border-radius: 1px;
      background-color: #18a058;
      position: absolute;
      bottom: 0;
      left: -5px;
    }
  }
}
</style>
