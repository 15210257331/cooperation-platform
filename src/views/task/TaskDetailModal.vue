<template>
  <n-modal v-model:show="showModal">
    <n-card
      :segmented="{
        content: true,
        footer: true
      }"
      style="width: 680px"
      :title="'任务详情'"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button quaternary circle>
          <template #icon>
            <n-icon size="20" @click="handleClose">
              <Close />
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-form
        ref="formRef"
        :label-placement="'left'"
        :show-require-mark="false"
        :label-width="'auto'"
        :model="formValue"
        :rules="rules"
      >
        <n-form-item label="任务名称:" path="name">
          <n-input
            v-model:value="formValue.name"
            :disabled="complete"
            :autofocus="false"
            placeholder="输入任务名称"
            @change="updateTaskProps('name')"
          />
        </n-form-item>
        <n-form-item label="任务描述:" path="description">
          <n-input
            v-model:value="formValue.description"
            :disabled="complete"
            type="textarea"
            placeholder="任务描述"
            :autosize="{
              minRows: 3
            }"
            @change="updateTaskProps('description')"
          />
        </n-form-item>
        <n-space horizontal :size="30">
          <n-form-item label="开始时间:" path="startDate">
            <n-date-picker
              v-model:value="formValue.startDate"
              :disabled="complete"
              type="datetime"
              @update:value="updateTaskProps('startDate')"
            />
          </n-form-item>
          <n-form-item label="结束时间:" path="endDate">
            <n-date-picker
              v-model:value="formValue.endDate"
              :disabled="complete"
              type="datetime"
              @update:value="updateTaskProps('endDate')"
            />
          </n-form-item>
        </n-space>
        <n-form-item label="优先级:" path="priority">
          <n-select
            v-model:value="formValue.priority"
            :disabled="complete"
            :options="priorityOptions"
            placeholder="请选择任务优先级"
            @update:value="updateTaskProps('priority')"
          />
        </n-form-item>
        <n-form-item label="任务进度:" path="priority">
          <n-slider
            v-model:value="formValue.progress"
            :disabled="complete"
            :marks="{ 0: '0%', 50: '50%', 100: '100%' }"
            :step="10"
            @update:value="updateTaskProps('progress')"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space horizontal style="float: right">
          <n-button tertiary @click="handleClose"> 取消 </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { FormInst, useMessage } from 'naive-ui'
import { TaskType, useTaskStore } from '@/store'
import { Close } from '@vicons/ionicons5'
import { priorityOptions } from '@/constant'
import dayjs from 'dayjs'

const props = defineProps<{
  /** 弹窗显隐 */
  value: boolean;
  task: TaskType;
  complete: boolean;
}>()

const emit = defineEmits<{
  (e: 'update:value', val: boolean): void;
}>()

const taskStore = useTaskStore()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const formValue = ref<TaskType>({
  name: props.task.name,
  description: props.task.description,
  startDate: dayjs(props.task.startDate).valueOf(),
  endDate: dayjs(props.task.startDate).valueOf(),
  priority: props.task.priority,
  progress: props.task.progress
})

const rules = {
  name: {
    required: true,
    message: '请输入任务名称',
    trigger: 'blur'
  },
  description: {
    required: true,
    message: '请输入任务描述',
    trigger: 'blur'
  },
  priority: {
    required: true,
    message: '请选择任务优先级',
    trigger: ['blur', 'change']
  }
}

const showModal = computed({
  get() {
    return props.value
  },
  set(val: boolean) {
    emit('update:value', val)
  }
})

/** 更新任务单个属性 */
async function updateTaskProps(propName: string) {
  const taskId = props.task.id
  let propValue: any
  if (propName == 'endDate' || propName == 'startDate') {
    propValue = new Date(formValue.value[propName] as number)
  } else {
    propValue = formValue.value[propName]
  }
  await taskStore.updateTaskProps(taskId, propName, propValue)
  message.success('操作成功')
}

function handleClose() {
  showModal.value = false
}
</script>

<style lang="scss" scoped></style>
