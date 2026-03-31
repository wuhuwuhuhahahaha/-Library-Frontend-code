<template>
  <div class="auth-container">
    <!-- 背景渐变层 -->
    <div class="background-image">
      <div class="overlay"></div>
    </div>
    
    <!-- 认证卡片容器，包含登录和注册两个部分 -->
    <div class="auth-card">
      <!-- 左侧登录切换区域，点击可切换到登录界面 -->
      <div class="left-section" :class="{ active: isLogin }" @click="switchToLogin">
        <h2>hello</h2>
      </div>
      
      <!-- 右侧表单区域 -->
      <div class="right-section">
        <div class="form-container">
          <!-- 根据当前模式显示不同的标题 -->
          <h2>{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h2>
          
          <!-- 登录表单，仅在isLogin为true时显示 -->
          <el-form 
            :model="loginForm" 
            :rules="loginRules" 
            ref="loginFormRef" 
            v-if="isLogin"
            class="auth-form"
          >
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="Username" 
                size="large"
                prefix-icon="User"
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input 
                v-model="loginForm.password" 
                type="password" 
                placeholder="Password" 
                size="large"
                prefix-icon="Lock"
              />
            </el-form-item>
            
            <el-button 
              type="primary" 
              size="large" 
              @click="handleLogin" 
              class="submit-btn"
              :loading="loading"
            >
              Sign In
            </el-button>
          </el-form>
          
          <!-- 注册表单，仅在isLogin为false时显示 -->
          <el-form 
            :model="registerForm" 
            :rules="registerRules" 
            ref="registerFormRef" 
            v-else
            class="auth-form"
          >
            <el-form-item prop="username">
              <el-input 
                v-model="registerForm.username" 
                placeholder="Username" 
                size="large"
                prefix-icon="User"
              />
            </el-form-item>
            
     
            <el-form-item prop="password">
              <el-input 
                v-model="registerForm.password" 
                type="password" 
                placeholder="Password" 
                size="large"
                prefix-icon="Lock"
              />
            </el-form-item>
            
            <el-button 
              type="primary" 
              size="large" 
              @click="handleRegister" 
              class="submit-btn"
              :loading="loading"
            >
              Sign Up
            </el-button>
          </el-form>
          
          <!-- 切换登录/注册模式的提示文本 -->
          <p class="toggle-text">
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
            <span @click="switchMode" class="toggle-link">
              {{ isLogin ? 'Sign Up' : 'Sign In' }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, register } from '@/api/auth'

export default {
  name: 'AuthPage',
  setup() {
    const router = useRouter()
    const isLogin = ref(true)
    const loading = ref(false)
    
    // 登录表单数据
    const loginForm = reactive({
      username: '',  // 用户名字段
      password: ''   // 密码字段
    })
    
    // 注册表单数据
    const registerForm = reactive({
      username: '',  // 用户名字段
      email: '',     // 邮箱字段
      password: ''   // 密码字段
    })
    
    // 登录表单验证规则
    const loginRules = {
      username: [
        { required: true, message: 'Please input username', trigger: 'blur' }
      ],
      password: [
        { required: true, message: 'Please input password', trigger: 'blur' },
        { min: 6, message: 'Password length should be at least 6 characters', trigger: 'blur' }
      ]
    }
    
    // 注册表单验证规则
    const registerRules = {
      username: [
        { required: true, message: 'Please input username', trigger: 'blur' }
      ],
    
      password: [
        { required: true, message: 'Please input password', trigger: 'blur' },
        { min: 6, message: 'Password length should be at least 6 characters', trigger: 'blur' }
      ]
    }
    
    // 表单引用，用于表单验证
    const loginFormRef = ref(null)     // 登录表单引用
    const registerFormRef = ref(null)  // 注册表单引用
    
    // 切换到登录模式
    const switchToLogin = () => {
      isLogin.value = true
    }
    
    // 切换登录/注册模式
    const switchMode = () => {
      isLogin.value = !isLogin.value
    }
    
    // 处理登录逻辑
    const handleLogin = async () => {
      if (!loginFormRef.value) return
      
      try {
        await loginFormRef.value.validate()
        loading.value = true
        
        // 调用实际的登录API
        const response = await login({
          username: loginForm.username,
          password: loginForm.password
        })
        
        // 存储token到sessionStorage（符合项目规范）
        sessionStorage.setItem('token', response.token)
        
        ElMessage.success('Login successful!')
        router.push('/dashboard/users') // 登录成功后跳转到用户管理页面
        
      } catch (error) {
        console.error('Login failed:', error)
        ElMessage.error(error.message || 'Login failed')
      } finally {
        loading.value = false
      }
    }
    
    // 处理注册逻辑
    const handleRegister = async () => {
      if (!registerFormRef.value) return
      
      try {
        await registerFormRef.value.validate()
        loading.value = true
        
        // 调用实际的注册API
        await register({
          username: registerForm.username,
        
          password: registerForm.password
        })
        
        ElMessage.success('Registration successful!')
        isLogin.value = true // 注册成功后切换到登录页面
        
      } catch (error) {
        console.error('Registration failed:', error)
        ElMessage.error(error.message || 'Registration failed')
      } finally {
        loading.value = false
      }
    }
    
    // 返回响应式数据和方法，供模板使用
    return {
      isLogin,
      loginForm,
      registerForm,
      loginRules,
      registerRules,
      loginFormRef,
      registerFormRef,
      loading,
      switchToLogin,
      switchMode,
      handleLogin,
      handleRegister
    }
  }
}
</script>

<style scoped>
/* 页面整体容器样式 */
.auth-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 背景渐变样式 */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #74b9ff, #0984e3);
  z-index: -1;
}

/* 背景覆盖层，增加毛玻璃效果 */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

/* 认证卡片整体样式 */
.auth-card {
  display: flex;
  width: 100%;
  height: 100%;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  max-width: 1000px;
  margin: 40px auto;
  background: rgba(255, 255, 255, 0.9);
}

/* 左侧区域样式，包含SIGN IN文字 */
.left-section {
  width: 40%;
  background: linear-gradient(to bottom, #74b9ff, #0984e3);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.4s ease;
}

/* 当处于登录状态时的左侧区域样式 */
.left-section.active {
  background: #fff;
  color: #0984e3;
}

/* SIGN IN标题样式 */
.left-section h2 {
  font-size: 2.5rem;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0;
  padding: 20px;
  text-align: center;
}

/* 右侧表单区域样式 */
.right-section {
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

/* 表单容器样式 */
.form-container {
  width: 100%;
  max-width: 400px;
}

/* 表单标题样式 */
.form-container h2 {
  color: #333;
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
}

/* 表单整体样式 */
.auth-form {
  margin-bottom: 20px;
}

/* 表单项样式 */
.auth-form .el-form-item {
  margin-bottom: 24px;
}

/* 提交按钮样式 */
.submit-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
  font-weight: bold;
  background-color: #74b9ff;
  border-color: #74b9ff;
  margin-top: 10px;
}

/* 提交按钮悬停样式 */
.submit-btn:hover {
  background-color: #0984e3;
  border-color: #0984e3;
}

/* 切换模式提示文本样式 */
.toggle-text {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

/* 切换链接样式 */
.toggle-link {
  color: #74b9ff;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s;
}

/* 切换链接悬停样式 */
.toggle-link:hover {
  color: #0984e3;
}

/* 响应式设计：小屏幕设备上的样式 */
@media (max-width: 768px) {
  .auth-card {
    flex-direction: column;
    height: auto;
    margin: 20px auto;
  }
  
  .left-section {
    width: 100%;
    padding: 30px 0;
  }
  
  .right-section {
    width: 100%;
    padding: 30px;
  }
}
</style>