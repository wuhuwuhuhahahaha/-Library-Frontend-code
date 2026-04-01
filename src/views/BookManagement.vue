<template>
  <div class="book-management">
    <el-card class="box-card">
      <!-- 搜索和操作区域 -->
      <div class="search-section">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入书名或作者搜索"
          style="width: 300px; margin-right: 20px;"
          clearable
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="success" @click="handleAdd" style="float: right;">新增图书</el-button>
      </div>

      <!-- 图书表格 -->
      <el-table
        :data="bookList"
        border
        style="width: 100%; margin-top: 20px;"
       >
        <el-table-column prop="id" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="书名" min-width="150" />
        <el-table-column prop="author" label="作者" min-width="120" />
        <el-table-column prop="stock" label="库存" width="80" align="center" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleBorrow(scope.row)">借书</el-button>
            <el-button size="small" type="warning" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button size="small" type="info" @click="handleReturn(scope.row)">还书</el-button>
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

      <!-- 新增/编辑图书对话框 -->
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="500px"
        @close="resetForm"
      >
        <el-form :model="bookForm" :rules="bookRules" ref="bookFormRef" label-width="80px">
          <el-form-item label="书名" prop="name">
            <el-input v-model="bookForm.name" placeholder="请输入书名" />
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="bookForm.author" placeholder="请输入作者" />
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input-number v-model="bookForm.stock" :min="0" :max="9999" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitBook">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 借书对话框 -->
      <el-dialog
        title="借书"
        v-model="borrowDialogVisible"
        width="400px"
        @close="resetBorrowForm"
      >
        <el-form :model="borrowForm" label-width="80px">
          <el-form-item label="书名">
            <el-input v-model="borrowForm.bookName" disabled />
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
            <el-input v-model="returnForm.userName" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="书名">
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
import * as bookApi from '@/api/book'

export default {
  name: 'BookManagement',
  setup() {
    // 加载状态
    const loading = ref(false)
    
    // 搜索表单
    const searchForm = ref({
      keyword: ''
    })
    
    // 分页参数
    const pagination = ref({
      pageNum: 1,
      pageSize: 10
    })
    
    // 图书列表和总数
    const bookList = ref([])
    const total = ref(0)
    
    // 对话框相关
    const dialogVisible = ref(false)
    const dialogTitle = ref('新增图书')
    const bookFormRef = ref(null)
    const bookForm = ref({
      id: null,
      name: '',
      author: '',
      stock: 0
    })
    
    const bookRules = {
      name: [
        { required: true, message: '请输入书名', trigger: 'blur' }
      ],
      author: [
        { required: true, message: '请输入作者', trigger: 'blur' }
      ],
      stock: [
        { required: true, message: '请输入库存数量', trigger: 'blur' },
        { type: 'number', min: 0, message: '库存不能小于0', trigger: 'blur' }
      ]
    }
    
    // 借书相关
    const borrowDialogVisible = ref(false)
    const borrowForm = ref({
      bookName: ''
    })
    
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
      ]
    }
    
    // 获取图书列表
    const getBookList = async () => {
      loading.value = true
      try {
        const params = {
          keyword: searchForm.value.keyword || undefined,
          pageNum: pagination.value.pageNum,
          pageSize: pagination.value.pageSize
        }
        
        const data = await bookApi.getBooks(params)
        // 根据实际后端返回的数据结构调整
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          bookList.value = Array.isArray(data.list) ? data.list : []
          total.value = data.total || 0
        } else {
          bookList.value = Array.isArray(data) ? data : []
          total.value = bookList.value.length
        }
      } catch (error) {
        console.error('加载图书列表失败:', error)
        bookList.value = []
        total.value = 0
      } finally {
        loading.value = false
      }
    }
    
// ... existing code ...
    
    // 搜索
    const handleSearch = () => {
      pagination.value.pageNum = 1
      getBookList()
    }
    
    // 重置
    const handleReset = () => {
      searchForm.value.keyword = ''
      pagination.value.pageNum = 1
      getBookList()
    }
    
    // 分页大小改变
    const handleSizeChange = (val) => {
      pagination.value.pageSize = val
      pagination.value.pageNum = 1
      getBookList()
    }
    
    // 当前页改变
    const handleCurrentChange = (val) => {
      pagination.value.pageNum = val
      getBookList()
    }
    
    // 新增图书
    const handleAdd = () => {
      dialogTitle.value = '新增图书'
      bookForm.value = {
        id: null,
        name: '',
        author: '',
        stock: 0
      }
      dialogVisible.value = true
    }
    
    // 编辑图书
    const handleEdit = (row) => {
      dialogTitle.value = '编辑图书'
      bookForm.value = { ...row }
      dialogVisible.value = true
    }
    
    // 提交图书表单
    const submitBook = async () => {
      if (!bookFormRef.value) return
      
      try {
        await bookFormRef.value.validate()
        
        if (bookForm.value.id) {
          // 编辑
          await bookApi.updateBook(bookForm.value)
          ElMessage.success('编辑图书成功')
          dialogVisible.value = false
          getBookList()
        } else {
          // 新增
          await bookApi.addBook(bookForm.value)
          ElMessage.success('新增图书成功')
          dialogVisible.value = false
          getBookList()
        }
      } catch (error) {
        ElMessage.error('表单验证失败')
      }
    }
    
    // 删除图书
    const handleDelete = (id) => {
      ElMessageBox.confirm('确定要删除这本书吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await bookApi.deleteBook(id)
          ElMessage.success('删除图书成功')
          getBookList()
        } catch (error) {
          ElMessage.error('删除图书失败')
        }
      }).catch(() => {
        // 取消删除
      })
    }
    
    // 借书
    const handleBorrow = (row) => {
      if (row.stock <= 0) {
        ElMessage.warning('该书库存不足，无法借阅')
        return
      }
      
      borrowForm.value.bookName = row.name
      borrowDialogVisible.value = true
    }
    
    // 确认借书
    const confirmBorrow = async () => {
      try {
        // 从 sessionStorage 获取 token 并解析用户名
        const token = sessionStorage.getItem('token')
        if (!token) {
          ElMessage.error('请先登录')
          return
        }
        
        // 解析 JWT token 获取用户名
        let username = ''
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          username = payload.username || payload.sub // 根据后端 JWT 结构调整
        } catch (parseError) {
          console.error('解析用户信息失败:', parseError)
          ElMessage.error('用户信息无效，请重新登录')
          return
        }
        
        // 根据项目规范，响应拦截器已处理错误，try 块内无需再判断 code
        await bookApi.borrowBook({ 
          username: username,
          bookName: borrowForm.value.bookName 
        })
        // 如果执行到这里，说明借书成功
        ElMessage.success('借书成功')
        borrowDialogVisible.value = false
        getBookList()
      } catch (error) {
        console.error('借书失败:', error)
        // 错误已经在响应拦截器中处理过了，这里可以不显示重复提示
        // 或者显示通用错误信息
        ElMessage.error('借书失败')
      }
    }
    
    // 还书
    const handleReturn = (row) => {
      returnForm.value.bookName = row.name
      returnDialogVisible.value = true
    }
    
    // 确认还书 - 注意：根据 API 定义，returnBook 使用 params 而不是 data
    const confirmReturn = async () => {
      if (!returnFormRef.value) return
      
      try {
        await returnFormRef.value.validate()
        
        // 根据 API 定义，returnBook 接收 params 参数
        await bookApi.returnBook({
          userName: returnForm.value.userName,
          bookName: returnForm.value.bookName
        })
        ElMessage.success('还书成功')
        returnDialogVisible.value = false
        getBookList()
      } catch (error) {
        ElMessage.error('表单验证失败')
      }
    }
    
    // 重置表单
    const resetForm = () => {
      if (bookFormRef.value) {
        bookFormRef.value.resetFields()
      }
    }
    
    // 重置借书表单
    const resetBorrowForm = () => {
      borrowForm.value = {
        bookName: ''
      }
    }
    
    // 重置还书表单
    const resetReturnForm = () => {
      if (returnFormRef.value) {
        returnFormRef.value.resetFields()
      }
      returnForm.value.bookName = ''
    }
    
    // 初始化加载
    onMounted(() => {
      getBookList()
    })
    
    return {
      loading,
      searchForm,
      pagination,
      bookList,
      total,
      dialogVisible,
      dialogTitle,
      bookFormRef,
      bookForm,
      bookRules,
      borrowDialogVisible,
      borrowForm,
      returnDialogVisible,
      returnFormRef,
      returnForm,
      returnRules,
      getBookList,
      handleSearch,
      handleReset,
      handleSizeChange,
      handleCurrentChange,
      handleAdd,
      handleEdit,
      submitBook,
      handleDelete,
      handleBorrow,
      confirmBorrow,
      handleReturn,
      confirmReturn,
      resetForm,
      resetBorrowForm,
      resetReturnForm
    }
  }
}
</script>

<style scoped>
.book-management {
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