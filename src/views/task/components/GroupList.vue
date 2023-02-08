<template>
  <div
    v-for="group in groupList"
    :key="group.id"
    class="group-item"
    :style="{ 'background-color': appStore.darkTheme ? 'rgb(40, 40, 42)' : '#f4f7fd' }"
  >
    <n-card :content-style="{ padding: '0 10px' }">
      <div class="group-header">
        <div class="name">
          <p>{{ group.name }}</p>
          <span>({{ group.tasks.length }}/{{ totalTask }})</span>
        </div>
        <n-dropdown trigger="hover" :options="options" @select="handleSelect($event, group)">
          <n-icon size="20" :component="EllipsisHorizontal"></n-icon>
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
        :list="group.tasks"
        :group="{
          name: group.id,
          put: put,
          pull: pull
        }"
        item-key="id"
        @change="change($event, group)"
      >
        <template #item="{ element, index }">
          <TaskItem
            :task="element"
            :complete="group.complete"
            :flow-id="(group.id as string)"
            :index="index"
          ></TaskItem>
        </template>
      </draggable>
      <CreateTaskButton v-if="group.canNew" @click="createTask(group)" />
    </div>
  </div>
  <div class="group-item" :style="{ 'background-color': appStore.darkTheme ? 'rgb(40, 40, 42)' : '#f4f7fd' }">
    <n-card hoverable :content-style="{ padding: '0 10px' }" @click="createGroup()">
      <span class="group-add">新增分组</span>
    </n-card>
  </div>

  <!-- 新增/修改分组dialog -->
  <CreateGroupModal v-model:value="showCreateGroupModal" :data="selectedGroupData" />
  <!-- 新增任务modal -->
  <CreateTaskModal v-model:value="showCreateTaskModal" :flow-id="selectedGroupData?.id"></CreateTaskModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDialog, useMessage } from 'naive-ui'
import { GroupType } from '@/interface'
import TaskItem from './TaskItem.vue'
import CreateTaskButton from '@/components/CreateTaskButton.vue'
import draggable from 'vuedraggable'
import { useRender } from '@/hooks'
import CreateGroupModal from './CreateGroupModal.vue'
import CreateTaskModal from './CreateTaskModal.vue'
import { Documents, Duplicate, TrashBin, EllipsisHorizontal } from '@vicons/ionicons5'
import { useAppStore, useProjectStore } from '@/store'

const props = withDefaults(
  defineProps<{
    data: Array<GroupType>
  }>(),
  {
    data: () => []
  }
)
const projectStore = useProjectStore()
const appStore = useAppStore()
const message = useMessage()
const dialog = useDialog()
const { renderIcon } = useRender()

const showCreateGroupModal = ref<boolean>(false)
const showCreateTaskModal = ref<boolean>(false)
const selectedGroupData = ref<GroupType | null>(null)

const options = [
  {
    label: '分组设置',
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
    label: '删除分组',
    key: 'delete',
    icon: renderIcon(TrashBin)
  }
]
const groupList = computed(() => props.data)
const totalTask = computed(() => {
  return props.data.reduce((pre, current) => {
    return pre + current.tasks.length
  }, 0)
})

function handleSelect($event: string | number, flow: GroupType) {
  switch ($event) {
    case 'delete':
      deleteGroup(flow)
      break
    case 'edit':
      editGroup(flow)
      break
    case 'createTask':
      createTask(flow)
      break
    default:
      break
  }
}

/** 新建分组 */
function createGroup() {
  showCreateGroupModal.value = true
}
/** 编辑分组 */
function editGroup(group: GroupType) {
  showCreateGroupModal.value = true
  selectedGroupData.value = group
}
/** 删除分组 */
function deleteGroup(group: GroupType) {
  if (group.tasks.length > 0) {
    message.error('删除分组前请保证该分组下无任务！')
    return
  }
  dialog.warning({
    title: '警告',
    content: '你确定删除当前分组吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      projectStore
        .deleteGroup(group.id as string)
        .then(res => {
          message.success('分组删除成功！')
        })
        .catch(() => {
          message.error('分组删除失败！')
        })
    },
    onNegativeClick: () => {}
  })
}

/** 新建任务 */
function createTask(flow: GroupType) {
  showCreateTaskModal.value = true
  selectedGroupData.value = flow
}
// 判断是否可以从其他流程拖拽过来
function put(to: any, from: any) {
  return true
}
// 判断是否可以拖拽到其他分组 返回可以拖拽目标分组的id值列表 | true | false
function pull(to: any, from: any) {
  const fromGroupId = from.options.group.id
  const fromGroup = groupList.value.find(item => item.id === fromGroupId)
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
.group-item {
  background-color: #f4f7fd;
  padding: 12px;
  border-radius: 2px;
  display: inline-block;
  width: 320px;
  margin: 0 20px 0 0;
  overflow: hidden;
  height: 100%;
  .group-header {
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
.group-add {
  cursor: pointer;
  height: 50px;
  width: 100%;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  display: inline-block;
  line-height: 50px;
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
