<template>
  <n-modal v-model:show="show">
    <n-card
      :segmented="{
        content: true,
        footer: true
      }"
      style="width: 620px"
      title="个人信息"
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
      <n-form ref="formRef" :label-placement="'left'" :label-width="'auto'" :model="userStore.userInfo" :rules="rules">
        <n-form-item label="头像:" path="avatar">
          <UploadFile v-model:url="formValue.avatar" title="点击上传" />
        </n-form-item>
        <n-form-item label="用户名:" path="username">
          <n-input v-model:value="formValue.username" disabled placeholder="用户名" />
        </n-form-item>
        <n-form-item label="昵称:" path="nickname">
          <n-input v-model:value="formValue.nickname" placeholder="昵称" />
        </n-form-item>
        <n-form-item label="手机号:" path="phone">
          <n-input v-model:value="formValue.phone" placeholder="手机号" />
        </n-form-item>
        <n-form-item label="角色:" path="role">
          <n-select v-model:value="formValue.role" disabled :options="options" />
        </n-form-item>
        <n-form-item label="个人简介:" path="intro">
          <n-input v-model:value="formValue.intro" type="textarea" placeholder="个人简介" />
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
import { ref, computed, onMounted } from 'vue'
import { useUserStore, UserInfoType } from '@/store'
import { Close } from '@vicons/ionicons5'
import { FormInst, useMessage } from 'naive-ui'
import { updateUserInfo } from '@/api'
import UploadFile from '@/components/UploadFile.vue'
import { roleMap } from '@/config'
interface Props {
  /** 弹窗显隐 */
  value: boolean
}
const props = defineProps<Props>()

interface Emits {
  (e: 'update:value', val: boolean): void
}
const emit = defineEmits<Emits>()

const userStore = useUserStore()
const message = useMessage()

const options = Object.keys(roleMap).map(key => {
  return {
    label: roleMap[key],
    value: key
  }
})
const formRef = ref<FormInst | null>(null)
const formValue = computed(() => {
  return userStore.userInfo
})
const show = computed({
  get() {
    return props.value
  },
  set(val: boolean) {
    emit('update:value', val)
  }
})
const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  nickname: {
    required: true,
    message: '请输入昵称',
    trigger: 'blur'
  },
  phone: {
    required: true,
    message: '请输入手机号',
    trigger: 'blur'
  }
  // role: {
  //   required: true,
  //   message: '请选择角色',
  //   trigger: 'blur'
  // }
}
function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(async errors => {
    if (!errors) {
      updateUserInfo(formValue.value).then(res => {
        if (res.code === 10000) {
          message.success(res.message)
          handleClose()
        }
      })
    } else {
      console.log(errors)
      //   message.error('Invalid');
    }
  })
}
function handleClose() {
  show.value = false
}
</script>

<style lang="scss" scoped></style>
