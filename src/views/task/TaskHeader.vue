<template>
  <n-card :content-style="{ padding: '0 10px' }">
    <div class="task-header">
      <n-popselect
        :value="selectedProject?.id"
        size="large"
        placement="top-start"
        trigger="click"
        :options="options"
        scrollable
        @update:value="change"
      >
        <div class="project-change">
          <n-icon :component="Dice" size="20" color="#0e7a0d" />
          <p>{{ selectedProject?.name || '暂无项目' }}</p>
          <n-icon :component="ChevronDownSharp" />
        </div>
      </n-popselect>
      <n-divider vertical />
      <n-icon
        size="17"
        :component="selectedProject?.type === 2 ? StarSharp : StarOutline"
        :color="selectedProject?.type === 2 ? '#efe80eff' : '#999'"
      />
      <div style="flex: 1">
        <n-button style="float: right" size="small" type="primary" @click="createGroup"> 新建分组 </n-button>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useProjectStore } from '@/store'
import { ProjectType } from '@/interface'
import { Dice, ChevronDownSharp, StarSharp, StarOutline } from '@vicons/ionicons5'

const projectStore = useProjectStore()
const emit = defineEmits(['createGroup'])
const selectedProject = computed(() => projectStore.selectedProject)
const options = computed(() => {
  const starList: Array<any> = []
  const normalList: Array<any> = []
  projectStore.projectList.map(item => {
    if (item.type === 2) {
      starList.push({
        label: item.name,
        value: item.id,
        star: true
      })
    } else {
      normalList.push({ label: item.name, value: item.id, star: false })
    }
  })
  return [
    {
      type: 'group',
      label: '星标项目',
      key: 'star',
      children: starList
    },
    {
      type: 'group',
      label: '普通项目',
      key: 'normal',
      children: normalList
    }
  ]
})
/** 更改当前选中的项目 */
const change = ($event: any, option: any) => {
  projectStore.changeSelectedProject($event)
}
const createGroup = () => {
  emit('createGroup')
}
</script>

<style lang="scss" scoped>
.task-header {
  cursor: pointer;
  height: 50px;
  min-height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
  position: relative;
  border-radius: 0;
  .nav {
    flex: 1;
  }
}
.project-change {
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 12px 0 8px;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
  }
}
</style>
