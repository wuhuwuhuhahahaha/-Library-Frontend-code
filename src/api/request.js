import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 处理非JSON响应（如HTML登录页）
    if (typeof response.data === 'string' && response.data.includes('<html>')) {
      sessionStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(new Error('未授权访问'))
    }
    
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      // 401状态码处理
      if (res.code === 401) {
        sessionStorage.removeItem('token')
        window.location.href = '/login'
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }
    
    // 统一从response.data.data提取业务数据
    return res.data
  },
  error => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('token')
      window.location.href = '/login'
    }
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request