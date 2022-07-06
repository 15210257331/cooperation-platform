<template>
  <div class="login">
    <h2 class="login-title">登录</h2>
    <n-form class="login-form" ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
      <n-form-item path="username">
        <n-input v-model:value="model.username" placeholder="请输入用户名" />
      </n-form-item>
      <n-form-item path="password">
        <n-input v-model:value="model.password" type="password" show-password-on="click" placeholder="请输入密码" />
      </n-form-item>
      <n-space :vertical="true" :size="24">
        <div class="flex-y-center justify-between">
          <n-checkbox v-model:checked="rememberMe">记住我</n-checkbox>
        </div>
        <n-button type="primary" size="large" :block="true" :round="true" @click="handleSubmit"> 确定 </n-button>
      </n-space>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { login } from '@/service/api/user';
import { useRouter } from 'vue-router';

const message = useMessage();
const router = useRouter();
const formRef = ref<(HTMLElement & FormInst) | null>(null);
const model = reactive({
  username: 'chenxiaofei',
  password: '123456'
});
const rules: FormRules = {
  password: [
    {
      required: true,
      message: '请输入密码'
    }
  ],
  userName: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['blur']
    }
  ]
};

const rememberMe = ref<boolean>(false);

function handleSubmit(e: MouseEvent) {
  if (!formRef.value) return;
  e.preventDefault();

  formRef.value.validate(errors => {
    if (!errors) {
      const { username, password } = model;
      login({ username, password }).then(res => {
        console.log(res);
        if (res.code === 10000) {
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white url(../assets/images/task_bg.jpg) no-repeat fixed center center;
  .login-title {
    margin: 0 0 30px 0;
    font-size: 23px;
    font-weight: 600;
    text-align: center;
  }
  .login-form {
    width: 420px;
    height: auto;
    padding: 20px;
    border: 1px solid #eee;
    background-color: #eee;
    border-radius: 5px;
  }
}
</style>
