import { createApp } from 'vue'
import App from './App.vue'
import './style/css/global.css'
import './style/css/theme.css'
//引入svg 雪碧图注册脚本 配合vite-plugin-svg-icons插件使用
import 'virtual:svg-icons-register'

const app = createApp(App)
// 添加全局属性
app.config.globalProperties.$title = '管理系统'

import router from './router'
app.use(router)

import { createPinia } from 'pinia'
app.use(createPinia())

app.mount('#app')
