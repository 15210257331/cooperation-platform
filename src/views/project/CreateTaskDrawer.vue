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
        <n-form-item label="优先级:" path="priority">
          <n-radio-group v-model:value="formValue.priority" size="small">
            <n-radio-button v-for="song in priorityOptions" :key="song.value" :value="song.value" :label="song.label" />
          </n-radio-group>
        </n-form-item>
        <n-form-item label="标签:" path="tags">
          <div style="width: 100%">
            <n-select
              v-model:value="formValue.tags"
              :max-tag-count="3"
              filterable
              multiple
              tag
              placeholder="无合适标签？输入按回车新建"
              :show-arrow="false"
              :show="false"
              @update:value="handleUpdateValue"
            />
            <n-space style="margin-top: 10px">
              <n-tag
                v-for="(item, index) in projectStore.currentProject?.tags"
                :key="index"
                size="small"
                :bordered="false"
                :disabled="item.disabled"
                @click="handleSelectTag(item)"
              >
                {{ item.name }}
              </n-tag>
            </n-space>
          </div>
        </n-form-item>
        <n-form-item label="分配给:" path="member">
          <n-select :options="members" :render-label="renderLabel" :render-tag="renderSingleSelectTag" />
        </n-form-item>
        <n-form-item label="截止时间:" path="endDate">
          <n-date-picker v-model:value="formValue.endDate" type="datetime" clearable />
        </n-form-item>
        <n-form-item label="任务描述:" label-placement="top" path="description">
          <n-input
            v-model:value="formValue.description"
            type="textarea"
            placeholder="请输入任务描述"
            :autosize="{
              minRows: 4
            }"
          />
        </n-form-item>
        <n-form-item label="附件:" label-placement="top" path="attachment">
          <div style="display: flex; width: 100%">
            <n-card
              hoverable
              :content-style="{ padding: '10px' }"
              style="margin-right: 18px; flex: 1; border-radius: 8px"
            >
              <div class="attachment">
                <n-icon :component="FlagSharp" :size="24" :color="'#d03050'" />
                <div class="info">
                  <p>product readme.text</p>
                  <span>14.23M</span>
                </div>
              </div>
            </n-card>
            <n-card hoverable :content-style="{ padding: '10px' }" style="flex: 1; border-radius: 8px">
              <div class="attachment">
                <n-icon :component="FlagSharp" :size="24" :color="'#d03050'" />
                <div class="info">
                  <p>product readme.text</p>
                  <span>14.23M</span>
                </div>
              </div>
            </n-card>
          </div>
        </n-form-item>
        <n-space justify="end">
          <n-button type="primary" size="small" @click="handleSubmit">发布任务</n-button>
        </n-space>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, h } from 'vue'
import { FormInst, UploadFileInfo, useMessage } from 'naive-ui'
import { useProjectStore } from '@/store'
import { TaskType } from '@/interface'
import { Close, FlagSharp } from '@vicons/ionicons5'
import { priorityOptions } from '@/constant'
import dayjs from 'dayjs'
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
  priority: '1',
  tags: [],
  progress: 0
})

function handleUpdateValue($event: any) {
  if ($event.length > 0) {
    const data = {
      projectId: projectStore.currentProject?.id,
      name: $event[$event.length - 1]
    }
    projectStore.createProjectTag(data)
  }
}
function handleSelectTag(item: any) {
  if (formValue.value.tags.indexOf(item.name) === -1) {
    formValue.value.tags.push(item.name)
  }
}

const members = computed(() => {
  return projectStore.currentProject?.members.map(item => {
    return { ...item, label: item.nickname, value: item.id }
  })
})
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
      option.nickname as string
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
          h('div', null, [option.nickname as string]),
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
    flowId: props.flowId,
    tagIds: formValue.value.tags.map(
      item => projectStore.currentProject?.tags.find(sonItem => sonItem.name === item).id
    )
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
    progress: 0,
    tags: []
  }
  formRef.value?.restoreValidation()
}

function handleClose() {
  showModal.value = false
  resetForm()
}
</script>

<style lang="scss" scoped>
.attachment {
  display: flex;
  justify-content: center;
  align-items: center;
  .info {
    margin-left: 8px;
    p {
      font-size: 13px;
      margin: 0;
      line-height: 13px;
      font-weight: 500;
    }
    span {
      color: #888;
      font-size: 12px;
      line-height: 12px;
    }
  }
}
</style>
