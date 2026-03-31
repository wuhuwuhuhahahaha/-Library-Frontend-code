import request from './request'

/**
 * 获取用户列表
 * @param {string} keyword - 搜索关键词
 * @returns {Promise<Array>} 用户列表
 */
export function getUserList(keyword = '') {
  return request({
    url: '/users',
    method: 'get',
    params: keyword ? { keyword } : {}
  })
}

/**
 * 更新用户信息
 * @param {Object} data - 用户数据
 * @param {number} data.id - 用户ID
 * @param {string} data.username - 用户名
 * @param {string} [data.password] - 密码（可选）
 * @returns {Promise<void>}
 */
export function updateUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

/**
 * 删除用户
 * @param {number} id - 用户ID
 * @returns {Promise<void>}
 */
export function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}