import { axiosRequest, ResType } from './request'

/** 获取消息通知列表 */
export function getNotificationList(queryParams: any): Promise<ResType> {
  return axiosRequest.get(`/api/notification/list`, queryParams)
}

/** 获取消息通知未读数量 */
export function getUnreadCount(): Promise<ResType> {
  return axiosRequest.get(`/api/notification/unreadCount`)
}

/** 消息通知标记已读 */
export function readNotification(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/notification/read`, data)
}
