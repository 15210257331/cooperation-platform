import { axiosRequest, ResType } from './http'

export function getProjectList(): Promise<ResType> {
  return axiosRequest.get(`/api/project/list`)
}

export function createProject(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/project/create`, data)
}
