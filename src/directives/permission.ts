import { useUserStore } from '@/store'
export const permissionDirective = {
  mounted(el, binding) {
    const requiredPermission = binding.value
    const userStore = useUserStore()
    // 获取用户绑定的角色
    const roles = userStore.roles || []
    const userPermissions = roles.reduce((pre, cur) => pre | cur.permission, 0)
    // 按位与操作检查用户是否具备所需权限
    if ((userPermissions & requiredPermission) !== requiredPermission) {
      // 如果没有权限，移除元素
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
