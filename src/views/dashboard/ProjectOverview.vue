<template>
  <n-card
    size="small"
    title="项目概览"
    :segmented="{
      content: true
    }"
  >
    <div ref="myChart" style="height: 297px"></div>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useEcharts, type ECOption } from '@/hooks'
import { useProjectStore } from '@/store'

const projectStore = useProjectStore()

// const pieOptions = ref<ECOption>({})

const pieOptions = computed<ECOption>(() => {
  return {
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
        name: '项目数据概览',
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
        // data: projectStore.selectedProjectGroups.map(item => {
        //   return {
        //     value: item.tasks.length,
        //     name: item.name
        //   }
        // })
      }
    ]
  }
})

const { domRef: myChart } = useEcharts(pieOptions)

</script>

<style lang="scss" scoped></style>
