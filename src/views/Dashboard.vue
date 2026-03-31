<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div class="header-left">wuhuwuhu 图书馆</div>
        <div class="header-right">读万卷书，行万里路</div>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">
          <ul class="menu">
            <li><router-link to="/dashboard/users">用户管理</router-link></li>
            <li><router-link to="/dashboard/borrow">借阅管理</router-link></li>
            <li><router-link to="/dashboard/book">图书管理</router-link></li>
          </ul>
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
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.menu li {
  margin-bottom: 10px;
}

.menu a {
  display: block;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  transition: all 0.3s;
  border-radius: 4px;
  margin: 0 10px;
}

.menu a:hover {
  background-color: #2c3e50;
  transform: translateX(5px);
}

.menu a.router-link-active {
  background-color: #2ecc71;
}

.main {
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
}
</style>