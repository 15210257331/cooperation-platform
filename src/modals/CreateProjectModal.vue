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
      <n-form ref="formRef" label-placement="left" :label-width="80" :model="formValue" :rules="rules">
        <n-form-item label="项目名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="请输入项目名称" />
        </n-form-item>
        <n-form-item label="项目图标" path="icon">
          <IconSelect v-model="formValue.icon"></IconSelect>
        </n-form-item>
        <n-form-item label="背景图:" path="cover">
          <UploadFile v-model:url="formValue.cover" title="点击上传" />
        </n-form-item>
        <n-form-item label="开始时间:" path="cover">
          <n-date-picker v-model:value="formValue.startDate" type="datetime" clearable />
        </n-form-item>
        <n-form-item label="结束时间:" path="cover">
          <n-date-picker v-model:value="formValue.endDate" type="datetime" clearable />
        </n-form-item>
        <n-form-item label="项目类型" path="type">
          <n-radio-group v-model:value="formValue.type" name="type">
            <n-space>
              <n-radio value="group"> 工作流 </n-radio>
              <n-radio value="general"> 普通 </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="标星项目" path="star">
          <n-switch v-model:value="formValue.star" />
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
import { FormInst, useMessage } from 'naive-ui'
import { ref } from 'vue'
import IconSelect from '@/components/IconSelect.vue'
import UploadFile from '@/components/UploadFile.vue'
import { ProjectType } from '@/interface'
import { updateProject, createProject } from '@/api'
import { Close } from '@vicons/ionicons5'

const emits = defineEmits<{
  (e: 'result'): void
}>()

const message = useMessage()
const showModal = ref<boolean>(false)
const formRef = ref<FormInst | null>(null)
const title = ref<string>('新建项目')
const formValue = ref({
  id: '',
  name: '',
  cover: '',
  icon: '',
  type: '',
  star: false,
  startDate: new Date().getTime(),
  endDate: new Date(Date.now() + 3600 * 1000 * 7).getTime()
})
const rules = {
  name: {
    required: true,
    message: '请输入项目名称',
    trigger: 'blur'
  },
  icon: {
    required: true,
    message: '请选择项目icon'
  },
  cover: {
    required: false,
    message: '请选择项目背景图'
  },
  star: {
    required: true,
    message: '是否星标项目必填'
  },
  type: {
    required: true,
    message: '请选择项目类型'
  }
}

function show(data?: ProjectType) {
  resetForm()
  showModal.value = true
  if (data) {
    title.value = '修改项目'
    const { id, name, icon, cover, type, star, startDate, endDate } = data
    formValue.value = {
      id: id as string,
      name: name,
      icon: icon,
      cover: cover,
      type: type,
      star: star,
      startDate: parseInt(startDate),
      endDate: parseInt(endDate)
    }
  } else {
    title.value = '新建项目'
  }
}

function resetForm() {
  formRef.value?.restoreValidation()
  formValue.value = {
    id: '',
    name: '',
    cover: '',
    icon: '',
    type: '',
    star: false,
    startDate: new Date().getTime(),
    endDate: new Date().getTime()
  }
}

function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async errors => {
    if (!errors) {
      if (formValue.value.id) {
        updateProject(formValue.value).then(res => {
          if (res.code === 10000) {
            message.success('操作成功')
            showModal.value = false
            emits('result')
          }
        })
      } else {
        const data = {
          ...formValue.value,
          startDate: new Date(formValue.value.startDate),
          endDate: new Date(formValue.value.endDate)
        }
        createProject(data).then(res => {
          if (res.code === 10000) {
            message.success('项目创建成功')
            showModal.value = false
            emits('result')
          }
        })
      }
    }
  })
}

defineExpose({
  show
})
</script>

<style lang="scss" scoped></style>
