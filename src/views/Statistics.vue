<template>
  <div class="statistics-charts">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>📊 图书馆数据统计</h1>
      <p>专业图表展示图书馆运营状态</p>
    </div>

    <!-- 统计概览 -->
    <div class="stats-overview">
      <div class="stat-card" v-for="(stat, index) in stats" :key="index">
        <div class="stat-icon" :class="`icon-${stat.type}`">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-container">
      <div class="chart-section">
        <h2>📈 月度借阅趋势</h2>
        <div class="chart-wrapper">
          <canvas ref="barChartRef"></canvas>
        </div>
      </div>
      
      <div class="chart-section">
        <h2>🎯 借阅状态分布</h2>
        <div class="chart-controls">
          <el-button size="small" @click="updatePieData">🔄 刷新数据</el-button>
          <el-button size="small" @click="toggleAnimation">⚡ {{ animationEnabled ? '关闭' : '开启' }}动画</el-button>
        </div>
        <div class="chart-wrapper">
          <canvas ref="pieChartRef"></canvas>
        </div>
      </div>
    </div>

    <!-- 热门图书 -->
    <div class="books-section">
      <h2>🔥 热门图书 TOP 5</h2>
      <el-table :data="topBooks" style="width: 100%" border>
        <el-table-column prop="rank" label="排名" width="80"></el-table-column>
        <el-table-column prop="title" label="图书名称"></el-table-column>
        <el-table-column prop="author" label="作者" width="150"></el-table-column>
        <el-table-column prop="borrowCount" label="借阅次数" width="120"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'

// 注册 Chart.js 所有模块
Chart.register(...registerables)

export default {
  name: 'Statistics',
  setup() {
    // 图表引用
    const barChartRef = ref(null)
    const pieChartRef = ref(null)
    let barChartInstance = null
    let pieChartInstance = null

    // 动画控制
    const animationEnabled = ref(true)

    // 统计数据
    const stats = ref([
      { type: 'users', icon: 'el-icon-user', value: '156', label: '总用户数' },
      { type: 'books', icon: 'el-icon-notebook-2', value: '520', label: '总图书数' },
      { type: 'borrows', icon: 'el-icon-document', value: '1,280', label: '总借阅数' },
      { type: 'active', icon: 'el-icon-data-analysis', value: '768', label: '当前在借' }
    ])

    // 饼图数据
    const pieData = ref({
      returned: 512,
      borrowed: 768
    })

    // 热门图书数据
    const topBooks = ref([
      { rank: 1, title: 'Java 编程思想', author: 'Bruce Eckel', borrowCount: 156 },
      { rank: 2, title: '深入理解计算机系统', author: 'Randal E. Bryant', borrowCount: 142 },
      { rank: 3, title: '算法导论', author: 'Thomas H. Cormen', borrowCount: 138 },
      { rank: 4, title: '设计模式', author: 'GoF', borrowCount: 125 },
      { rank: 5, title: '代码大全', author: 'Steve McConnell', borrowCount: 118 }
    ])

    // 初始化条形图
    const initBarChart = () => {
      if (barChartInstance) {
        barChartInstance.destroy()
      }

      const ctx = barChartRef.value.getContext('2d')
      barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          datasets: [{
            label: '借阅次数',
            data: [120, 132, 101, 134, 90, 230, 210, 200, 170, 190, 180, 220],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(79, 70, 229, 0.8)',
              'rgba(124, 58, 237, 0.8)',
              'rgba(192, 38, 211, 0.8)',
              'rgba(236, 72, 153, 0.8)',
              'rgba(244, 63, 94, 0.8)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(234, 179, 8, 0.8)',
              'rgba(72, 187, 120, 0.8)',
              'rgba(22, 163, 74, 0.8)',
              'rgba(21, 128, 61, 0.8)',
              'rgba(23, 63, 39, 0.8)'
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(79, 70, 229, 1)',
              'rgba(124, 58, 237, 1)',
              'rgba(192, 38, 211, 1)',
              'rgba(236, 72, 153, 1)',
              'rgba(244, 63, 94, 1)',
              'rgba(249, 115, 22, 1)',
              'rgba(234, 179, 8, 1)',
              'rgba(72, 187, 120, 1)',
              'rgba(22, 163, 74, 1)',
              'rgba(21, 128, 61, 1)',
              'rgba(23, 63, 39, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1,
              padding: 12,
              displayColors: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                color: '#666',
                font: {
                  size: 12
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#666',
                font: {
                  size: 12
                }
              }
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          }
        }
      })
    }

    // 初始化饼图 - 增强版
    const initPieChart = () => {
      if (pieChartInstance) {
        pieChartInstance.destroy()
      }

      const ctx = pieChartRef.value.getContext('2d')
      pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['已归还', '未归还'],
          datasets: [{
            data: [pieData.value.returned, pieData.value.borrowed],
            backgroundColor: [
              'rgba(59, 130, 246, 0.9)',
              'rgba(239, 68, 68, 0.9)'
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(239, 68, 68, 1)'
            ],
            borderWidth: 2,
            hoverOffset: 20, // 悬停时偏移距离
            hoverBorderWidth: 3 // 悬停时边框宽度
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 14,
                  family: 'Arial, sans-serif'
                },
                color: '#333',
                boxHeight: 12,
                boxWidth: 12
              }
            },
            tooltip: {
              enabled: true,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: function(context) {
                  const label = context.label || ''
                  const value = context.raw || 0
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return `${label}: ${value} (${percentage}%)`
                }
              }
            }
          },
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: animationEnabled.value ? 2000 : 0, // 动画持续时间
            easing: 'easeOutBounce' // 弹跳效果
          },
          cutout: '60%', // 创建环形图效果
          interaction: {
            mode: 'index',
            intersect: false
          }
        }
      })
    }

    // 更新饼图数据
    const updatePieData = () => {
      // 模拟数据变化
      pieData.value.returned = Math.floor(Math.random() * 600) + 400
      pieData.value.borrowed = Math.floor(Math.random() * 800) + 600
      
      if (pieChartInstance) {
        pieChartInstance.data.datasets[0].data = [pieData.value.returned, pieData.value.borrowed]
        pieChartInstance.update(animationEnabled.value ? 'easeOutBounce' : undefined)
      }
    }

    // 切换动画
    const toggleAnimation = () => {
      animationEnabled.value = !animationEnabled.value
      if (pieChartInstance) {
        pieChartInstance.options.animation.duration = animationEnabled.value ? 2000 : 0
        pieChartInstance.update()
      }
    }

    // 组件挂载
    onMounted(() => {
      // 延迟初始化确保 DOM 渲染完成
      setTimeout(() => {
        initBarChart()
        initPieChart()
      }, 100)
    })

    // 组件卸载时清理
    onUnmounted(() => {
      if (barChartInstance) {
        barChartInstance.destroy()
      }
      if (pieChartInstance) {
        pieChartInstance.destroy()
      }
    })

    return {
      barChartRef,
      pieChartRef,
      stats,
      topBooks,
      animationEnabled,
      updatePieData,
      toggleAnimation
    }
  }
}
</script>

<style scoped>
.statistics-charts {
  padding: 24px;
  min-height: calc(100vh - 120px);
  background: #f8fafc;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  color: #1e293b;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.page-header p {
  color: #64748b;
  margin: 0;
  font-size: 16px;
}

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
  color: white;
}

.icon-users { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
.icon-books { background: linear-gradient(135deg, #8b5cf6, #a78bfa); }
.icon-borrows { background: linear-gradient(135deg, #ef4444, #f87171); }
.icon-active { background: linear-gradient(135deg, #10b981, #34d399); }

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

/* 图表区域 */
.charts-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  margin-bottom: 40px;
}

.chart-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.chart-section h2 {
  font-size: 20px;
  color: #1e293b;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.chart-controls {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}

.chart-wrapper {
  height: 320px;
  width: 100%;
}

/* 热门图书 */
.books-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.books-section h2 {
  font-size: 20px;
  color: #1e293b;
  margin: 0 0 20px 0;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart-wrapper {
    height: 280px;
  }
  
  .chart-controls {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .statistics-charts {
    padding: 16px;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .chart-wrapper {
    height: 240px;
  }
}
</style>