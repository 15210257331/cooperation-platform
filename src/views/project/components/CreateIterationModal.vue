<template>
  <n-modal v-model:show="showModal">
    <n-card
      :segmented="{
        content: true,
        footer: true
      }"
      style="width: 620px"
      :title="title"
      :bordered="false"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button quaternary circle>
          <template #icon>
            <n-icon :component="Close" size="20" @click="showModal = false"> </n-icon>
          </template>
        </n-button>
      </template>
      <n-form ref="formRef" label-placement="left" :label-width="90" :model="formValue" :rules="rules">
        <n-form-item label="迭代名称:" path="name">
          <n-input v-model:value="formValue.name" placeholder="请输入迭代名称" />
        </n-form-item>
        <n-form-item label="迭代类型:" path="type">
          <n-select v-model:value="formValue.type" :options="iterationTypeOptions" placeholder="请选择迭代类型" />
        </n-form-item>
        <n-form-item label="开始时间:" path="startDate">
          <n-date-picker v-model:value="formValue.startDate" type="datetime" clearable />
        </n-form-item>
        <n-form-item label="结束时间:" path="endDate">
          <n-date-picker v-model:value="formValue.endDate" type="datetime" clearable />
        </n-form-item>
        <n-form-item label="附件:" path="attachment">
          <n-upload
            :headers="{
              Authorization: `Bearer ${token}`
            }"
            :action="action"
            :custom-request="customRequest"
            :default-file-list="defaultFileList"
          >
            <n-button>上传文件</n-button>
          </n-upload>
        </n-form-item>
        <n-form-item label="迭代内容:" path="content">
          <n-input
            v-model:value="formValue.content"
            type="textarea"
            placeholder="请输入迭代详细内容"
            :autosize="{
              minRows: 4
            }"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space horizontal style="float: right">
          <n-button tertiary @click="showModal = false"> 取消 </n-button>
          <n-button type="primary" @click="handleSubmit"> 确认 </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { FormInst, UploadCustomRequestOptions, useMessage } from 'naive-ui'
import { computed, ref } from 'vue'
import { createIterationAPI, updateIterationAPI, uploadFile } from '@/api'
import { Close } from '@vicons/ionicons5'
import { useProjectStore } from '@/store'
import { iterationTypeOptions } from '@/config/iteration'

const emits = defineEmits<{
  (e: 'result'): void
}>()

const projectStore = useProjectStore()
const message = useMessage()
const showModal = ref<boolean>(false)
const formRef = ref<FormInst | null>(null)
const title = ref<string>('新建迭代')
const formValue = ref<{
  id: string
  name: string
  type: null | number
  attachment: Array<string>
  startDate: number
  endDate: number
  content: string
}>({
  id: '',
  name: '',
  type: null,
  attachment: [],
  startDate: new Date().getTime(),
  endDate: new Date(Date.now() + 3600 * 1000 * 7).getTime(),
  content: ''
})
const rules = {
  name: {
    required: true,
    message: '迭代名称必填',
    trigger: 'blur'
  },
  type: {
    required: true,
    message: '迭代类型必填'
  },
  startDate: {
    required: true,
    message: '开始时间必填'
  },
  endDate: {
    required: true,
    message: '结束时间必填'
  }
}

function show(data?: any) {
  resetForm()
  showModal.value = true
  if (data) {
    title.value = '迭代修改'
    const { id, name, type, content, attachment, startDate, endDate } = data
    formValue.value = {
      id: id as string,
      name: name,
      type: type,
      attachment: attachment,
      content: content,
      startDate: new Date(startDate).getTime(),
      endDate: new Date(endDate).getTime()
    }
  } else {
    title.value = '新建迭代'
  }
}

function resetForm() {
  formRef.value?.restoreValidation()
  formValue.value = {
    id: '',
    name: '',
    type: null,
    content: '',
    attachment: [],
    startDate: new Date().getTime(),
    endDate: new Date().getTime()
  }
}

function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async errors => {
    if (!errors) {
      if (formValue.value.id) {
        const data = {
          ...formValue.value,
          projectId: projectStore.currentProject?.id as string,
          startDate: new Date(formValue.value.startDate),
          endDate: new Date(formValue.value.endDate)
        }
        updateIterationAPI(data).then(res => {
          if (res.code === 10000) {
            message.success('操作成功')
            showModal.value = false
            emits('result')
          }
        })
      } else {
        const data = {
          ...formValue.value,
          projectId: projectStore.currentProject?.id as string,
          startDate: new Date(formValue.value.startDate),
          endDate: new Date(formValue.value.endDate)
        }
        createIterationAPI(data).then(res => {
          if (res.code === 10000) {
            message.success('创建成功')
            showModal.value = false
            emits('result')
          }
        })
      }
    }
  })
}

const token = localStorage.getItem('token')
const action = import.meta.env.VITE_APP_BASE_API + '/api/file/upload'
const defaultFileList = computed(() => {
  return formValue.value.attachment.map((item, index) => {
    return {
      id: 'xxxx' + index,
      name: item,
      status: 'finished'
    }
  })
})
function handleFinish(val) {
  console.log(val.event)
}
function customRequest({
  file,
  data,
  headers,
  withCredentials,
  action,
  onFinish,
  onError,
  onProgress
}: UploadCustomRequestOptions) {
  const formData = new FormData()
  if (data) {
    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof UploadCustomRequestOptions['data']])
    })
  }
  formData.append('file', file.file as File)
  uploadFile(formData).then(res => {
    console.log(res)
    if (res.code === 10000) {
      // showUrl.value = res.data.url
      formValue.value.attachment = [...formValue.value.attachment, res.data.url as string]
    }
  })
}

defineExpose({
  show
})
</script>

<style lang="scss" scoped></style>
