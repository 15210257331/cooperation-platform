<template>
  <div class="flow-item">
    <n-card :content-style="{ padding: '0 10px' }">
      <div class="flow-header">
        <div class="name">
          <p>{{ flow.name }}</p>
          <span>({{ flow.tasks.length }}/{{ taskStore.total }})</span>
        </div>
        <n-dropdown trigger="hover" :options="options" @select="handleSelect">
          <n-icon size="20">
            <EllipsisHorizontal />
          </n-icon>
        </n-dropdown>
      </div>
    </n-card>

    <div class="task-list">
      <draggable
        :delay="0.5"
        :animation="300"
        :sort="false"
        :component-data="{
          tag: 'ul',
          name: 'flip-list'
        }"
        ghost-class="ghost"
        drag-class="drag"
        chosen-class="chosen"
        :list="flow.tasks"
        :group="{
          name: flow.id,
          put: put,
          pull: pull
        }"
        item-key="id"
        @change="change($event, flow)"
      >
        <template #item="{ element, index }">
          <TaskItem :task="element" :complete="flow.complete" :flow-id="(flow.id as number)" :index="index"></TaskItem>
        </template>
      </draggable>
      <CreateTaskButton v-if="flow.canNew" @click="createTask" />
    </div>
  </div>
  <!-- 新增/修改流程弹窗 -->
  <CreateFlowModal v-model:value="showModal" :data="flow" :is-edit="flowEdit" />
  <!-- 新增任务modal -->
  <CreateTaskModal v-model:value="showCreateTaskModal" :flow-id="(flow.id as number)"></CreateTaskModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import TaskItem from './TaskItem.vue'
import { useTaskStore, useAppStore, FlowType } from '@/store'
import { useRender } from '@/hooks'
import { useMessage, useDialog, FormInst } from 'naive-ui'
import { EllipsisHorizontal, Documents, AddCircleSharp, TrashBin, Close, Duplicate } from '@vicons/ionicons5'
import CreateFlowModal from './CreateFlowModal.vue'
import CreateTaskModal from './CreateTaskModal.vue'
import CreateTaskButton from '@/components/CreateTaskButton.vue'

interface Props {
  flow: FlowType;
}
const props = defineProps<Props>()

const taskStore = useTaskStore()
const message = useMessage()
const dialog = useDialog()
const { renderIcon } = useRender()
const showModal = ref<boolean>(false)
const showCreateTaskModal = ref<boolean>(false)
const flowEdit = ref<boolean>(false)
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
    label: '在此流程新增任务',
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

async function handleSelect(key: string | number) {
  if (key === 'delete') {
    if (props.flow.tasks.length > 0) {
      message.error('删除流程前请保证该流程下无任务！')
      return
    }
    dialog.warning({
      title: '警告',
      content: '你确定删除当前流程吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await taskStore.deleteFlow(props.flow.id as number)
        message.success('流程已删除！')
      },
      onNegativeClick: () => {}
    })
  } else if (key === 'create') {
    showModal.value = true
    flowEdit.value = false
  } else if (key === 'edit') {
    showModal.value = true
    flowEdit.value = true
  } else if (key === 'createTask') {
    createTask()
  }
}

function createTask() {
  showCreateTaskModal.value = true
}

// 判断是否可以从其他流程拖拽过来
function put(to: any, from: any) {
  return true
}
// 判断是否可以拖拽到其他流程返回可以拖拽进去的流程的group值列表 | true | false
function pull(to: any, from: any) {
  const arr = props.flow.range.map(item => Number(item))
  return arr
}

// 更新任务流程
async function change(evt: any, flow: any) {
  if (Object.keys(evt).includes('added')) {
    const taskId = evt.added.element.id
    const newFlowId = flow.id
    const newFlowComplete = flow.complete
    await taskStore.updateTaskProps(taskId, 'flow', newFlowId)
    // 如果进入的流程标记为已完成则将任务状态改成已完成
    if (newFlowComplete === true) {
      await taskStore.updateTaskProps(taskId, 'complete', true)
    }
    message.success('状态已更新')
  }
}
</script>

<style lang="scss" scoped>
.flow-item {
  display: inline-block;
  width: 320px;
  margin: 0 20px 0 0;
  overflow: hidden;
  height: 100%;
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
  .task-list {
    width: 100%;
    flex: 1;
    overflow-y: auto;
    height: calc(100% - 45px);
    margin: 0 auto;
  }
}
// // 选中的样式
// .chosen {
//   opacity: 0.8;
//   background: #c8ebfb;
// }
// 移动的样式
.drag {
  opacity: 0.9;
  background: #c8ebfb;
}
// 占位符的样式
.ghost {
  opacity: 0.2;
}
// 任务子项动画效果
.flip-list-move {
  transition: transform 0.2s linear;
}
</style>
