import { getNotificationList, getUnreadCount, readNotification } from '@/api'
import { defineStore } from 'pinia'

export interface UserInfoType {
  id: number | null;
  username: string;
  nickname: string;
  phone: any;
  avatar: string;
  role: number;
  intro: string;
}

export interface NotificationType {
  [key: string]: any;
}

export interface UserType {
  userInfo: UserInfoType;
  unReadCount: number;
  notificationList: Array<NotificationType>;
}

function initUserInfo(): UserInfoType {
  return {
    id: null,
    username: '',
    nickname: '',
    phone: null,
    avatar: '',
    role: 0,
    intro: ''
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserType => {
    return {
      userInfo: initUserInfo(),
      unReadCount: 0,
      notificationList: []
    }
  },
  actions: {
    queryNotificationList(queryParams: any) {
      getNotificationList(queryParams).then(res => {
        if (res.code === 10000) {
          this.notificationList = res.data.list || []
        }
      })
    },
    queryUnreadCount() {
      getUnreadCount().then(res => {
        if (res.code === 10000) {
          this.unReadCount = res.data || 0
        }
      })
    },
    readNotification(data: any) {
      readNotification(data).then(res => {
        if (res.code === 10000) {
          if (this.unReadCount > 0) {
            this.unReadCount -= 1
            this.notificationList.map(item => {
              if (item.id === data.id) {
                item.read = 1
              }
            })
          }
        }
      })
    },
    setUserInfo(userInfo: UserInfoType) {
      this.userInfo = userInfo
    },
    clearUserInfo() {
      this.userInfo = initUserInfo()
    }
  },
  getters: {
    nickname: state => state.userInfo.nickname
  }
})
