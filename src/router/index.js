import { createRouter, createWebHistory } from 'vue-router'
import AuthPage from '@/views/AuthPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Auth',
      component: AuthPage
    },
    {
      path: '/login',
      name: 'Login',
      component: AuthPage
    },
    {
      path: '/register',
      name: 'Register',
      component: AuthPage
    },
    // 可以在这里添加更多路由
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue') // 假设这是登录后的页面
    }
  ],
})

export default router