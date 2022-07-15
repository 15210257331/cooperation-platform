<template>
  <div class="flow-list">
    <FlowItem v-for="flow in flowList" :key="flow.id" :flow="flow" />
    <Loading ref="loading" v-if="loading" />
    <Empty v-if="!loading && flowList.length === 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Loading from '@/components/Loading.vue';
import Empty from '@/components/Empty.vue';
import { useTaskStore } from '@/store';

import FlowItem from './FlowItem.vue';

const taskStore = useTaskStore();
const loading = ref<boolean>(true);
const flowList = computed(() => taskStore.flowList);

onMounted(async () => {
  await taskStore.getFlowList();
  loading.value = false;
});
</script>

<style lang="scss" scoped>
.flow-list {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  background-repeat: no-repeat;
  background-position: center top;
  background-size: cover;

  .group-add {
    display: inline-block;
    width: 280px;
    height: 100%;
    margin: 0 20px 0 0;
    border-radius: 4px;
    overflow: hidden;
    border: 1px dashed #999;
    color: #999;
    text-align: center;
    position: relative;
    cursor: pointer;
    background-color: #fdfdfd;
    &:hover {
      border: 1px dashed #333;
    }
    span {
      display: inline-block;
      text-align: center;
      width: 100%;
      line-height: 100px;
      height: 100px;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50px);
      font-size: 24px;
      font-weight: 600;
    }
  }
}
</style>
