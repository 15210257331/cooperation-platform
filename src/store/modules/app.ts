import { defineStore } from 'pinia'
import { darkTheme } from 'naive-ui'
import { themes } from '@/config'

interface AppState {
  /** 应用主题是否为暗色主题 */
  darkTheme: boolean
  /** 侧边栏折叠状态 */
  sideCollapse: boolean
  /** 应用的自定义主题 */
  theme: string
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkTheme: false,
    sideCollapse: false,
    theme: themes[0].name
  }),
  actions: {
    toggleTheme() {
      this.darkTheme = !this.darkTheme
    },
    toggleCollapse() {
      this.sideCollapse = !this.sideCollapse
    },
    /** 设置主题 */
    setTheme(theme: string) {
      this.theme = theme || themes[0].name
      const html = document.getElementsByTagName('html').item(0)
      html?.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    }
  }
})
