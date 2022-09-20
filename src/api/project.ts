import { axiosRequest, ResType } from './http'

/** 项目 */
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

/** 分组 */
export function getFlowList(projectId: number, name: string): Promise<ResType> {
  return axiosRequest.get(`/api/flow/list?name=${name}&projectId=${projectId}`)
}
export function getAllFlows(): Promise<ResType> {
  return axiosRequest.get(`/api/flow/all`)
}
export function createFlow(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/flow/create`, data)
}
export function updateFlow(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/flow/update`, data)
}
export function deleteFlow(id: number): Promise<ResType> {
  return axiosRequest.get(`/api/flow/delete/${id}`)
}

// 任务
export function getTaskList(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/list`, data)
}
export function createTask(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/create`, data)
}
export function updateTaskProps(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/updateProps`, data)
}
/**
 * 任务详情
 * @param taskId
 * @returns
 */
export function taskDetail(taskId: number): Promise<ResType> {
  return axiosRequest.get(`/api/task/detail?taskId=${taskId}`)
}
/** 删除任务 */
export function deleteTask(id: any): Promise<ResType> {
  return axiosRequest.get(`/api/task/delete/${id}`)
}
