import { createRouter, createWebHistory, RouteRecordRaw, RouterView } from 'vue-router'
import { Grid, Layers, PersonSharp, Settings, Aperture, LayersSharp, Scale, TrashBin } from '@vicons/ionicons5'

import { createVNode, render } from 'vue'
/** 挂载注册loadingBar组件 */
import LoadingBarVue from '../views/components/TestDemo/LoadingBar.vue'
/** 将组件转换成虚拟DOM */
const Vnode = createVNode(LoadingBarVue)
/** 将虚拟DOM挂载到真实DOM元素上 */
render(Vnode, document.body)

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/layout/login/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/redirect',
    name: 'redirect',
    component: () => import('@/layout/redirect/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/layout/404/index.vue') // 注意这里要带上 文件后缀.vue
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/layout/home/index.vue'),
    redirect: '/project',
    beforeEnter: (to, from) => {
      const token = localStorage.getItem('token')
      if (!token) {
        return {
          path: '/login'
        }
      }
    },
    children: [
      {
        path: '/project',
        name: 'project',
        meta: {
          title: '项目概览'
        },
        component: () => import('@/views/project/index.vue')
      },
      {
        path: '/task',
        name: 'task',
        meta: {
          title: '任务看板'
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
      }
    ]
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/layout/admin/index.vue'),
    redirect: '/admin/user',
    beforeEnter: (to, from) => {
      // console.log(to);
      const token = localStorage.getItem('token')
      if (!token) {
        return {
          path: '/login'
        }
      }
    },
    children: [
      {
        path: 'user',
        name: 'user',
        meta: {
          title: '用户管理',
          icon: PersonSharp
        },
        component: () => import('@/views/user/index.vue')
      },
      {
        path: 'components',
        name: 'components',
        meta: {
          title: '组件示例',
          icon: Aperture,
          type: 'M'
        },
        component: RouterView,
        children: [
          {
            path: 'icon',
            name: 'icon',
            meta: {
              title: '图标组件',
              icon: PersonSharp
            },
            component: () => import('@/views/components/Icons/index.vue')
          },
          {
            path: 'echarts',
            name: 'echarts',
            meta: {
              title: 'echarts使用',
              icon: LayersSharp
            },
            component: () => import('@/views/components/Echarts/index.vue')
          },
          {
            path: 'test',
            name: 'test',
            meta: {
              title: 'testDemo',
              icon: Scale
            },
            component: () => import('@/views/components/TestDemo/index.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由前置拦截器用于户权限判断
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
