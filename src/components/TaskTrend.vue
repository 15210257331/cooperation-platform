<template>
  <n-card
    size="small"
    title="任务趋势"
    :segmented="{
      content: true
    }"
  >
    <template #header-extra>
      <n-radio-group v-model:value="type" size="small" name="radiobuttongroup1" @update:value="handleChange">
        <n-radio-button :value="'1'" label="最近一周" />
        <n-radio-button :value="'2'" label="最近一月" />
        <n-radio-button :value="'3'" label="最近一年" />
      </n-radio-group>
    </template>
    <div ref="myChart" style="height: 278px"></div>
  </n-card>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useEcharts, type ECOption } from '@/hooks'
import { taskTrend } from '@/api'

const pieOptions = ref<ECOption>({})
const { domRef: myChart } = useEcharts(pieOptions)
const type = ref<string>('1')
const loading = ref(true)

onMounted(() => {
  queryData()
})

function handleChange(value: string) {
  type.value = value
  queryData()
}

function queryData() {
  taskTrend(type.value)
    .then(res => {
      if (res.code === 10000) {
        pieOptions.value = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '0%',
            top: '6%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: res.data.map((item: any) => item.date),
            axisLabel: { interval: 0, rotate: 0 },
            axisTick: {
              show: false
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '完成任务数量',
              type: 'bar',
              barWidth: 25,
              itemStyle: {
                borderRadius: [3, 3, 0, 0]
              },
              data: res.data.map((item: any) => item.total)
            }
          ]
        }
        loading.value = false
      }
    })
    .catch(err => {
      loading.value = false
    })
}
</script>

<style lang="scss" scoped></style>
