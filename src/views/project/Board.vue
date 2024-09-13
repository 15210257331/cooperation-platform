<template>
  <TaskFilter />
  <div class="task-board" :style="{ backgroundColor: appStore.darkTheme ? 'rgba(255, 255, 255, 0.12)' : '#f9f9f9' }">
    <div v-for="(group, index) in groupList" :key="group.id" class="group-item">
      <n-card :content-style="{ padding: '10px 15px' }">
        <div class="group-header">
          <div class="name">
            <n-badge dot :type="formatBadgeType(index)" />
            <p>{{ group.name }}</p>
            <n-button tertiary size="tiny" type="tertiary">{{ group.tasks.length }}</n-button>
          </div>
          <n-icon size="20" :component="Add" style="margin-right: 8px" @click="createTask(group)"></n-icon>
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
      </div>
    </div>
    <PlaceholderContainer v-if="groupList.length === 0">
      <n-empty size="large" description="什么也没有"></n-empty>
    </PlaceholderContainer>
  </div>
  <!-- 新增/修改分组dialog -->
  <CreateGroupModal v-model:value="showCreateGroupModal" :data="selectedGroupData" />
  <!-- 新增任务modal -->
  <CreateTaskDrawer v-model:value="showCreateTaskModal" :flow-id="selectedGroupData?.id"></CreateTaskDrawer>
</template>

<script setup lang="ts">
import { useAppStore, useProjectStore } from '@/store'
import { computed, ref } from 'vue'
import TaskFilter from './TaskFilter.vue'
import { useDialog, useMessage } from 'naive-ui'
import { GroupType } from '@/interface'
import TaskItem from './TaskItem.vue'
import draggable from 'vuedraggable'
import { useRender } from '@/hooks'
import CreateGroupModal from './CreateGroupModal.vue'
import { Documents, Duplicate, TrashBin, EllipsisHorizontal, Add } from '@vicons/ionicons5'
import CreateTaskDrawer from './CreateTaskDrawer.vue'

const projectStore = useProjectStore()
const appStore = useAppStore()
const message = useMessage()
const dialog = useDialog()
const { renderIcon } = useRender()

const showCreateGroupModal = ref<boolean>(false)
const showCreateTaskModal = ref<boolean>(false)
const selectedGroupData = ref<GroupType | null>(null)

function formatBadgeType(index: number): any {
  return ['error', 'warning', 'info', 'success'][index] || 'success'
}

const options: any = [
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
const groupList = computed(() => projectStore.currentProject?.groups || [])
const totalTask = computed(() => {
  return groupList.value?.reduce((pre, current) => {
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
  const fromGroup = groupList.value?.find(item => item.id === fromGroupId)
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
.task-board {
  flex: 1;
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 16px 16px 16px 16px;
  background-color: #f9f9f9;
}
.group-item {
  border-radius: 4px;
  display: inline-block;
  width: 320px;
  margin: 0 20px 0 0;
  overflow: hidden;
  height: 100%;
  .group-header {
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
        margin-right: 6px;
        position: relative;
        margin-left: 10px;
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
    margin: 10px auto 0;
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
