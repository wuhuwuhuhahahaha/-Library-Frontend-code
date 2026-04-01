import request from './request'

// 获取借阅列表（分页 + 条件查询）
export function getBorrowList(params) {
  return request({
    url: '/borrow',
    method: 'get',
    params
  })
}

// 按用户名查询借阅记录
export function getBorrowByUsername(username) {
  return request({
    url: `/borrow/user/${username}`,
    method: 'get'
  })
}

// 按书名查询借阅记录
export function getBorrowByBookName(bookName) {
  return request({
    url: `/borrow/book/${bookName}`,
    method: 'get'
  })
}

// 删除借阅记录
export function deleteBorrow(id) {
  return request({
    url: `/borrow/${id}`,
    method: 'delete'
  })
}

// 借书
export function borrowBook(data) {
  return request({
    url: '/borrow',
    method: 'post',
    data
  })
}

// 还书
export function returnBook(params) {
  return request({
    url: '/borrow/return',
    method: 'put',
    params
  })
}