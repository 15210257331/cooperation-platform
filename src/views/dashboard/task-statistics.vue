<template>
  <n-card
    size="small"
    title="任务统计"
    :segmented="{
      content: true
    }"
  >
    <div class="statistics">
      <div class="item">
        <span>总任务</span>
        <p style="color: #999999">{{ taskStore.total }}</p>
      </div>
      <div class="item">
        <span>未完成</span>
        <p style="color: #feb54e">{{ taskStore.peddingTotal }}</p>
      </div>
      <div class="item">
        <span>已完成</span>
        <p style="color: #22d7bb">{{ taskStore.completeTotal }}</p>
      </div>
      <div class="item">
        <span>已逾期</span>
        <p style="color: #ff5500">{{ 12 }}</p>
      </div>
      <div class="line"></div>
      <div class="item" style="flex: 2">
        <n-progress type="dashboard" gap-position="bottom" :color="'#22D7BB'" :percentage="percentage">
          <div>
            <h5 class="percentage-label">完成率</h5>
            <span class="percentage-value">{{ percentage }}%</span>
          </div>
        </n-progress>
      </div>
      <div></div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTaskStore } from '@/store';

const taskStore = useTaskStore();
const percentage = computed(() => {
  return taskStore.total > 0 ? parseInt(((taskStore.completeTotal / taskStore.total) * 100).toFixed(2)) : 0;
});
</script>

<style lang="scss" scoped>
.statistics {
  padding: 20px;
  height: 150px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 3px;
  margin-bottom: 10px;
  div.item {
    text-align: center;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    font-weight: 500;
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid #ccc;
    }
    h4 {
      color: #999;
    }
    span {
      color: #999;
    }
    p {
      font-size: 28px;
      // color: #999;
    }
  }
  div.line {
    width: 1px;
    background-color: #eee;
    height: 70%;
  }
}
.percentage-label {
  font-size: 14px;
}
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 15px;
}
</style>
