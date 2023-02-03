<template>
  <n-modal v-model:show="showModal">
    <n-card
      :segmented="{
        content: true,
        footer: true
      }"
      style="width: 620px"
      :title="'新建项目'"
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
          <n-input v-model:value="formValue.name" placeholder="输入姓名" />
        </n-form-item>
        <n-form-item label="项目icon" path="icon">
          <IconSelect v-model="formValue.icon"></IconSelect>
        </n-form-item>
        <n-form-item label="背景图:" path="cover">
          <UploadFile v-model:url="formValue.cover" title="点击上传" />
        </n-form-item>
        <n-form-item label="项目类型" path="type">
          <n-radio-group v-model:value="formValue.type" name="type">
            <n-space>
              <n-radio :value="1"> 普通 </n-radio>
              <n-radio :value="2"> 星标 </n-radio>
            </n-space>
          </n-radio-group>
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
  id: null,
  name: '',
  icon: '',
  cover: '',
  type: 1
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
    formValue.value = {
      id: data.id as any,
      name: data.name,
      icon: data.icon,
      cover: data.cover,
      type: data.type
    }
  }
}

function resetForm() {
  formRef.value?.restoreValidation()
  formValue.value = {
    id: null,
    name: '',
    cover: '',
    icon: '',
    type: 1
  }
}

function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async errors => {
    if (!errors) {
      if (formValue.value.id !== null) {
        updateProject(formValue.value).then(res => {
          if (res.code === 10000) {
            message.success('操作成功')
            showModal.value = false
            emits('result')
          }
        })
      } else {
        createProject(formValue.value).then(res => {
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
