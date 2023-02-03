// 对于拓展的全局属性进行ts支持
// 有顶层的import或export非全局声明 是模块生命表示对vue模块进行扩展
import axios from 'axios'
declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $title: string
    $loading: any
  }
}
