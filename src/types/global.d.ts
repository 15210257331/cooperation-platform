// 放在这和放在env.d.ts中是一样的 都是声明全局类型
// 不能有顶层的import和export 要不然呢就不是全局的了就是模块了
interface Window {
  $loadingBar?: import('naive-ui').LoadingBarProviderInst;
  $dialog?: import('naive-ui').DialogProviderInst;
  $message?: import('naive-ui').MessageProviderInst;
  $notification?: import('naive-ui').NotificationProviderInst;
}

declare module 'vue-particles';

declare const PROJECT_BUILD_TIME: string

declare module 'gsap'

declare type Demo = string | boolean | number 