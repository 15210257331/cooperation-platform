<template>
  <n-layout class="login-wrapper">
    <n-layout-header class="header">
      <div class="header-left">
        <img :src="logo" alt="" />
        <h2>项目协作平台</h2>
      </div>
      <div class="header-right">
        <n-space>
          <n-button quaternary @click="toggleTheme"> {{ appStore.darkTheme === true ? '深色' : '浅色' }} </n-button>
          <n-button quaternary> GitHub </n-button>
          <n-button quaternary> 1.1.3 </n-button>
        </n-space>
      </div>
    </n-layout-header>
    <transition :name="showLogin ? 'slide-right' : 'slide-left'" mode="out-in">
      <LoginContent v-if="showLogin" @change="change"></LoginContent>
      <RegisterContent v-else @change="change"></RegisterContent>
    </transition>
    <div class="footer">
      <n-button text tag="a" href="https://beian.miit.gov.cn/" target="_blank"> 京ICP备19012558号-2 </n-button>
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import LoginContent from './LoginContent.vue'
import RegisterContent from './RegisterContent.vue'
import logo from '@/assets/logo.png'
import { useAppStore } from '@/store'

const appStore = useAppStore()

const showLogin = ref<boolean>(true)

function change() {
  showLogin.value = !showLogin.value
}

function toggleTheme() {
  appStore.toggleTheme()
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  // background-color: #18a058;
  background-image: url('../../assets/images/login_bg1.jpg');
  background-size: cover;
  position: relative;
  .header {
    height: 65px;
    box-shadow: 0 4px 6px rgb(0 0 0 / 4%);
    padding: 32px;
    display: flex;
    opacity: 0.6;
    justify-content: space-between;
    .header-left {
      display: flex;
      height: 100%;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 24px;
        height: 24px;
        margin-right: 6px;
      }
      h2 {
        font-size: 16px;
        font-weight: 600;
        // color: #213547;
      }
    }
    .header-right {
      display: flex;
      align-items: center;
    }
  }
  .footer {
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    line-height: 60px;
    position: absolute;
    bottom: 0;
    left: 0;
    text-align: center;
  }
}
.slide-left-enter-active {
  transition: all 0.4s ease-out;
}

.slide-left-leave-active {
  transition: all 0.4s ease-out;
}

.slide-left-leave-to {
  transform: translate(-1000px, 0px);
  opacity: 0;
}
.slide-left-enter-from {
  transform: translate(1000px, 0px);
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s ease-out;
}

.slide-right-leave-to {
  transform: translate(1000px, 0px);
  opacity: 0;
}
.slide-right-enter-from {
  transform: translate(-1000px, 0px);
  opacity: 0;
}
</style>
