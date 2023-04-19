import { createApp, createVNode, render } from 'vue'
import App from './App.vue'
import './style/css/global.css'
import './style/css/theme.css'
//引入svg 雪碧图注册脚本 配合vite-plugin-svg-icons插件使用
import 'virtual:svg-icons-register'

import * as Sentry from '@sentry/vue'

const app = createApp(App)
// 添加全局属性
app.config.globalProperties.$title = '管理系统'

/** 自定义插件 存在一个问题 render() 函数在document.body上挂载了一个VNode 再次调用的时候不生效了 */
import Loading from '@/plugin/Loading'
// app.use(Loading)

Sentry.init({
  app,
  dsn: 'https://92c30ddc7cee4c9681af11cec7be303c@o4504970543300608.ingest.sentry.io/4504970548936704',
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: ['localhost', 'my-site-url.com', /^\//]
    })
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

/** 路由 */
import router from './router'
app.use(router)

import { createPinia } from 'pinia'
app.use(createPinia())

app.mount('#app')
