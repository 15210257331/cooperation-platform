import type { ProxyOptions } from 'vite';

/** 请求环境配置 */
type ServiceEnv = Record<any, any>;

/** 环境配置 */
const serviceProxyConfig: ServiceEnv = {
  dev: {
    url: 'http://localhost:8080',
    proxy: '/api'
  },
  test: {
    url: 'http://localhost:8080',
    proxy: '/api'
  },
  prod: {
    url: 'http://localhost:8080',
    proxy: '/api'
  }
};

/**
 * 获取代理配置
 * @param env 环境描述
 */
export function getProxyConfig(env: any) {
  const { VITE_ENV_TYPE = 'dev' } = env;

  const proxyConfig = serviceProxyConfig[VITE_ENV_TYPE];

  return proxyConfig;
}


/**
 * 设置网络代理
 * @param isOpenProxy - 是否开启代理
 * @param envConfig - env环境配置
 */
export function createViteProxy(isOpenProxy: boolean, envConfig: any) {
  if (!isOpenProxy) return undefined;

  const proxy: Record<string, string | ProxyOptions> = {
    [envConfig.proxy]: {
      target: envConfig.url,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${envConfig.proxy}`), '')
    }
  };

  return proxy;
}
