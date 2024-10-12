import { axiosRequest, ResType } from './request'

/** 上传文件接口 */
export function uploadFile(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/file/upload`, data)
}
