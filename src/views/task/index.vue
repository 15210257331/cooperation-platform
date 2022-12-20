<template>
  <div class="task">
    <div
      class="task-bg"
      :style="{
        backgroundImage: 'url(' + cover + ')'
      }"
    ></div>
    <TaskHeader @create-group="createGroup"></TaskHeader>
    <div class="task-content">
      <Empty v-if="flowList.length === 0" />
      <div v-for="flow in flowList" :key="flow.id" class="flow-item">
        <GroupHeader
          :flow="flow"
          @create-group="createGroup($event)"
          @edit-group="editGroup($event)"
          @delete-group="deleteGroup($event)"
          @create-task="createTask($event)"
        ></GroupHeader>
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
              <TaskItem
                :task="element"
                :complete="flow.complete"
                :flow-id="(flow.id as number)"
                :index="index"
              ></TaskItem>
            </template>
          </draggable>
          <CreateTaskButton v-if="flow.canNew" @click="createTask(flow)" />
        </div>
      </div>
    </div>
    <!-- 新增/修改分组dialog -->
    <CreateGroupModal v-model:value="showCreateGroupModal" :data="selectedFlowData" />
    <!-- 新增任务modal -->
    <CreateTaskModal v-model:value="showCreateTaskModal" :flow-id="selectedFlowData?.id"></CreateTaskModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Empty from '@/components/Empty.vue'
import draggable from 'vuedraggable'
import TaskItem from './TaskItem.vue'
import { useAppStore, useProjectStore } from '@/store'
import { FlowType } from '@/interface'
import { useMessage, useDialog, FormInst } from 'naive-ui'
import CreateGroupModal from './CreateGroupModal.vue'
import CreateTaskModal from './CreateTaskModal.vue'
import CreateTaskButton from '@/components/CreateTaskButton.vue'
import GroupHeader from './GroupHeader.vue'
import TaskHeader from './TaskHeader.vue'

const projectStore = useProjectStore()
const message = useMessage()
const dialog = useDialog()

const showCreateGroupModal = ref<boolean>(false)
const showCreateTaskModal = ref<boolean>(false)
const selectedFlowData = ref<FlowType | null>(null)
const flowList = computed(() => (projectStore.selectedProject ? projectStore.selectedProject.flows : []))
const cover = computed(() => projectStore.selectedProject?.cover)

/** 新建分组 */
function createGroup(flow: FlowType) {
  showCreateGroupModal.value = true
  selectedFlowData.value = null
}
/** 编辑分组 */
function editGroup(flow: FlowType) {
  showCreateGroupModal.value = true
  selectedFlowData.value = flow
}
/** 删除分组 */
function deleteGroup(flow: FlowType) {
  if (flow.tasks.length > 0) {
    message.error('删除流程前请保证该流程下无任务！')
    return
  }
  dialog.warning({
    title: '警告',
    content: '你确定删除当前流程吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      await projectStore.deleteFlow(flow.id as number)
      message.success('流程已删除！')
    },
    onNegativeClick: () => {}
  })
}
/** 新建任务 */
function createTask(flow: FlowType) {
  showCreateTaskModal.value = true
  selectedFlowData.value = flow
}
// 判断是否可以从其他流程拖拽过来
function put(to: any, from: any) {
  return true
}
// 判断是否可以拖拽到其他流程返回可以拖拽进去的流程的group值列表 | true | false
function pull(to: any, from: any) {
  const fromGroupId = from.options.group.name
  const fromGroup = flowList.value.find(item => item.id === fromGroupId)
  // console.log(fromGroup?.range.map(item => Number(item)))
  return fromGroup?.range.map(item => Number(item))
}
// 更新任务流程
async function change(evt: any, flow: any) {
  if (Object.keys(evt).includes('added')) {
    const taskId = evt.added.element.id
    const newFlowId = flow.id
    const newFlowComplete = flow.complete
    await projectStore.updateTaskProps(taskId, 'flow', newFlowId)
    // 如果进入的流程标记为已完成则将任务状态改成已完成
    if (newFlowComplete === true) {
      await projectStore.updateTaskProps(taskId, 'complete', true)
    }
    message.success('状态已更新')
  }
}
</script>

<style lang="scss" scoped>
.task {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .task-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    filter: blur(2px);
    background-size: cover;
  }
  .task-content {
    flex: 1;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;

    padding: 15px;

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

    .flow-item {
      display: inline-block;
      width: 320px;
      margin: 0 20px 0 0;
      overflow: hidden;
      height: 100%;

      .task-list {
        width: 100%;
        flex: 1;
        overflow-y: auto;
        height: calc(100% - 45px);
        margin: 0 auto;
      }
    }
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
