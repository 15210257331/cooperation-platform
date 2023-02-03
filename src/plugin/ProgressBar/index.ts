// 待办  未完成
import type { App, VNode } from 'vue'
import { createVNode, render } from 'vue'
import ProgressBar from './index.vue'
export default {
  install(app: App) {
    const vnode: VNode = createVNode(ProgressBar)
    render(vnode, document.body)
    app.config.globalProperties.$loading = {
      show: vnode.component?.exposed?.show,
      hide: vnode.component?.exposed?.hide
    }
  }
}
