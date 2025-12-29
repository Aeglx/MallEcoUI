// RBAC 权限管理相关 API
// 注意：rbac 控制器不在 manager 模块下，路径是 /api/rbac/*
import { getApiRequest, postApiRequest, putApiRequest, patchApiRequest, deleteApiRequest } from '@/libs/axios'

// ========== 角色管理 ==========
// 获取角色列表
export const getRoleList = (params?: any) => {
  return getApiRequest('/rbac/roles', params)
}

// 获取角色详情
export const getRoleDetail = (id: string) => {
  return getApiRequest(`/rbac/roles/${id}`)
}

// 新增角色
export const addRole = (params: any) => {
  return postApiRequest('/rbac/roles', params)
}

// 更新角色
export const updateRole = (id: string, params: any) => {
  return patchApiRequest(`/rbac/roles/${id}`, params)
}

// 删除角色
export const deleteRole = (id: string) => {
  return deleteApiRequest(`/rbac/roles/${id}`)
}

// 为角色分配权限
export const assignRolePermissions = (id: string, permissionIds: number[]) => {
  return postApiRequest(`/rbac/roles/${id}/permissions`, { permissionIds })
}

// 获取角色权限列表
export const getRolePermissions = (id: string) => {
  return getApiRequest(`/rbac/roles/${id}/permissions`)
}

// 获取角色下的用户列表
export const getRoleUsers = (id: string, params?: any) => {
  return getApiRequest(`/rbac/roles/${id}/users`, params)
}

// ========== 用户管理 ==========
// 获取用户列表
export const getUserList = (params?: any) => {
  return getApiRequest('/rbac/users', params)
}

// 获取用户详情
export const getUserDetail = (id: string) => {
  return getApiRequest(`/rbac/users/${id}`)
}

// 新增用户
export const addUser = (params: any) => {
  return postApiRequest('/rbac/users', params)
}

// 更新用户
export const updateUser = (id: string, params: any) => {
  return patchApiRequest(`/rbac/users/${id}`, params)
}

// 删除用户
export const deleteUser = (id: string) => {
  return deleteApiRequest(`/rbac/users/${id}`)
}

// 为用户分配角色
export const assignUserRoles = (id: string, roleIds: number[]) => {
  return postApiRequest(`/rbac/users/${id}/roles`, roleIds)
}

// 获取用户角色列表
export const getUserRoles = (id: string) => {
  return getApiRequest(`/rbac/users/${id}/roles`)
}

// 获取用户权限列表
export const getUserPermissions = (id: string) => {
  return getApiRequest(`/rbac/users/${id}/permissions`)
}

// ========== 菜单管理 ==========
// 获取菜单树
export const getMenuTree = (params?: any) => {
  return getApiRequest('/rbac/menus', params)
}

// 获取菜单详情
export const getMenuDetail = (id: string) => {
  return getApiRequest(`/rbac/menus/${id}`)
}

// 新增菜单
export const addMenu = (params: any) => {
  return postApiRequest('/rbac/menus', params)
}

// 更新菜单
export const updateMenu = (id: string, params: any) => {
  return patchApiRequest(`/rbac/menus/${id}`, params)
}

// 删除菜单
export const deleteMenu = (id: string) => {
  return deleteApiRequest(`/rbac/menus/${id}`)
}

// ========== 部门管理 ==========
// 获取部门树
export const getDepartmentTree = (params?: any) => {
  return getApiRequest('/rbac/departments', params)
}

// 获取部门详情
export const getDepartmentDetail = (id: string) => {
  return getApiRequest(`/rbac/departments/${id}`)
}

// 新增部门
export const addDepartment = (params: any) => {
  return postApiRequest('/rbac/departments', params)
}

// 更新部门
export const updateDepartment = (id: string, params: any) => {
  return patchApiRequest(`/rbac/departments/${id}`, params)
}

// 删除部门
export const deleteDepartment = (id: string) => {
  return deleteApiRequest(`/rbac/departments/${id}`)
}

// ========== 权限管理 ==========
// 获取权限列表
export const getPermissionList = (params?: any) => {
  return getApiRequest('/rbac/permissions', params)
}

// 获取权限详情
export const getPermissionDetail = (id: string) => {
  return getApiRequest(`/rbac/permissions/${id}`)
}

// 新增权限
export const addPermission = (params: any) => {
  return postApiRequest('/rbac/permissions', params)
}

// 更新权限
export const updatePermission = (id: string, params: any) => {
  return patchApiRequest(`/rbac/permissions/${id}`, params)
}

// 删除权限
export const deletePermission = (id: string) => {
  return deleteApiRequest(`/rbac/permissions/${id}`)
}

