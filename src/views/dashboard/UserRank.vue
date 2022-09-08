<template>
  <n-card
    title="用户排行TOP5"
    size="small"
    :segmented="{
      content: true
    }"
  >
    <template #header-extra>
      <n-radio-group v-model:value="type" size="small" name="radiobuttongroup1" @update:value="handleChange">
        <n-radio-button :value="'1'" label="按任务数" />
        <n-radio-button :value="'2'" label="按完成率" />
      </n-radio-group>
    </template>
    <n-table :bordered="false" class="table">
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
    </n-table>
  </n-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { userRank } from '@/api'

const type = ref<string>('1')
const userList = ref<any>([])

onMounted(() => {
  queryData()
})

function handleChange(value: string) {
  type.value = value
  queryData()
}

function queryData() {
  userRank(type.value).then(res => {
    if (res.code === 10000) {
      userList.value = res.data || []
    }
  })
}
</script>

<style lang="scss" scoped>
.table {
  cursor: pointer;
  tbody tr {
    td {
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
