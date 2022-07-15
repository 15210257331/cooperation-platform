<template>
  <n-card :content-style="{ padding: '15px 30px 15px 30px', width: '100%' }" class="login">
    <div class="title">
      <h3>用户登录</h3>
      <span>简易任务管理器</span>
    </div>
    <n-form class="login-form" ref="formRef" :model="form" :rules="rules" :show-label="false">
      <n-form-item path="username">
        <n-input v-model:value="form.username" placeholder="请输入用户名">
          <template #prefix>
            <n-icon :component="Person" />
          </template>
          <template #suffix>
            <n-icon :component="Close" @click="clear" style="cursor: pointer" />
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
  </n-card>
</template>

<script setup lang="ts">
import { FormInst, FormRules, useMessage } from 'naive-ui';
import { reactive, ref, onMounted } from 'vue';
import { login } from '@/api';
import { useRouter } from 'vue-router';
import { FlashOutline, LockClosed, Person, Close } from '@vicons/ionicons5';

interface Emits {
  (e: 'change'): void;
}

const emit = defineEmits<Emits>();

const message = useMessage();
const router = useRouter();
const formRef = ref<(HTMLElement & FormInst) | null>(null);
const rememberMe = ref<boolean>(false);
const form = reactive({
  username: '',
  password: ''
});
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
};

onMounted(() => {
  form.username = localStorage.getItem('username') || '';
  form.password = localStorage.getItem('password') || '';
  if (form.username) {
    rememberMe.value = true;
  }
});

function register() {
  emit('change');
}
function clear() {
  form.username = '';
  form.password = '';
  if (formRef.value) {
    formRef.value.restoreValidation();
  }
}
function rememberPass() {
  localStorage.setItem('username', form.username);
  localStorage.setItem('password', form.password);
}
function deletePass() {
  localStorage.removeItem('username');
  localStorage.removeItem('password');
}
function handleSubmit(e: MouseEvent) {
  if (!formRef.value) return;
  e.preventDefault();

  formRef.value.validate(errors => {
    if (!errors) {
      const { username, password } = form;
      login({ username, password }).then(res => {
        console.log(res);
        if (res.code === 10000) {
          if (rememberMe.value === true) {
            rememberPass();
          } else {
            deletePass();
          }
          localStorage.setItem('token', res.data.token);
          router.push({
            name: 'home'
          });
          message.success('登录成功', {
            keepAliveOnHover: true
          });
        }
      });
    }
  });
}
</script>

<style lang="scss" scoped>
.login {
  width: 420px;
  height: 390px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -210px;
  margin-top: -195px;
  z-index: 999;

  .title {
    margin: 20px 0;
    text-align: center;
    width: 100%;
    h3 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 10px;
    }
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
