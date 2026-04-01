import request from '@/api/request'

/**
 * 获取统计数据
 * @returns {Promise<Object>} 统计数据对象
 */
export function getStatistics() {
  return request({
    url: '/dashboard/stats',
    method: 'get'
  })
}

/**
 * 获取月度借阅趋势数据
 * @returns {Promise<Array>} 月度趋势数据数组
 */
export function getMonthlyTrend() {
  return request({
    url: '/dashboard/monthly-trend',
    method: 'get'
  })
}