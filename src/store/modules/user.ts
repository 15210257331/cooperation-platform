import { defineStore } from 'pinia';

export interface UserInfoType {
  id: number | null;
  username: string;
  nickname: string;
  phone: number | null;
  avatar: string;
  role: string;
  intro: string;
}

export interface UserType {
  userInfo: UserInfoType;
  unReadCount: number;
}

function initUserInfo(): UserInfoType {
  return {
    id: null,
    username: '',
    nickname: '',
    phone: null,
    avatar: '',
    role: '',
    intro: ''
  };
}

export const useUserStore = defineStore('user', {
  state: (): UserType => {
    return {
      userInfo: initUserInfo(),
      unReadCount: 0
    };
  },
  actions: {
    setUserInfo(userInfo: UserInfoType) {
      this.userInfo = userInfo;
    },
    clearUserInfo() {
      this.userInfo = initUserInfo();
    }
  },
  getters: {
    nickname: state => state.userInfo.nickname
  }
});
