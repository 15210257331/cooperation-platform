import { Component, h } from 'vue'
import { NIcon } from 'naive-ui'

/** 渲染函数hook */
export function useRender() {
  /** 渲染图标 */
  function renderIcon(icon: Component) {
    return () => {
      return h(NIcon, null, {
        default: () => h(icon)
      })
    }
  }

  return {
    renderIcon
  }
}
