import { createApp } from 'vue';
import App from './App.vue';
import './style/css/global.css';
const app = createApp(App);

import router from './router';
app.use(router);

import { createPinia } from 'pinia';
app.use(createPinia());

app.mount('#app');
