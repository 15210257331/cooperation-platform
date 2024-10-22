<template>
  <n-modal v-model:show="showModal" @after-leave="handleClose">
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
        <n-form-item label="角色名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="请输入角色名称" />
        </n-form-item>
        <n-form-item label="角色描述" path="description">
          <n-input v-model:value="formValue.description" placeholder="请输入角色描述" />
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
import { reactive, ref } from 'vue'
import { ProjectType } from '@/interface'
import { roleAddAPI, roleUpdateAPI } from '@/api'
import { Close } from '@vicons/ionicons5'

const emits = defineEmits<{
  (e: 'result'): void
}>()

const message = useMessage()

const roleId = ref<string>('')
const title = ref<string>('添加角色')
const showModal = ref<boolean>(false)

function show(data) {
  if (data) {
    roleId.value = data.id
    title.value = '修改角色'
    formValue.value.name = data.name
    formValue.value.description = data.description
  }
  showModal.value = true
}

function handleClose() {
  roleId.value = ''
  formValue.value.name = ''
  formValue.value.description = ''
}

const formRef = ref<FormInst | null>(null)
const formValue = ref({
  name: '',
  description: ''
})
const rules = {
  name: {
    required: true,
    message: '请输入角色名称',
    trigger: 'blur'
  },
  description: {
    required: true,
    message: '请输入角色描述',
    trigger: 'blur'
  }
}

function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async errors => {
    if (!errors) {
      if (roleId.value) {
        roleUpdateAPI({ id: roleId.value, ...formValue.value }).then(res => {
          if (res.code === 10000) {
            message.success(res.message)
            showModal.value = false
            emits('result')
          }
        })
      } else {
        roleAddAPI(formValue.value).then(res => {
          if (res.code === 10000) {
            message.success(res.message)
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
