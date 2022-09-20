<template>
  <n-card :content-style="{ padding: '0 10px' }">
    <div class="flow-header">
      <div class="name">
        <p>{{ flow.name }}</p>
        <span>({{ flow.tasks.length }}/{{ projectStore.selectedProject?.flows.length }})</span>
      </div>
      <n-dropdown trigger="hover" :options="options" @select="handleSelect($event, flow)">
        <n-icon size="20">
          <EllipsisHorizontal />
        </n-icon>
      </n-dropdown>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { useRender } from '@/hooks'
import { useProjectStore } from '@/store'
import { FlowType } from '@/interface'
import { EllipsisHorizontal, Documents, AddCircleSharp, TrashBin, Close, Duplicate } from '@vicons/ionicons5'

const { renderIcon } = useRender()
const projectStore = useProjectStore()

const props = defineProps<{ flow: FlowType }>()
const emit = defineEmits(['createGroup', 'editGroup', 'deleteGroup', 'createTask'])
const options = [
  {
    label: '在此后添加新流程',
    key: 'create',
    icon: renderIcon(AddCircleSharp)
  },
  {
    label: '编辑流程',
    key: 'edit',
    icon: renderIcon(Documents)
  },
  {
    label: '添加新任务',
    key: 'createTask',
    icon: renderIcon(Duplicate)
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    label: '删除流程',
    key: 'delete',
    icon: renderIcon(TrashBin)
  }
]

const handleSelect = ($event: string | number, flow: FlowType) => {
  switch ($event) {
    case 'delete':
      emit('deleteGroup', flow)
      break
    case 'create':
      emit('createGroup', flow)
      break
    case 'edit':
      emit('editGroup', flow)
      break
    case 'createTask':
      emit('createTask', flow)
      break
    default:
  }
}
</script>

<style lang="scss" scoped>
.flow-header {
  height: 50px;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  .name {
    flex: 1;
    display: flex;
    align-items: center;
    flex-grow: 1;
    overflow: hidden;
    p {
      font-size: 15px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 21px;
    }
    span {
      flex-shrink: 0;
      font-size: 15px;
      font-weight: 700;
      line-height: 21px;
    }
  }
}
</style>
