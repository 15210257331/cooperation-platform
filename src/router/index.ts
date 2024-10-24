import { createRouter, createWebHistory, RouteRecordRaw, RouterView } from 'vue-router'
import { Grid, Layers, PersonSharp, Settings, Aperture, LayersSharp, PeopleSharp, AppsSharp } from '@vicons/ionicons5'
import { createVNode, render, markRaw } from 'vue'
import { useUserStore } from '@/store'
import { usePermission } from '@/hooks'
/** 挂载注册ProgressBar组件 */
import ProgressBar from '../components/ProgressBar.vue'
/** 将组件转换成虚拟DOM */
const Vnode = createVNode(ProgressBar)
/** 将虚拟DOM挂载到真实DOM元素上 */
render(Vnode, document.body)

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/redirect',
    name: 'redirect',
    component: () => import('@/views/redirect/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    beforeEnter: async (to, from) => {
      const userStore = useUserStore()
      const { hasPermission } = usePermission()
      const token = localStorage.getItem('token')
      const res = await userStore.queryUserInfo()
      if (!token || !res) {
        return {
          path: '/login'
        }
      }
      if (to.meta.permission && !hasPermission(to.meta.permission as number)) {
        return {
          path: '/403'
        }
      }
      return true
    },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
          title: '概览',
          icon: markRaw(Layers),
          permission: 1
        },
        component: () => import('@/views/dashboard/index.vue')
      },
      {
        path: '/project/:id',
        name: 'project',
        meta: {
          title: '所有项目',
          icon: markRaw(AppsSharp),
          permission: 16
        },
        component: () => import('@/views/project/index.vue')
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          title: '用户管理',
          icon: markRaw(PersonSharp),
          permission: 256
        },
        component: () => import('@/views/user/index.vue')
      },
      {
        path: '/setting',
        name: 'setting',
        meta: {
          title: '设置',
          icon: markRaw(Settings),
          permission: 8192
        },
        component: () => import('@/views/setting/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由前置拦截器
router.beforeEach((to, from) => {
  Vnode.component?.exposed?.startLoading()
  // 根据路由修改网站标题
  if (to.meta && to.meta.title) {
    document.title = to.meta.title as string
  }
  // 未匹配到路由 比如浏览器输入路由表中不存在的路由
  if (to.matched.length === 0) {
    return {
      name: '404'
    }
  }
  return true
})

router.afterEach((to, from) => {
  Vnode.component?.exposed?.endLoading()
})

export default router
