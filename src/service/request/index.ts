import AxiosRequest from './request';
import type { AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000
};

export const axiosRequest: AxiosRequest = new AxiosRequest(config);
