// 对于拓展的全局属性进行ts支持
// 非全局声明 拓展vue模块属性
import axios from 'axios'
declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $title: string
    $loading: any
  }
}
