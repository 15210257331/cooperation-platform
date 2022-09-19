import { axiosRequest, ResType } from './http'

export function getProjectList(): Promise<ResType> {
  return axiosRequest.get(`/api/project/list`)
}

export function createProject(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/project/create`, data)
}

export function updateProject(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/project/update`, data)
}

export function deleteProject(id: number): Promise<ResType> {
  return axiosRequest.get(`/api/project/delete/${id}`)
}
