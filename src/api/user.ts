import { axiosRequest, ResType } from './request'

/** 登录 */
export function login(data: any): Promise<ResType> {
  return axiosRequest.post('/api/user/login', data)
}

/** github授权 */
export function githubAuthorize(): Promise<ResType> {
  return axiosRequest.get('/api/user/github/authorize')
}
/** github登录 */
export function githubLogin(data: any): Promise<ResType> {
  return axiosRequest.post('/api/user/github/login', data)
}


/** 微信登录 */
export function wechatLogin(data: any): Promise<ResType> {
  return axiosRequest.get('/api/user/login/wechat')
}
/** 注册 */
export function register(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/user/register`, data)
}
/** 查询用户信息 */
export function getUserInfo(): Promise<ResType> {
  return axiosRequest.get(`/api/user/info`)
}
/** 修改用户信息 */
export function updateUserInfo(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/user/update`, data)
}
// 发送验证码
export function sendCode(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/user/code`, data)
}

// 用户排行top5
export function userRank(type: string): Promise<ResType> {
  return axiosRequest.get(`/api/user/rank?type=${type}`)
}

// 用户列表
export function userList(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/user/list`, data)
}

/** 删除用户 */
export function deleteUser(id: number): Promise<ResType> {
  return axiosRequest.get(`/api/user/delete/${id}`)
}

/** 修改用户角色 */
export function updateUserRole(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/user/setRole`, data)
}

/** 退出登录 */
export function logout(data: any): Promise<ResType> {
  return axiosRequest.post(`/api/user/logout`, data)
}
