import { axiosRequest, ResType } from './http';

// flow
export function getFlowList(name: string): Promise<ResType> {
  return axiosRequest.get(`/api/flow/list?name=${name}`);
}
export function getAllFlows(): Promise<ResType> {
  return axiosRequest.get(`/api/flow/all`);
}
export function createFlow(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/flow/create`, data);
}
export function updateFlow(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/flow/update`, data);
}
export function deleteFlow(id: number): Promise<ResType> {
  return axiosRequest.get(`/api/flow/delete/${id}`);
}

// 任务
export function getTaskList(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/list`, data);
}
export function createTask(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/create`, data);
}
export function updateTaskProps(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/updateProps`, data);
}
/**
 * 任务详情
 * @param taskId
 * @returns
 */
export function taskDetail(taskId: number): Promise<ResType> {
  return axiosRequest.get(`/api/task/detail?taskId=${taskId}`);
}
/** 删除任务 */
export function deleteTask(id: any): Promise<ResType> {
  return axiosRequest.get(`/api/task/delete/${id}`);
}

// 添加图片
export function addPicture(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/addPicture`, data);
}
// 删除图片
export function deletePicture(id: any): Promise<ResType> {
  return axiosRequest.get(`/api/task/deletePicture/${id}`);
}

// 关联笔记
export function linkNote(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/linkNote`, data);
}
// 删除笔记
export function deleteNote(id: any): Promise<ResType> {
  return axiosRequest.get(`/api/task/deleteNote/${id}`);
}
