import { axiosRequest } from '../request';
import { ResType } from '../request/request';

export function getFlowList(keywords = ''): Promise<ResType> {
  return axiosRequest.get(`/api/flow/list?keywords=${keywords}`);
}
export function getAllFlows(): Promise<ResType> {
  return axiosRequest.get(`/api/flow/all`);
}
export function addFlow(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/flow/add`, data);
}
export function updateFlow(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/flow/update`, data);
}
export function deleteFlow(id: number): Promise<ResType> {
  return axiosRequest.get(`/api/flow/delete/${id}`);
}
export function getGroupList(name = ''): Promise<ResType> {
  return axiosRequest.get(`/api/group/list?name=${name}`);
}
export function addGroup(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/group/add`, data);
}
export function updateGroup(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/group/update`, data);
}
export function deleteGroup(id: number): Promise<ResType> {
  return axiosRequest.get(`/api/group/delete/${id}`);
}
// 任务
export function getTaskList(groupId: number): Promise<ResType> {
  return axiosRequest.get(`/api/task/list?groupId=${groupId}`);
}
export function addTask(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/add`, data);
}
export function updateProps(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/updateProps`, data);
}
export function taskDetail(taskId: any): Promise<ResType> {
  return axiosRequest.get(`/api/task/detail?taskId=${taskId}`);
}
export function deleteTask(id: any): Promise<ResType> {
  return axiosRequest.get(`/api/task/delete/${id}`);
}

// 添加子任务
export function addChildTask(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/addChildTask`, data);
}
// 完成子任务
export function completeSubItem(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/task/completeSub`, data);
}
// 删除子任务
export function deleteChildTask(id: any): Promise<ResType> {
  return axiosRequest.get(`/api/task/deleteChildTask/${id}`);
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
