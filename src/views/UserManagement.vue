<template>
  <div class="user-management">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索用户名"
        style="width: 200px; margin-right: 10px;"
        clearable
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="userList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑用户" width="400px">
      <el-form :model="currentUser" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="currentUser.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="currentUser.password"
            type="password"
            placeholder="不修改则留空"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUpdate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, updateUser, deleteUser } from '@/api/user'

// 响应式数据定义
const userList = ref([])
const searchKeyword = ref('')
const dialogVisible = ref(false)
const currentUser = ref({ id: null, username: '', password: '' })

/**
 * 加载用户列表
 */
const loadUsers = async () => {
  try {
    const data = await getUserList(searchKeyword.value)
    // 确保数据为数组格式
    userList.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('加载用户列表失败:', error)
    userList.value = []
  }
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  loadUsers()
}

/**
 * 重置搜索
 */
const resetSearch = () => {
  searchKeyword.value = ''
  loadUsers()
}

/**
 * 处理编辑
 * @param {Object} user - 用户对象
 */
const handleEdit = (user) => {
  currentUser.value = { ...user, password: '' }
  dialogVisible.value = true
}

/**
 * 保存更新
 */
const saveUpdate = async () => {
  try {
    await updateUser(currentUser.value)
    ElMessage.success('更新成功')
    dialogVisible.value = false
    loadUsers()
  } catch (error) {
    console.error('更新失败:', error)
  }
}

/**
 * 处理删除
 * @param {Object} user - 用户对象
 */
const handleDelete = (user) => {
  ElMessageBox.confirm(
    `确定要删除用户 "${user.username}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    confirmDelete(user.id)
  }).catch(() => {})
}

/**
 * 确认删除
 * @param {number} id - 用户ID
 */
const confirmDelete = async (id) => {
  try {
    await deleteUser(id)
    ElMessage.success('删除成功')
    loadUsers()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
</style>