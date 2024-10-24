<template>
  <n-card :content-style="{ padding: '15px 30px 25px 30px', width: '100%' }" class="login">
    <h3 class="title">用户登录</h3>
    <n-form ref="formRef" class="login-form" :model="form" :rules="rules" :show-label="false">
      <n-form-item path="username">
        <n-input v-model:value="form.username" placeholder="请输入用户名">
          <template #prefix>
            <n-icon :component="Person" />
          </template>
          <template #suffix>
            <n-icon :component="Close" style="cursor: pointer" @click="clear" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item path="password">
        <n-input v-model:value="form.password" type="password" show-password-on="click" placeholder="请输入密码">
          <template #prefix>
            <n-icon :component="LockClosed" />
          </template>
        </n-input>
      </n-form-item>
      <n-space :vertical="true" :size="24">
        <n-space justify="space-between">
          <n-checkbox v-model:checked="rememberMe">记住密码</n-checkbox>
          <n-button text type="primary" @click="register"> 注册账号 </n-button>
        </n-space>
        <n-button type="primary" size="large" :block="true" :round="true" @click="handleSubmit"> 登录 </n-button>
      </n-space>
    </n-form>
    <n-divider>其它登录方式</n-divider>
    <n-space justify="space-around">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon
            size="26"
            style="cursor: pointer"
            color="#0e7a0d"
            :component="LogoWechat"
            @click="handleWechatAuth"
          ></n-icon>
        </template>
        微信登录
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon
            size="26"
            color="rgb(118, 124, 130)"
            style="cursor: pointer"
            :component="LogoGithub"
            @click="handleGithubAuth"
          ></n-icon>
        </template>
        Github登录
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon
            size="26"
            style="cursor: pointer"
            color="#fcb040"
            :component="LogoGitlab"
            @click="handleGitlabAuth"
          ></n-icon>
        </template>
        Gitlab登录
      </n-tooltip>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { FormInst, FormRules, useMessage } from 'naive-ui'
import { reactive, ref, onMounted } from 'vue'
import { login, githubAuthorize } from '@/api'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore, useUserStore } from '@/store'
import { LockClosed, Person, Close, LogoWechat, LogoGithub, LogoGitlab } from '@vicons/ionicons5'

interface Emits {
  (e: 'change'): void
}
const emit = defineEmits<Emits>()

const message = useMessage()
const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const githubCode = ref<string>('')
const thirdLoginLoading = ref<boolean>(false)
const formRef = ref<(HTMLElement & FormInst) | null>(null)
const rememberMe = ref<boolean>(false)
const form = reactive({
  username: '',
  password: ''
})
const rules: FormRules = {
  password: [
    {
      required: true,
      message: '请输入密码'
    }
  ],
  username: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['blur']
    }
  ]
}

onMounted(() => {
  form.username = localStorage.getItem('username') || ''
  form.password = localStorage.getItem('password') || ''
  if (form.username) {
    rememberMe.value = true
  }
})

/** github 授权 */
function handleGithubAuth() {
  githubAuthorize().then(res => {
    window.location.href = res.data
  })
}
/** gitlab 授权 */
function handleGitlabAuth() {
  message.info('规划中...')
}
/** 微信 授权 */
function handleWechatAuth() {
  message.info('规划中...')
}

function register() {
  emit('change')
}
function clear() {
  form.username = ''
  form.password = ''
  if (formRef.value) {
    formRef.value.restoreValidation()
  }
}
function rememberPass() {
  localStorage.setItem('username', form.username)
  localStorage.setItem('password', form.password)
}
function deletePass() {
  localStorage.removeItem('username')
  localStorage.removeItem('password')
}
function handleSubmit(e: MouseEvent) {
  if (!formRef.value) {
    return
  }
  e.preventDefault()

  formRef.value.validate(errors => {
    if (!errors) {
      const { username, password } = form
      login({ username, password }).then(res => {
        if (res.code === 10000) {
          const { token, userInfo } = res.data
          if (rememberMe.value === true) {
            rememberPass()
          } else {
            deletePass()
          }
          localStorage.setItem('token', token)
          userStore.setUserInfo(userInfo)
          successLogin()
        }
      })
    }
  })
}

function successLogin() {
  router.push('/')
  message.success('登录成功', {
    keepAliveOnHover: true
  })
}
</script>

<style lang="scss" scoped>
.login {
  width: 420px;
  height: auto;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;

  .title {
    margin: 20px 0;
    text-align: center;
    width: 100%;
    font-size: 28px;
    color: #18a058;
    font-weight: 600;
    span {
      color: #3e3e3e;
      font-size: 12px;
    }
  }

  .login-form {
    width: 100%;
  }
}
</style>
