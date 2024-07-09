<template>
  <n-drawer v-model:show="showModal" :width="502">
    <n-drawer-content title="创建任务" closable>
      <n-form
        ref="formRef"
        :label-placement="'left'"
        :show-require-mark="false"
        :label-width="'auto'"
        :model="formValue"
        :rules="rules"
      >
        <n-form-item label="标题:" path="name">
          <n-input v-model:value="formValue.name" :autofocus="false" placeholder="输入任务名称" />
        </n-form-item>
        <n-form-item label="优先级:" path="name">
          <PrioritySelect v-model:value="formValue.priority" />
        </n-form-item>
        <n-form-item label="标签:" path="name">
          <div>
            <n-select
              v-model:value="formValue.tag"
              filterable
              multiple
              tag
              placeholder="输入，按回车确认"
              :show-arrow="false"
              :show="false"
            />
            <n-space style="margin-top: 10px">
              <n-tag :bordered="false"> 爱在西元前 </n-tag>
              <n-tag :bordered="false" type="success"> 不该 </n-tag>
              <n-tag :bordered="false" type="warning"> 超人不会飞 </n-tag>
              <n-tag :bordered="false" type="error"> 手写的从前 </n-tag>
              <n-tag :bordered="false" type="info"> 哪里都是你 </n-tag>
            </n-space>
          </div>
        </n-form-item>
        <n-form-item label="分配给:" path="name">
          <n-select :options="options1" :render-label="renderLabel" :render-tag="renderSingleSelectTag" />
        </n-form-item>
        <n-form-item label="截止时间:" path="startDate">
          <n-date-picker v-model:value="formValue.endDate" type="datetime" clearable />
        </n-form-item>
        <n-form-item label="描述:" path="description">
          <n-input
            v-model:value="formValue.description"
            type="textarea"
            placeholder="任务描述"
            :autosize="{
              minRows: 3
            }"
          />
        </n-form-item>
        <n-form-item label="附件:" path="description">
          <n-upload
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            :default-file-list="fileListRef"
            list-type="image"
            :create-thumbnail-url="createThumbnailUrl"
          >
            <n-button>上传文件</n-button>
          </n-upload>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button @click="handleSubmit">发布</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import { FormInst, UploadFileInfo, useMessage } from 'naive-ui'
import { useProjectStore } from '@/store'
import { TaskType } from '@/interface'
import { Close } from '@vicons/ionicons5'
import { priorityOptions } from '@/constant'
import dayjs from 'dayjs'
import PrioritySelect from '@/components/PrioritySelect.vue'
import { NAvatar, NText, NTag, SelectRenderTag, SelectRenderLabel } from 'naive-ui'

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
  priority: 1,
  tag: '',
  progress: 0
})

const fileListRef = ref<UploadFileInfo[]>([
  {
    id: 'a',
    name: '我错了.png',
    status: 'error'
  },
  {
    id: 'b',
    name: '普通文本.doc',
    status: 'finished',
    type: 'text/plain'
  },
  {
    id: 'c',
    name: '图片.png',
    status: 'finished',
    url: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
  },
  {
    id: 'd',
    name: '没传完.doc',
    status: 'uploading',
    percentage: 50
  }
])
function createThumbnailUrl(file: File | null): Promise<string> | undefined {
  if (!file) return undefined
  message.info('createThumbnailUrl 产生了图片的 URL，你传什么都会变成 07akioni')
  message.info(`${file.name}`)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg')
    }, 1000)
  })
}
const renderTag: SelectRenderTag = ({ option, handleClose }) => {
  return h(
    NTag,
    {
      type: option.type as 'success' | 'warning' | 'error',
      closable: true,
      size: 'small',
      onMousedown: (e: FocusEvent) => {
        e.preventDefault()
      },
      onClose: (e: MouseEvent) => {
        e.stopPropagation()
        handleClose()
      }
    },
    { default: () => option.label }
  )
}
const options1 = [
  {
    label: '07akioni',
    value: '07akioni'
  },
  {
    label: '08akioni',
    value: '08akioni'
  },
  {
    label: '09akioni',
    value: '09akioni'
  }
]
const renderSingleSelectTag: SelectRenderTag = ({ option }) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    },
    [
      h(NAvatar, {
        src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
        round: true,
        size: 24,
        style: {
          marginRight: '12px'
        }
      }),
      option.label as string
    ]
  )
}
const renderLabel: SelectRenderLabel = option => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    },
    [
      h(NAvatar, {
        src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
        round: true,
        size: 'small'
      }),
      h(
        'div',
        {
          style: {
            marginLeft: '12px',
            padding: '4px 0'
          }
        },
        [
          h('div', null, [option.label as string]),
          h(
            NText,
            { depth: 3, tag: 'div' },
            {
              default: () => 'description'
            }
          )
        ]
      )
    ]
  )
}
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
  formRef.value?.restoreValidation()
  message.success('操作成功')
}

function resetForm() {
  formValue.value = {
    name: '',
    description: '',
    startDate: new Date().getTime(),
    endDate: new Date().getTime(),
    priority: null,
    progress: 0
  }
  formRef.value?.restoreValidation()
}

function handleClose() {
  showModal.value = false
  resetForm()
}
</script>

<style lang="scss" scoped></style>
