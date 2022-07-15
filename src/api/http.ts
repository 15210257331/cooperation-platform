import type { AxiosRequestConfig, AxiosInstance, AxiosError, AxiosResponse } from 'axios';
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
      async (response: AxiosResponse) => {
        const { status, data } = response;
        // console.log(response);
        const responseCode = data.code;
        if (responseCode !== 10000) {
          showErrorNotification('', data.message);
        }
        return response;
      },
      // 当http的状态码不是200时触发
      (axiosError: AxiosError) => {
        console.log(axiosError);
        if (axiosError.response && axiosError.response.data) {
          const statusCode = axiosError.response.status;
          const description = axiosError.message;
          const content = (axiosError.response.data as any)['message']
            ? (axiosError.response.data as any)['message']
            : axiosError.message;
          // 401 token验证失败 跳转到登录页面
          if (statusCode === 401) {
            window.location.href = '/login';
            // 其它错误
          } else {
            showErrorNotification(description, content);
          }
        }
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
    console.log(url);
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

export function showErrorNotification(description: string, content: any) {
  window.$notification?.error({
    title: '请求错误',
    description: description,
    content: content,
    duration: 2500
  });
}

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000
};
console.log(import.meta.env);
export const axiosRequest: AxiosRequest = new AxiosRequest(config);
