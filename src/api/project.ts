import { axiosRequest, ResType, ParamsType } from './request'

/** 项目 */
export function getProjectList(params: ParamsType): Promise<ResType> {
  return axiosRequest.get(`/api/project/list`, params)
}
export function getProjectDetail(id: string): Promise<ResType> {
  return axiosRequest.get(`/api/project/detail/${id}`)
}
export function createProject(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/project/create`, data)
}
export function updateProject(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/project/update`, data)
}
export function projectToggleStar(data: { id: string; star: boolean }): Promise<ResType> {
  return axiosRequest.post(`/api/project/star`, data)
}
export function deleteProject(id: string): Promise<ResType> {
  return axiosRequest.get(`/api/project/delete/${id}`)
}
// 查询项目成员
export function addProjectMembers(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/project/addMember`, data)
}

/** 分组 */
export function getFlowList(projectId: string, name: string): Promise<ResType> {
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
export function deleteFlow(id: string): Promise<ResType> {
  return axiosRequest.get(`/api/flow/delete/${id}`)
}

/**
 * 任务
 * @param
 * @returns
 */
export function getTaskList(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/list`, data)
}
export function createTask(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/create`, data)
}
export function updateTaskProps(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/updateProps`, data)
}
export function taskDetail(taskId: string): Promise<ResType> {
  return axiosRequest.get(`/api/task/detail?taskId=${taskId}`)
}
/** 删除任务 */
export function deleteTask(id: string): Promise<ResType> {
  return axiosRequest.get(`/api/task/delete/${id}`)
}
// 任务完成趋势
export function taskTrend(type: string): Promise<ResType> {
  return axiosRequest.get(`/api/task/trend?type=${type}`)
}

/**
 * 迭代
 */
export function getIterationListAPI(params: ParamsType): Promise<ResType> {
  return axiosRequest.get(`/api/iteration/list`, params)
}
export function createIterationAPI(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/iteration/create`, data)
}
export function updateIterationAPI(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/iteration/update`, data)
}
export function completeIterationAPI(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/iteration/complete`, data)
}
export function deleteIterationAPI(id: string): Promise<ResType> {
  return axiosRequest.get(`/api/iteration/delete/${id}`)
}