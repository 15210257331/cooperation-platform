// hooks/usePermissionCheck.ts
import { useUserStore } from '@/store'

export function usePermission() {
  const userStore = useUserStore()
  /**
   * 检查用户是否具有所需权限
   * @param requiredPermission 所需的权限
   * @returns boolean 用户是否有权限
   */
  const hasPermission = (requiredPermission: number | undefined): boolean => {
    // 如果没有传入权限编码 则表示该元素没有进行权限控制 返回true
    if (!requiredPermission) {
      return true
    }
    // 获取用户绑定的角色
    const userPermissions = (userStore.roles || []).reduce((pre, cur) => pre | cur.permission, 0)
    // 按位与操作检查用户是否具备所需权限
    return (userPermissions & requiredPermission) === requiredPermission
  }
  return {
    hasPermission // 暴露检查权限的函数
  }
}
