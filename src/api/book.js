import request from './request'

// 查询所有图书（分页）
export function getBooks(params) {
  return request({
    url: '/book',
    method: 'get',
    params
  })
}

// 查询图书详情
export function getBookById(id) {
  return request({
    url: `/book/${id}`,
    method: 'get'
  })
}

// 新增图书
export function addBook(data) {
  return request({
    url: '/book',
    method: 'post',
    data
  })
}

// 修改图书
export function updateBook(data) {
  return request({
    url: '/book',
    method: 'put',
    data
  })
}

// 删除图书
export function deleteBook(id) {
  return request({
    url: `/book/${id}`,
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