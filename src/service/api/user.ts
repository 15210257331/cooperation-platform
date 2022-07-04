import { axiosRequest } from '../request';
import { ResType } from '../request/request';

export function login(data: any): Promise<ResType> {
  return axiosRequest.post('/api/user/login', data);
}

export function getUserInfo() {
  return axiosRequest.get(`/api/user/info`);
}

// 用户排行top5
export function userRank(type: string): Promise<ResType> {
  return axiosRequest.get(`/api/statistics/userRank?type=${type}`);
}

// 任务完成趋势
export function taskTrend(type: string): Promise<ResType> {
  return axiosRequest.get(`/api/statistics/taskTrend?type=${type}`);
}

// 用户列表
export function userList(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/user/list`, data);
}
