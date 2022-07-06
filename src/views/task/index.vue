<template>
  <n-card title="卡片插槽示例">
    <template #header-extra> #header-extra </template>
    <n-space>
      <n-tag> 爱在西元前 </n-tag>
      <n-tag type="success"> 不该 </n-tag>
      <n-tag type="warning"> 超人不会飞 </n-tag>
      <n-tag type="error"> 手写的从前 </n-tag>
      <n-tag type="info"> 哪里都是你 </n-tag>
      <n-tag closable size="small" @close="handleClose"> 爱在西元前 </n-tag>
      <n-tag type="warning" closable @close="handleClose"> 超人不会飞 </n-tag>
      <n-tag type="info" closable size="large" @close="handleClose"> 哪里都是你 </n-tag>
      <n-tag closable size="small" @close="handleClose"> 爱在西元前 </n-tag>
      <n-tag type="warning" closable @close="handleClose"> 超人不会飞 </n-tag>
      <n-tag type="info" closable size="large" @close="handleClose"> 哪里都是你 </n-tag>
    </n-space>
    <n-descriptions label-placement="top" bordered :column="6">
      <n-descriptions-item>
        <template #label> 早餐 </template>
        苹果
      </n-descriptions-item>
      <n-descriptions-item label="早午餐"> 苹果 </n-descriptions-item>
      <n-descriptions-item label="午餐"> 苹果 </n-descriptions-item>
      <n-descriptions-item label="晚餐"> 苹果 </n-descriptions-item>
      <n-descriptions-item label="正餐"> 苹果 </n-descriptions-item>
      <n-descriptions-item label="夜宵"> 苹果 </n-descriptions-item>
      <n-descriptions-item label="苹果"> 苹果 </n-descriptions-item>
      <n-descriptions-item label="苹果" :span="2"> 苹果 </n-descriptions-item>
      <n-descriptions-item label="苹果" :span="3"> 苹果 </n-descriptions-item>
    </n-descriptions>
    <template #footer> #footer </template>
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';

const message = useMessage();
function handleClose() {
  message.info('tag close');
}
</script>

<style lang="scss" scoped>
.operation {
  height: 60px;
  padding: 0 20px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 3px;
  // background-image: url(../../assets/images/task_bg.jpg);
  .left {
    width: 260px;
  }
}
.flow-list {
  padding: 10px;
  flex: 1;
  border-radius: 3px;
  background-color: white;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  background-image: url(../../assets/images/task_bg.jpg);
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
