import { axiosRequest, ResType } from './request'

// 项目标签列表
export function getTagListAPI(projectId: string): Promise<ResType> {
  return axiosRequest.get(`/api/tag/list?projectId=${projectId}`)
}

// 创建标签
export function createTagAPI(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/tag/create`, data)
}
