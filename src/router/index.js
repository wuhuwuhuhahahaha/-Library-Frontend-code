import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from '@/views/AuthPage.vue'
import Dashboard from '@/views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Auth',
      component: AuthPage,
      meta: { title: '认证' }
    },
    {
      path: '/login',
      name: 'Login',
      component: AuthPage,
      meta: { title: '登录' }
    },
    {
      path: '/register',
      name: 'Register',
      component: AuthPage,
      meta: { title: '注册' }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { title: '仪表板' },
      children: [
        {
          path: 'users',
          name: 'UserManagement',
          component: () => import('@/views/UserManagement.vue'),
          meta: { title: '用户管理' }
        },
        {
          path: 'borrow',
          name: 'BorrowManagement',
          component: () => import('@/views/BorrowManagement.vue'),
          meta: { title: '借阅管理' }
        },
        {
          path: 'book',
          name: 'BookManagement',
          component: () => import('@/views/BookManagement.vue'),
          meta: { title: '图书管理' }
        }
      ]
    }
  ]
})

// 路由守卫 - 检查认证状态
router.beforeEach((to, from) => {
  const token = sessionStorage.getItem('token')
  const authRoutes = ['/', '/login', '/register']
  
  // 如果是非认证页面且没有token，跳转到登录页
  if (!authRoutes.includes(to.path) && !token) {
    return '/login' // 返回路径字符串
  } else {
    return true // 返回 true 表示允许继续导航
  }
})

export default router