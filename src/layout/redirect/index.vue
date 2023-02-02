<template>
  <div class="redirect">
    <n-card style="width: 400px">
      <div class="content">
        <n-icon size="40" :component="LogoGithub" />
        <span>········</span>
        <n-icon size="40" :component="LogoAppleAppstore" />
      </div>
      <n-spin description="授权登录中"> </n-spin>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { githubLogin } from '@/api'
import { useMessage } from 'naive-ui'
import { LogoGithub, LogoAppleAppstore } from '@vicons/ionicons5'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const thirdLoginLoading = ref<boolean>(false)
const githubCode = ref<string>('')

githubCode.value = route.query.code as string

if (githubCode.value) {
  handleGithubLogin(githubCode.value)
}

/** github 登录 */
function handleGithubLogin(code: string) {
  thirdLoginLoading.value = true
  githubLogin({ code })
    .then(res => {
      localStorage.setItem('token', res.data.token)
      thirdLoginLoading.value = false
      router.push({
        name: 'home'
      })
      message.success('登录成功')
    })
    .catch(err => {
      thirdLoginLoading.value = false
      router.push({
        name: 'login'
      })
    })
}
</script>

<style lang="scss" scoped>
.redirect {
  width: 100%;
  height: 100%;
//   background-color: #18a058;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    span {
      margin: 0 20px;
    }
  }
}
</style>
