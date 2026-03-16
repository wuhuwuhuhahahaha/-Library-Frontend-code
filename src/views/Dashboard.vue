<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard! You are successfully logged in.</p>
    <el-button @click="logout" type="danger">Logout</el-button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()
    
    const logout = () => {
      // 这里应该执行登出操作
      console.log('Logging out...')
      router.push('/') // 登出后返回首页
    }
    
    return {
      logout
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}
</style>