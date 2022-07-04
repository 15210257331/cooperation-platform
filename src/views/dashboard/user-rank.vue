<template>
  <n-card
    title="用户排行TOP5"
    :segmented="{
      content: true
    }"
  >
    <template #header-extra>
      <n-radio-group v-model:value="type" name="radiobuttongroup1" @update:value="handleChange">
        <n-radio-button :value="'1'" label="按任务数" />
        <n-radio-button :value="'2'" label="按完成率" />
      </n-radio-group>
    </template>
    <table class="positive-rank" cellspacing="0">
      <thead>
        <tr>
          <th>排名</th>
          <th>用户昵称</th>
          <th>总任务数</th>
          <th>已完成任务数</th>
          <th>完成率</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in userList"
          :key="index"
          class="content-item"
          :class="{ border: index === 0 ? false : true }"
        >
          <td>
            <span v-if="index > 2">{{ index + 1 }}</span>
            <span v-else :class="['rank-' + (index + 1)]" />
          </td>
          <td>{{ item.nickname }}</td>
          <td>{{ item.total }}</td>
          <td style="color: rgb(34, 215, 187)">{{ item.complete }}</td>
          <td>{{ item.percent }}%</td>
        </tr>
      </tbody>
    </table>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { userRank } from '@/service/api';

const type = ref<string>('1');
const userList = ref<any>([]);

onMounted(() => {
  queryData();
});

function handleChange(value: string) {
  type.value = value;
  queryData();
}

function queryData() {
  userRank(type.value).then(res => {
    if (res.code === 10000) {
      userList.value = res.data || [];
    }
  });
}
</script>

<style lang="scss" scoped>
table.positive-rank {
  cursor: pointer;
  height: auto;
  width: 100%;
  border-collapse: collapse;
  thead tr {
    background-color: #f9f9f9;
    height: 54px;
    th {
      height: 54px;
      line-height: 54px;
      text-align: left;
      padding-left: 40px;
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }
  }
  tbody tr {
    &:hover {
      background-color: #eaf2ff;
    }
    td {
      height: 50px;
      line-height: 50px;
      text-align: left;
      padding-left: 40px;
      color: #666;
      font-size: 14px;
      font-weight: 400;
      span {
        width: 20px;
        height: 20px;
        display: inline-block;
        background-size: cover;
        line-height: 20px;
        text-align: center;
      }
      span.rank-1 {
        background-image: url('../../assets/images/first.png');
      }
      span.rank-2 {
        background-image: url('../../assets/images/second.png');
      }
      span.rank-3 {
        background-image: url('../../assets/images/third.png');
      }
    }
  }
}
</style>
