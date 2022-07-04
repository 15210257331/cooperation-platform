import type { AxiosRequestConfig, AxiosInstance, AxiosError } from 'axios';
import axios from 'axios';

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

export interface ParamsType {
  [key: string]: any;
}

export interface ResType {
  code: number;
  data: any;
  message: string;
}

export default class AxiosRequest {
  instance: AxiosInstance;

  constructor(axiosConfig: AxiosRequestConfig) {
    this.instance = axios.create(axiosConfig);
    this.setInterceptor();
  }

  /**
   * 设置请求和相应拦截器
   */
  setInterceptor(): void {
    this.instance.interceptors.request.use(
      async (config): Promise<AxiosRequestConfig> => {
        if (config.headers) {
          // 数据转换
          const contentType = config.headers['Content-Type'] as string;
          config.data = await transformRequestData(config.data, contentType);

          // 设置token
          config.headers.Authorization = getToken();
        }
        return config;
      },
      (axiosError: AxiosError) => {
        return axiosError;
      }
    );
    this.instance.interceptors.response.use(
      async response => {
        const { status } = response;
        // if (status === 200 || status < 300 || status === 304) {
        //   const backend = response.data;
        //   const { codeKey, dataKey, successCode } = this.backendConfig;
        //   // 请求成功
        //   if (backend[codeKey] === successCode) {
        //     return handleServiceResult(null, backend[dataKey]);
        //   }

        //   // token失效, 刷新token
        //   if (REFRESH_TOKEN_CODE.includes(backend[codeKey])) {
        //     const config = await handleRefreshToken(response.config);
        //     if (config) {
        //       return this.instance.request(config);
        //     }
        //   }

        //   const error = handleBackendError(backend, this.backendConfig);
        //   return handleServiceResult(error, null);
        // }
        return response;
      },
      (axiosError: AxiosError) => {
        return axiosError;
      }
    );
  }

  get(url: string, params?: ParamsType): Promise<ResType> {
    return new Promise((resolve, reject) => {
      this.instance
        .get(url, { params })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err.data);
        });
    });
  }

  post(url: string, data: any): Promise<ResType> {
    return new Promise((resolve, reject) => {
      this.instance
        .post(url, data)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export function getToken() {
  const token = localStorage.getItem('token');
  return `Bearer ${token}`;
}

export function transformRequestData(data: any, contentType: any) {
  return data;
}
