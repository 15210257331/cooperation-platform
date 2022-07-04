import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/login/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/',
    redirect: '/dashboard',
    name: 'home',
    meta: {
      title: '主页'
    },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '概览'
        },
        component: () => import('@/views/dashboard/index.vue')
      },
      {
        path: '/task',
        name: 'task',
        meta: {
          title: '任务'
        },
        component: () => import('@/views/task/index.vue')
      },
      {
        path: '/schedule',
        name: 'schedule',
        meta: {
          title: '日程'
        },
        component: () => import('@/views/schedule/index.vue')
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          title: '用户管理'
        },
        component: () => import('@/views/system/user/index.vue')
      },
      {
        path: '/role',
        name: 'role',
        meta: {
          title: '角色管理'
        },
        component: () => import('@/views/system/role/index.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
