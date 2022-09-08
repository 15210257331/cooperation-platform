<template>
  <n-card :content-style="{ padding: '15px 35px 35px 35px', width: '100%' }" class="register">
    <div class="title">
      <h3>账户注册</h3>
    </div>
    <n-form ref="registerformRef" class="register-form" :model="form" :rules="rules" :show-label="false">
      <n-form-item path="nickname">
        <n-input v-model:value="form.nickname" placeholder="请输入昵称">
          <template #prefix>
            <n-icon :component="PersonAddSharp" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item ref="phoneFormItemRef" path="phone">
        <n-input v-model:value="form.phone" placeholder="请输入手机号">
          <template #prefix>
            <n-icon :component="PhonePortraitOutline" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="verificationCode">
        <n-grid x-gap="15" :cols="24">
          <n-gi :span="16">
            <n-input v-model:value="form.verificationCode" autocomplete="off" placeholder="请输入验证码">
              <template #prefix>
                <n-icon :component="FlashOutline" />
              </template>
            </n-input>
          </n-gi>
          <n-gi :span="8">
            <n-button :block="true" type="primary" :disabled="isCounting" @click="getCode">
              {{ isCounting ? '重新获取(' + counts + 's)' : '获取验证码' }}
            </n-button>
          </n-gi>
        </n-grid>
      </n-form-item>
      <n-form-item path="password">
        <n-input
          v-model:value="form.password"
          autocomplete="new-password"
          type="password"
          placeholder="输入密码"
          @input="handlePasswordInput"
        >
          <template #prefix>
            <n-icon :component="LockClosed" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="rPassword">
        <n-input ref="rPasswordFormItemRef" v-model:value="form.rPassword" type="password" placeholder="重复密码">
          <template #prefix>
            <n-icon :component="LockClosed" />
          </template>
        </n-input>
      </n-form-item>
      <n-space :vertical="true" :size="24">
        <n-space justify="space-between">
          <n-checkbox v-model:checked="agreePrivacy">我同意隐私协议</n-checkbox>
          <n-button text type="primary" @click="goLogin">已有账号?登录</n-button>
        </n-space>
        <n-button type="primary" size="large" :block="true" :round="true" @click="onSubmit"> 注册 </n-button>
      </n-space>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { FormInst, FormItemInst, FormItemRule, FormRules, useMessage } from 'naive-ui'
import { ref, reactive } from 'vue'
import { FlashOutline, PersonAddSharp, PhonePortraitOutline, LockClosed } from '@vicons/ionicons5'
import { register, sendCode } from '@/api'
import { useCountDown } from '@/hooks'

interface Emits {
  (e: 'change'): void;
}
const emit = defineEmits<Emits>()

const message = useMessage()
const { counts, isCounting, startCountDown } = useCountDown()
const registerformRef = ref<FormInst | null>(null)
const agreePrivacy = ref<boolean>(false)
const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const phoneFormItemRef = ref<FormItemInst | null>(null)
const form = ref({
  nickname: null,
  phone: null,
  verificationCode: null,
  password: '',
  rPassword: ''
})
const rules: FormRules = {
  nickname: [
    {
      required: true,
      message: '请输入昵称',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      trigger: 'blur',
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error('请输手机号')
        } else if (!/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
          return new Error('手机号格式不正确')
        }
        return true
      }
    },
    {
      pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
      message: '请输入正确的手机号'
    }
  ],
  verificationCode: [
    {
      required: true,
      message: '请输验证码',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入用密码',
      trigger: 'blur'
    }
  ],
  rPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur']
    },
    {
      validator: validatePasswordStartWith,
      message: '两次密码输入不一致',
      trigger: 'input'
    },
    {
      validator: validatePasswordSame,
      message: '两次密码输入不一致',
      trigger: ['blur', 'password-input']
    }
  ]
}
function validatePasswordStartWith(rule: FormItemRule, value: string): boolean {
  return !!form.value.password && form.value.password.startsWith(value) && form.value.password.length >= value.length
}
function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === form.value.password
}
function handlePasswordInput() {
  if (form.value.rPassword) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
  }
}
function goLogin() {
  emit('change')
}
function getCode() {
  phoneFormItemRef.value?.validate('blur', (error: any) => {
    console.log(error)
    if (!error) {
      sendCode({ phone: form.value.phone }).then(res => {
        if (res.code === 10000) {
          startCountDown()
          message.success('验证码发送成功')
        }
      })
    }
  })
}
function onSubmit(e: MouseEvent) {
  e.preventDefault()
  registerformRef.value?.validate(errors => {
    if (!errors) {
      if (!agreePrivacy.value) {
        message.error('请同意隐私协议')
        return
      }
      const data = Object.assign({}, form.value)
      //   delete data.rPassword;
      register(data).then(res => {
        if (res.code === 10000) {
          message.success('注册成功')
          setTimeout(() => {
            goLogin()
            registerformRef.value?.restoreValidation()
          }, 1000)
        }
      })
    } else {
      console.log(errors)
    }
  })
}
</script>

<style lang="scss" scoped>
.register {
  width: 480px;
  height: auto;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -240px;
  margin-top: -250px;
  z-index: 999;
  .title {
    margin: 20px 0;
    text-align: center;
    width: 100%;
    h3 {
      font-size: 28px;
      font-weight: 600;
    }
  }

  .register-form {
    width: 100%;
  }
}
</style>
