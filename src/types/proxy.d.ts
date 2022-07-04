interface EnvConfig {
    /** 后端的请求地址 */
    url: string;
    /** 代理标识, 用于拦截地址转发代理(如："/api"，这个和后端路径有无 "/api" 路径没有任何关系) */
    proxy: string;
  }