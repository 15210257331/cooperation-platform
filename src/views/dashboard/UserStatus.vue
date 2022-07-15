<template>
  <n-card
    size="small"
    title="用户数据"
    :segmented="{
      content: true
    }"
  >
    <div ref="myChart" style="height: 278px"></div>
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useEcharts, type ECOption } from '@/hooks';
import { taskTrend } from '@/api';

const pieOptions = ref<ECOption>({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    right: '5%',
    orient: 'vertical',
    top: 'middle',
    itemGap: 15
  },
  series: [
    {
      name: '用户状态数据',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 248, name: '普通用户' },
        { value: 735, name: '管理员' },
        { value: 580, name: '账户正常' },
        { value: 484, name: '异常账户' },
        { value: 300, name: '不活跃用户' }
      ]
    }
  ]
});
const { domRef: myChart } = useEcharts(pieOptions);
const loading = ref(true);

onMounted(() => {
  //   queryData();
});
</script>

<style lang="scss" scoped></style>
