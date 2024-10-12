<template>
  <n-dropdown trigger="hover" :options="options" @select="handleSelect">
    <n-icon size="20" :component="EllipsisHorizontal" />
  </n-dropdown>
  <!-- 设置提醒 -->
  <n-modal v-model:show="showAlarmModal">
    <n-card
      :segmented="{
        content: true,
        footer: true
      }"
      style="width: 520px"
      :title="'设置任务提醒'"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button quaternary circle>
          <template #icon>
            <n-icon size="20" @click="showAlarmModal = false">
              <Close />
            </n-icon>
          </template>
        </n-button>
      </template>
      <div>
        <n-radio-group v-model:value="alarmValue" name="radiogroup">
          <n-space>
            <n-radio v-for="item in remindOptions" :key="item.value" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </div>
      <template #footer>
        <n-space horizontal style="float: right">
          <n-button tertiary @click="showAlarmModal = false"> 取消 </n-button>
          <n-button type="primary" @click="setAlarm"> 确认 </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EllipsisHorizontal, Copy, ShareSocialSharp, Alarm, TrashBin, Close } from '@vicons/ionicons5'
import { useRender } from '@/hooks'
import { useProjectStore } from '@/store'
import { useMessage } from 'naive-ui'
import { TaskType } from '@/interface'
import { remindOptions } from '@/config'

const projectStore = useProjectStore()
const { renderIcon } = useRender()
const message = useMessage()

const props = defineProps<{
  task: TaskType
}>()

const options = ref([
  {
    label: '复制任务',
    key: 'copy',
    icon: renderIcon(Copy)
  },
  {
    label: '关联内容',
    key: 'link',
    icon: renderIcon(ShareSocialSharp)
    // disabled: props.complete
  },
  {
    label: '设置任务提醒',
    key: 'alarm',
    icon: renderIcon(Alarm)
    // disabled: props.complete
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    label: '移到回收站',
    key: 'trash',
    icon: renderIcon(TrashBin)
  }
])

async function handleSelect(key: string | number) {
  if (key === 'next') {
    // const index = projectStore.currentProject?.groups.findIndex(item => item.id === props.flowId)
    let newFlowId
    // if (index && index < projectStore.currentProject?.groups.length - 1) {
    //   newFlowId = projectStore.selectedProjectGroups[index + 1].id
    // }
    await projectStore.updateTaskProps(props.task.id, 'flow', newFlowId)
  } else if (key === 'copy') {
    message.info('任务已复制')
  } else if (key === 'alarm') {
    showAlarm()
  } else if (key === 'trash') {
    await projectStore.deleteTask(props.task.id)
  }
}

const showAlarmModal = ref<boolean>(false)
const alarmValue = ref<number>(props.task.remind)
function showAlarm() {
  showAlarmModal.value = true
}
async function setAlarm() {
  await projectStore.updateTaskProps(props.task.id, 'remind', alarmValue.value)
  message.success('操作成功')
  showAlarmModal.value = false
}
</script>

<style lang="scss" scoped></style>
