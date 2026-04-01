<template>
  <div class="borrow-management">
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <div class="search-section">
        <el-input
          v-model="searchForm.username"
          placeholder="请输入用户名"
          style="width: 200px; margin-right: 10px;"
          clearable
        />
        <el-input
          v-model="searchForm.bookName"
          placeholder="请输入书名"
          style="width: 200px; margin-right: 10px;"
          clearable
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="success" @click="handleBorrowBook" style="float: right;">借书</el-button>
      </div>

      <!-- 借阅记录表格 -->
      <el-table
        :data="borrowList"
        border
        style="width: 100%; margin-top: 20px;"
        v-loading="loading"
       >
        <el-table-column prop="id" label="序号" width="80" align="center" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="bookName" label="书名" min-width="200" />
        <el-table-column prop="borrowTime" label="借阅时间" min-width="180" />
        <el-table-column prop="returnTime" label="归还时间" min-width="180">
          <template #default="scope">
            <span :style="{ color: scope.row.returnTime ? 'green' : 'red' }">
              {{ scope.row.returnTime || '未归还' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
       
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        v-if="total > 0"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5, 10, 20, 50]"
        :current-page="pagination.pageNum"
        :page-size="pagination.pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; text-align: center;"
      />

      <!-- 借书对话框 -->
      <el-dialog
        title="借书"
        v-model="borrowDialogVisible"
        width="400px"
        @close="resetBorrowForm"
      >
        <el-form :model="borrowForm" :rules="borrowRules" ref="borrowFormRef" label-width="80px">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="borrowForm.userName" placeholder="请输入用户名（可选，从 Token 获取）" />
          </el-form-item>
          <el-form-item label="书名" prop="bookName">
            <el-input v-model="borrowForm.bookName" placeholder="请输入书名" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="borrowDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmBorrow">确认借书</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 还书对话框 -->
      <el-dialog
        title="还书"
        v-model="returnDialogVisible"
        width="400px"
        @close="resetReturnForm"
      >
        <el-form :model="returnForm" :rules="returnRules" ref="returnFormRef" label-width="80px">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="returnForm.userName" disabled />
          </el-form-item>
          <el-form-item label="书名" prop="bookName">
            <el-input v-model="returnForm.bookName" disabled />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="returnDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmReturn">确认还书</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as borrowApi from '@/api/borrow'

export default {
  name: 'BorrowManagement',
  setup() {
    // 加载状态
    const loading = ref(false)
    
    // 搜索表单
    const searchForm = ref({
      username: '',
      bookName: ''
    })
    
    // 分页参数
    const pagination = ref({
      pageNum: 1,
      pageSize: 10
    })
    
    // 借阅列表和总数
    const borrowList = ref([])
    const total = ref(0)
    
    // 借书相关
    const borrowDialogVisible = ref(false)
    const borrowFormRef = ref(null)
    const borrowForm = ref({
      userName: '',
      bookName: ''
    })
    
    const borrowRules = {
      bookName: [
        { required: true, message: '请输入书名', trigger: 'blur' }
      ]
    }
    
    // 还书相关
    const returnDialogVisible = ref(false)
    const returnFormRef = ref(null)
    const returnForm = ref({
      userName: '',
      bookName: ''
    })
    
    const returnRules = {
      userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      bookName: [
        { required: true, message: '请输入书名', trigger: 'blur' }
      ]
    }
    
    // 获取借阅列表函数定义
    let getBorrowList
    
    // 搜索
    const handleSearch = () => {
      pagination.value.pageNum = 1
      getBorrowList()
    }
    
    // 重置
    const handleReset = () => {
      searchForm.value.username = ''
      searchForm.value.bookName = ''
      pagination.value.pageNum = 1
      getBorrowList()
    }
    
    // 分页大小改变
    const handleSizeChange = (val) => {
      pagination.value.pageSize = val
      pagination.value.pageNum = 1
      getBorrowList()
    }
    
    // 当前页改变
    const handleCurrentChange = (val) => {
      pagination.value.pageNum = val
      getBorrowList()
    }
    
    // 借书
    const handleBorrowBook = () => {
      borrowForm.value = {
        userName: '',
        bookName: ''
      }
      borrowDialogVisible.value = true
    }
    
    // 确认借书
    const confirmBorrow = async () => {
      if (!borrowFormRef.value) return
      
      try {
        await borrowFormRef.value.validate()
        
        await borrowApi.borrowBook(borrowForm.value)
        ElMessage.success('借书成功')
        borrowDialogVisible.value = false
        getBorrowList()
      } catch (error) {
        if (error.response && error.response.data) {
          ElMessage.error(error.response.data.message || '借书失败')
        } else {
          ElMessage.error('借书失败')
        }
      }
    }
    
    // 还书
    const handleReturnBook = (row) => {
      returnForm.value = {
        userName: row.username,
        bookName: row.bookName
      }
      returnDialogVisible.value = true
    }
    
    // 确认还书
    const confirmReturn = async () => {
      if (!returnFormRef.value) return
      
      try {
        await returnFormRef.value.validate()
        
        await borrowApi.returnBook({
          userName: returnForm.value.userName,
          bookName: returnForm.value.bookName
        })
        ElMessage.success('还书成功')
        returnDialogVisible.value = false
        getBorrowList()
      } catch (error) {
        if (error.response && error.response.data) {
          ElMessage.error(error.response.data.message || '还书失败')
        } else {
          ElMessage.error('还书失败')
        }
      }
    }
    
    // 删除借阅记录
    const handleDelete = (id) => {
      ElMessageBox.confirm('确定要删除这条借阅记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await borrowApi.deleteBorrow(id)
          ElMessage.success('删除成功')
          getBorrowList()
        } catch (error) {
          if (error.response && error.response.data) {
            ElMessage.error(error.response.data.message || '删除失败')
          } else {
            ElMessage.error('删除失败')
          }
        }
      }).catch(() => {
        // 取消删除
      })
    }
    
    // 重置借书表单
    const resetBorrowForm = () => {
      if (borrowFormRef.value) {
        borrowFormRef.value.resetFields()
      }
      borrowForm.value = {
        userName: '',
        bookName: ''
      }
    }
    
    // 重置还书表单
    const resetReturnForm = () => {
      if (returnFormRef.value) {
        returnFormRef.value.resetFields()
      }
      returnForm.value = {
        userName: '',
        bookName: ''
      }
    }
    
    // 获取借阅列表 - 在所有依赖函数定义后初始化
    getBorrowList = async () => {
      loading.value = true
      
      try {
        const params = {
          username: searchForm.value.username || undefined,
          bookName: searchForm.value.bookName || undefined,
          pageNum: pagination.value.pageNum,
          pageSize: pagination.value.pageSize
        }

        const data = await borrowApi.getBorrowList(params)
        borrowList.value = data.list || []
        total.value = data.total || 0
      } catch (error) {
        ElMessage.error('获取借阅列表失败')
      } finally {
        loading.value = false
      }
    }
    
    // 初始化加载
    onMounted(() => {
      getBorrowList()
    })
    
    return {
      loading,
      searchForm,
      pagination,
      borrowList,
      total,
      borrowDialogVisible,
      borrowFormRef,
      borrowForm,
      borrowRules,
      returnDialogVisible,
      returnFormRef,
      returnForm,
      returnRules,
      getBorrowList,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      handleBorrowBook,
      confirmBorrow,
      handleReturnBook,
      confirmReturn,
      handleDelete,
      resetBorrowForm,
      resetReturnForm
    }
  }
}
</script>

<style scoped>
.borrow-management {
  padding: 20px;
}

.search-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.box-card {
  min-height: calc(100vh - 120px);
}
</style>