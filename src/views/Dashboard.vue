<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div class="header-left">wuhuwuhu 图书馆</div>
        <div class="header-right">读万卷书，行万里路</div>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">
          <el-menu
            :default-active="$route.path"
            background-color="#34495e"
            text-color="#fff"
            active-text-color="#2ecc71"
            class="menu"
          >
            <el-menu-item index="/dashboard/users" @click="$router.push('/dashboard/users')">用户管理</el-menu-item>
            <el-menu-item index="/dashboard/borrow" @click="$router.push('/dashboard/borrow')">借阅管理</el-menu-item>
            <el-menu-item index="/dashboard/book" @click="$router.push('/dashboard/book')">图书管理</el-menu-item>
            <el-menu-item index="/dashboard/statistics" @click="$router.push('/dashboard/statistics')">数据统计</el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style scoped>
.common-layout {
  height: 100vh;
  width: 100%;
}

.el-container {
  height: 100%;
}

.header {
  background-color: #2ecc71; /* 绿色背景 */
  color: black; /* 黑色文字 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-left {
  font-size: 20px;
  font-weight: bold;
}

.header-right {
  font-size: 14px;
  color: #333;
}

.aside {
  background-color: #34495e;
  overflow-y: auto;
}

.menu {
  border-right: none;
  margin-top: 20px;
}

.main {
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
}
</style>