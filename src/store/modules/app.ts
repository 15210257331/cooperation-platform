import { defineStore } from 'pinia';
import { darkTheme } from 'naive-ui';

interface AppState {
  /** 应用主题是否为暗色主题 */
  darkTheme: boolean;
  /** 侧边栏折叠状态 */
  siderCollapse: boolean;
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkTheme: false,
    siderCollapse: false
  }),
  actions: {
    toggleTheme() {
      this.darkTheme = !this.darkTheme;
    },
    toggleCollapse() {
      this.siderCollapse = !this.siderCollapse;
    }
  }
});
