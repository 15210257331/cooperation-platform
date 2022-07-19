import { createRouter, createWebHistory, RouteRecordRaw, RouterView } from 'vue-router';
import { Grid, CalendarNumber, Layers, PersonSharp, Settings, TrashBin, Aperture } from '@vicons/ionicons5';

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/login/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    meta: {
      title: '主页'
    },
    beforeEnter: (to, from) => {
      // console.log(to);
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          path: '/login'
        };
      }
    },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '概览',
          icon: Grid
        },
        component: () => import('@/views/dashboard/index.vue')
      },
      {
        path: '/task',
        name: 'task',
        meta: {
          title: '任务',
          icon: Layers
        },
        component: () => import('@/views/task/index.vue')
      },
      {
        path: '/trash',
        name: 'trash',
        meta: {
          title: '回收站',
          icon: TrashBin
        },
        component: () => import('@/views/trash/index.vue')
      },
      {
        path: '/components',
        name: 'components',
        meta: {
          title: '组件示例',
          icon: Aperture
        },
        component: () => import('@/views/components/index.vue')
      },
      {
        path: '/setting',
        name: 'setting',
        meta: {
          title: '系统管理',
          icon: Settings,
          type: 'M'
        },
        component: RouterView,
        children: [
          {
            path: '/setting/user',
            name: 'user',
            meta: {
              title: '用户管理',
              icon: PersonSharp
            },
            component: () => import('@/views/system/user/index.vue')
          },
          {
            path: '/setting/role',
            name: 'role',
            meta: {
              title: '角色管理',
              icon: PersonSharp
            },
            component: () => import('@/views/system/role/index.vue')
          }
        ]
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由拦截器用于户权限判断
router.beforeEach((to, from) => {
  // 根据路由修改网站标题
  if (to.meta && to.meta.title) {
    document.title = to.meta.title as string;
  }
  // 未匹配到路由 比如浏览器输入路由表中不存在的路由
  if (to.matched.length === 0) {
    return {
      name: '404'
    };
  }
  return true;
});

export default router;
