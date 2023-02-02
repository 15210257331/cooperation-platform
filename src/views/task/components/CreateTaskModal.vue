<template>
  <n-modal v-model:show="showModal">
    <n-card
      :segmented="{
        content: true,
        footer: true
      }"
      style="width: 680px"
      :title="'新建任务'"
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
          <n-input v-model:value="formValue.name" :autofocus="false" placeholder="输入任务名称" />
        </n-form-item>
        <n-form-item label="任务描述:" path="description">
          <n-input
            v-model:value="formValue.description"
            type="textarea"
            placeholder="任务描述"
            :autosize="{
              minRows: 3
            }"
          />
        </n-form-item>
        <n-space>
          <n-form-item label="开始时间:" path="startDate">
            <n-date-picker v-model:value="formValue.startDate" type="datetime" clearable />
          </n-form-item>
          <n-form-item label="结束时间:" path="endDate">
            <n-date-picker v-model:value="formValue.endDate" type="datetime" clearable />
          </n-form-item>
        </n-space>
        <n-form-item label="优先级:" path="priority">
          <n-select v-model:value="formValue.priority" :options="priorityOptions" placeholder="请选择任务优先级" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space horizontal style="float: right">
          <n-button tertiary @click="handleClose"> 取消 </n-button>
          <n-button type="primary" @click="handleSubmit"> 确认 </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { FormInst, useMessage } from 'naive-ui'
import { useProjectStore } from '@/store'
import {TaskType} from '@/interface'
import { Close } from '@vicons/ionicons5'
import { priorityOptions } from '@/constant'
import dayjs from 'dayjs'

interface Props {
  /** 弹窗显隐 */
  value: boolean
  flowId: any
}
const props = defineProps<Props>()

interface Emits {
  (e: 'update:value', val: boolean): void
}
const emit = defineEmits<Emits>()

const projectStore = useProjectStore()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const formValue = ref<TaskType>({
  name: '',
  description: '',
  startDate: new Date().getTime(),
  endDate: new Date().getTime(),
  priority: null,
  progress: 0
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

async function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async errors => {
    if (!errors) {
      createTask()
    } else {
      console.log(errors)
      //   message.error('Invalid');
    }
  })
}

async function createTask() {
  const data = Object.assign({}, formValue.value, {
    startDate: new Date(formValue.value.startDate as number),
    endDate: new Date(formValue.value.endDate as number),
    flowId: props.flowId
  })
  if (dayjs(data.startDate).isAfter(dayjs(data.endDate))) {
    message.success('开始时间不能大于结束时间！')
    return
  }
  await projectStore.createTask(data)
  showModal.value = false
  message.success('操作成功')
}

function handleClose() {
  showModal.value = false
}
</script>

<style lang="scss" scoped></style>
