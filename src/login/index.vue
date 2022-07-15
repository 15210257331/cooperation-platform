<template>
  <div class="login-wrapper">
    <!-- <vue-particles class="login-bg" color="#dedede"></vue-particles> -->
    <transition :name="showLogin ? 'slide-right' : 'slide-left'" mode="out-in">
      <LoginContent v-if="showLogin" @change="change"></LoginContent>
      <RegisterContent v-else @change="change"></RegisterContent>
    </transition>
    <div class="footer">
      <n-button text tag="a" href="https://beian.miit.gov.cn/" target="_blank">
        京ICP备19012558号-2
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoginContent from './LoginContent.vue';
import RegisterContent from './RegisterContent.vue';

const showLogin = ref<boolean>(true);

function change() {
  showLogin.value = !showLogin.value;
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  background-color: #18a058;
  position: relative;
  .login-bg {
    width: 100%;
    height: 100vh;
    background: #3e3e3e;
    opacity: 0.7;
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
