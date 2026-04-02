import request from './request'


export function getStatistics() {
  return request({
    // 修改为实际后端地址
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
    // 修改为实际后端地址
    url: '/dashboard/monthly-trend',
    method: 'get'
  })
}

/**
 * 获取图书分类统计数据
 * @returns {Promise<Array>} 图书分类数据数组
 */
export function getBookCategoryStats() {
  return request({
    // 修改为实际后端地址
    url: '/dashboard/book-category-stats',
    method: 'get'
  })
}