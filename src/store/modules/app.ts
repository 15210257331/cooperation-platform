import { defineStore } from 'pinia';
import { darkTheme } from 'naive-ui';
import { themes } from '@/constant';

interface AppState {
  /** 应用主题是否为暗色主题 */
  darkTheme: boolean;
  /** 侧边栏折叠状态 */
  siderCollapse: boolean;
  /** 应用的自定义主题 */
  theme: string;
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkTheme: false,
    siderCollapse: false,
    theme: themes[0].name
  }),
  actions: {
    toggleTheme() {
      this.darkTheme = !this.darkTheme;
    },
    toggleCollapse() {
      this.siderCollapse = !this.siderCollapse;
    },
    /** 设置主题 */
    setTheme(theme: string) {
      this.theme = theme || themes[0].name;
      let html = document.getElementsByTagName('html').item(0);
      html?.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }
});
