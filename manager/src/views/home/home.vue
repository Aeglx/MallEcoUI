<template>
  <div>
    <!-- 统计 -->
    <div class="card">
      <h4>基本信息</h4>
      <div class="count-list flex">
        <div class="count-item" @click="navigateTo('managerGoods')">
          <div>
            <el-icon class="icon" :size="31">
              <Picture />
            </el-icon>
          </div>
          <div>
            <div class="counts">{{ homeData.goodsNum || 0 }}</div>
            <div>商品数量</div>
          </div>
        </div>
        <div class="count-item" @click="navigateTo('memberList')">
          <div>
            <el-icon class="icon" :size="31">
              <User />
            </el-icon>
          </div>
          <div>
            <div class="counts">{{ homeData.memberNum || 0 }}</div>
            <div>会员数量</div>
          </div>
        </div>
        <div class="count-item" @click="navigateTo('orderList')">
          <div>
            <el-icon class="icon" :size="31">
              <List />
            </el-icon>
          </div>
          <div>
            <div class="counts">{{ homeData.orderNum || 0 }}</div>
            <div>订单数量</div>
          </div>
        </div>
        <div class="count-item" @click="navigateTo('shopList')">
          <div>
            <el-icon class="icon" :size="31">
              <DataAnalysis />
            </el-icon>
          </div>
          <div>
            <div class="counts">{{ homeData.storeNum || 0 }}</div>
            <div>店铺数量</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日待办 -->
    <div class="card">
      <h4>今日待办</h4>
      <div class="todo-list flex">
        <div class="todo-item" @click="navigateTo('applyGoods')">
          <div class="counts">{{ notices.goods || 0 }}</div>
          <div>待审核商品</div>
        </div>
        <div class="todo-item" @click="navigateTo('shopAuth')">
          <div class="counts">{{ notices.store || 0 }}</div>
          <div>待审核店铺</div>
        </div>
        <div class="todo-item" @click="navigateTo('orderComplaint')">
          <div class="counts">{{ notices.complain || 0 }}</div>
          <div>待审核投诉</div>
        </div>
        <div class="todo-item" @click="navigateTo('afterSaleOrder')">
          <div class="counts">{{ notices.refund || 0 }}</div>
          <div>待审核售后</div>
        </div>
        <div class="todo-item">
          <div class="counts">{{ notices.distributionCash || 0 }}</div>
          <div>待审核分销提现</div>
        </div>
        <div class="todo-item" @click="navigateTo('accountStatementBill')">
          <div class="counts">{{ notices.waitPayBill || 0 }}</div>
          <div>待审核分账</div>
        </div>
      </div>
    </div>

    <!-- 今日，流量概括 -->
    <div class="card flow">
      <div class="flow-list flex">
        <div class="flow-item">
          <div class="flow-member">
            <div>当前在线人数</div>
            <span>{{ homeData.currentNumberPeopleOnline || 0 }}</span>
          </div>
          <div class="flow-wrapper">
            <h4>流量概括</h4>
            <div class="card flow-box flex">
              <div class="flow-box-item">
                <div>今日访客数</div>
                <div class="counts">{{ homeData.todayUV || 0 }}</div>
              </div>
              <div class="flow-box-item">
                <div>昨日访客数</div>
                <div class="counts">{{ homeData.yesterdayUV || 0 }}</div>
              </div>
            </div>

            <div class="flow-splice flex">
              <div class="flow-box-splice">
                <div>前七日访客数</div>
                <div class="counts">{{ homeData.lastSevenUV || 0 }}</div>
              </div>
              <div class="flow-box-splice">
                <div>前三十日访客数</div>
                <div class="counts">{{ homeData.lastThirtyUV || 0 }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="today-box">
          <h4>今日概括</h4>
          <div class="today-list flex">
            <div class="today-item">
              <div>今日订单数</div>
              <span>{{ homeData.todayOrderNum || 0 }}</span>
            </div>
            <div class="today-item">
              <div>今日交易额</div>
              <span v-if="homeData.todayOrderPrice">￥{{ formatPrice(homeData.todayOrderPrice) }}</span>
              <span v-else>￥0.00</span>
            </div>
            <div class="today-item">
              <div>今日新增店铺</div>
              <span>{{ homeData.todayStoreNum || 0 }}</span>
            </div>
            <div class="today-item">
              <div>今日新增会员数</div>
              <span>{{ homeData.todayMemberNum || 0 }}</span>
            </div>
            <div class="today-item">
              <div>今日上架商品数量</div>
              <span>{{ homeData.todayGoodsNum || 0 }}</span>
            </div>
            <div class="today-item">
              <div>今日新增评论</div>
              <span>{{ homeData.todayMemberEvaluation || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- chart -->
    <div class="card transform">
      <div>
        <h4>最近48小时在线人数（整点为准）</h4>
        <div id="historyMemberChart"></div>
      </div>
    </div>
    <!-- chart -->
    <div class="charts flex">
      <div class="chart-item">
        <h4>流量走势</h4>
        <div id="pvChart"></div>
      </div>
      <div class="chart-item">
        <h4>交易趋势</h4>
        <div id="orderChart"></div>
      </div>
    </div>

    <!-- top10商品 -->
    <div class="card transform">
      <h4>热卖商品TOP10</h4>
      <el-table stripe :data="topHotGoodsData" style="width: 100%">
        <el-table-column type="index" label="排名" width="100" align="center" />
        <el-table-column prop="goodsName" label="商品名称" />
        <el-table-column label="价格" width="150">
          <template #default="{ row }">
            <span :style="{ color: mainColor }">￥{{ formatPrice(row.price) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="销量" width="100" sortable />
      </el-table>
    </div>

    <!-- top10店铺 -->
    <div class="card transform">
      <h4>热卖店铺TOP10</h4>
      <el-table stripe :data="topHotShopsData" style="width: 100%">
        <el-table-column type="index" label="排名" width="100" align="center" />
        <el-table-column prop="storeName" label="店铺名称" />
        <el-table-column label="价格" width="150">
          <template #default="{ row }">
            <span :style="{ color: mainColor }">￥{{ formatPrice(row.price) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="销量" width="100" sortable />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Chart } from '@antv/g2'
import { Picture, User, List, DataAnalysis } from '@element-plus/icons-vue'
import { homeStatistics, hotGoods, hotShops, getNoticePage } from '@/api/index'
import { getOrderChart, getStatisticsList, historyMemberChartList } from '@/api/statistics'
import useAppStore from '@/stores/app'
import config from '@/config'
import type { ApiResponse } from '@/types/api'

const router = useRouter()
const appStore = useAppStore()
const { mainColor } = config

const homeData = ref<any>({})
const topHotGoodsData = ref<any[]>([])
const topHotShopsData = ref<any[]>([])
const notices = computed(() => appStore.notices)
const pvChart = ref<any>(null)
const orderChart = ref<any>(null)
const historyMemberChart = ref<any>(null)
const chartList = ref<any[]>([])
const data = ref<any[]>([])

const params = ref({
  searchType: 'LAST_SEVEN'
})

const orderParams = ref({
  searchType: 'LAST_SEVEN',
  year: '',
  shopId: '',
  memberId: ''
})

const formatPrice = (price: number) => {
  return String(Number(price).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const navigateTo = (name: string) => {
  router.push({ name })
}

// top10热卖商品
const toHotGoods = async () => {
  try {
    const res = (await hotGoods(params.value)) as unknown as ApiResponse<any[]>
    if (res.success) {
      topHotGoodsData.value = res.result || []
    }
  } catch (error) {
    console.error('获取热卖商品失败:', error)
    // 429错误时，延迟后重试一次
    if ((error as any)?.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      try {
        const retryRes = (await hotGoods(params.value)) as unknown as ApiResponse<any[]>
        if (retryRes.success) {
          topHotGoodsData.value = retryRes.result || []
        }
      } catch (retryError) {
        console.error('重试获取热卖商品失败:', retryError)
      }
    }
  }
}

// top10热卖店铺
const topHotShops = async () => {
  try {
    const res = (await hotShops(params.value)) as unknown as ApiResponse<any[]>
    if (res.success) {
      topHotShopsData.value = res.result || []
    }
  } catch (error) {
    console.error('获取热卖店铺失败:', error)
    // 429错误时，延迟后重试一次
    if ((error as any)?.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      try {
        const retryRes = (await hotShops(params.value)) as unknown as ApiResponse<any[]>
        if (retryRes.success) {
          topHotShopsData.value = retryRes.result || []
        }
      } catch (retryError) {
        console.error('重试获取热卖店铺失败:', retryError)
      }
    }
  }
}

// 今日待办
const awaitTodo = async () => {
  try {
    const res = (await getNoticePage()) as unknown as ApiResponse<any>
    if (res.success) {
      appStore.setNotices(res.result || {})
    }
  } catch (error) {
    console.error('获取待办事项失败:', error)
  }
}

// 首页统计数据
const getHomeData = async () => {
  try {
    const res = (await homeStatistics()) as unknown as ApiResponse<any>
    if (res.success) {
      const result = { ...res.result }
      if (result.todayOrderPrice && result.todayOrderPrice !== 'null') {
        result.todayOrderPrice = parseInt(result.todayOrderPrice)
      } else {
        result.todayOrderPrice = 0
      }
      homeData.value = result
    }
  } catch (error) {
    console.error('获取首页数据失败:', error)
  }
}

// 实例化订单图表
const initOrderChartList = async () => {
  try {
    if (orderChart.value) {
      orderChart.value.clear()
    }
    const res = (await getOrderChart(orderParams.value)) as unknown as ApiResponse<any[]>
    if (res.success) {
    // 确保 result 是数组
    chartList.value = Array.isArray(res.result) ? res.result : (res.result.chartData || res.result.data || [])

    if (!orderChart.value) {
      // 确保 DOM 元素存在
      const container = document.getElementById('orderChart')
      if (!container) {
        console.warn('orderChart 容器元素不存在')
        return
      }
      try {
        orderChart.value = new Chart({
          container: 'orderChart',
          autoFit: true,
          height: 500,
          padding: 70 as any
        })
        console.log('✅ orderChart 实例创建成功:', orderChart.value)
      } catch (e) {
        console.error('❌ orderChart 实例创建失败:', e)
        return
      }
    }
    // 等待下一个 tick 确保图表实例完全初始化
    setTimeout(() => {
      initOrderChart()
    }, 100)
    }
  } catch (error) {
    console.error('获取订单统计失败:', error)
    // 429错误时，延迟后重试一次
    if ((error as any)?.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      try {
        const retryRes = (await getOrderChart(orderParams.value)) as unknown as ApiResponse<any[]>
        if (retryRes.success) {
          chartList.value = Array.isArray(retryRes.result) ? retryRes.result : (retryRes.result.chartData || retryRes.result.data || [])
          if (!orderChart.value) {
            const container = document.getElementById('orderChart')
            if (container) {
              orderChart.value = new Chart({
                container: 'orderChart',
                autoFit: true,
                height: 500,
                padding: 70 as any
              })
            }
          }
          setTimeout(() => {
            initOrderChart()
          }, 100)
        }
      } catch (retryError) {
        console.error('重试获取订单统计失败:', retryError)
      }
    }
  }
}

// 订单表
const initOrderChart = () => {
  // 确保 chartList.value 是数组
  if (!Array.isArray(chartList.value)) {
    console.warn('chartList.value 不是数组:', chartList.value)
    chartList.value = []
    return
  }

  const chartData = chartList.value.map((item: any) => ({
    ...item,
    createTime: item.createTime?.split(' ')[0] || item.createTime,
    title: '交易额'
  }))

  // 检查图表实例是否有效
  if (!orderChart.value) {
    console.warn('orderChart 实例不存在')
    return
  }

  // 检查 Chart 实例的方法是否存在
  if (typeof orderChart.value.data !== 'function' || typeof orderChart.value.tooltip !== 'function') {
    console.error('G2 Chart 实例方法不存在，可能版本不兼容或未正确初始化')
    console.log('orderChart.value:', orderChart.value)
    return
  }

  // G2 4.x API
  orderChart.value.data(chartData)
  orderChart.value.tooltip({
    showCrosshairs: true,
    shared: true
  })
  orderChart.value.line().position('createTime*price').label('price').color('title').shape('smooth')
  orderChart.value
    .point()
    .position('createTime*price')
    .label('price')
    .color('title')
    .shape('circle')
    .style({
      stroke: '#fff',
      lineWidth: 1
    })
  orderChart.value.area().position('createTime*price').color('title').shape('smooth')
  orderChart.value.render()
}

// 浏览量统计图
const initPvChart = () => {
  const uv: any[] = []
  const pv: any[] = []

  // 确保 data.value 是数组
  if (!Array.isArray(data.value)) {
    console.warn('data.value 不是数组:', data.value)
    data.value = []
    return
  }

  data.value.forEach((item: any) => {
    uv.push({
      date: item.date,
      uvNum: item.uvNum,
      title: '访客数UV',
      pv: item.uvNum
    })

    pv.push({
      date: item.date,
      pvNum: item.pvNum,
      pv: item.pvNum,
      title: '浏览量PV'
    })
  })

  const chartData = [...uv, ...pv]

  // 检查图表实例是否有效
  if (!pvChart.value) {
    console.warn('pvChart 实例不存在')
    return
  }

  // 检查 Chart 实例的方法是否存在
  if (typeof pvChart.value.data !== 'function' || typeof pvChart.value.tooltip !== 'function') {
    console.error('G2 Chart 实例方法不存在，可能版本不兼容或未正确初始化')
    console.log('pvChart.value:', pvChart.value)
    return
  }

  // G2 4.x API
  pvChart.value.data(chartData)
  pvChart.value.tooltip({
    showCrosshairs: true,
    shared: true
  })
  pvChart.value.line().position('date*pv').color('title').label('pv').shape('smooth')
  pvChart.value.point().position('date*pv').color('title').label('pv').shape('circle').style({
    stroke: '#fff',
    lineWidth: 1
  })
  pvChart.value.area().position('date*pv').color('title').shape('smooth')
  pvChart.value.render()
}

// 浏览量
const getPvChart = async () => {
  try {
    if (pvChart.value) {
      pvChart.value.clear()
    }
    const res = (await getStatisticsList(params.value)) as unknown as ApiResponse<any[]>
    if (res.result) {
    // 确保 result 是数组
    data.value = Array.isArray(res.result) ? res.result : (res.result.chartData || res.result.data || [])

    if (!pvChart.value) {
      // 确保 DOM 元素存在
      const container = document.getElementById('pvChart')
      if (!container) {
        console.warn('pvChart 容器元素不存在')
        return
      }
      try {
        pvChart.value = new Chart({
          container: 'pvChart',
          autoFit: true,
          height: 500,
          padding: 70 as any
        })
        console.log('✅ pvChart 实例创建成功:', pvChart.value)
      } catch (e) {
        console.error('❌ pvChart 实例创建失败:', e)
        return
      }
    }
    // 等待下一个 tick 确保图表实例完全初始化
    setTimeout(() => {
      initPvChart()
    }, 100)
    }
  } catch (error) {
    console.error('获取流量统计失败:', error)
    // 429错误时，延迟后重试一次
    if ((error as any)?.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      try {
        const retryRes = (await getStatisticsList(params.value)) as unknown as ApiResponse<any[]>
        if (retryRes.result) {
          data.value = Array.isArray(retryRes.result) ? retryRes.result : (retryRes.result.chartData || retryRes.result.data || [])
          if (!pvChart.value) {
            const container = document.getElementById('pvChart')
            if (container) {
              pvChart.value = new Chart({
                container: 'pvChart',
                autoFit: true,
                height: 500,
                padding: 70 as any
              })
            }
          }
          setTimeout(() => {
            initPvChart()
          }, 100)
        }
      } catch (retryError) {
        console.error('重试获取流量统计失败:', retryError)
      }
    }
  }
}

// 实例化会员流量图表
const initHistoryMemberChartList = async () => {
  try {
    if (historyMemberChart.value) {
      historyMemberChart.value.clear()
    }
    const res = (await historyMemberChartList()) as unknown as ApiResponse<any[]>
    if (res.success) {
    // 确保 result 是数组
    chartList.value = Array.isArray(res.result) ? res.result : (res.result.chartData || res.result.data || res.result.dates || [])

    if (!historyMemberChart.value) {
      // 确保 DOM 元素存在
      const container = document.getElementById('historyMemberChart')
      if (!container) {
        console.warn('historyMemberChart 容器元素不存在')
        return
      }
      try {
        historyMemberChart.value = new Chart({
          container: 'historyMemberChart',
          autoFit: true,
          height: 500,
          padding: 70 as any
        })
        console.log('✅ historyMemberChart 实例创建成功:', historyMemberChart.value)
      } catch (e) {
        console.error('❌ historyMemberChart 实例创建失败:', e)
        return
      }
    }
    // 等待下一个 tick 确保图表实例完全初始化
    setTimeout(() => {
      initHistoryMemberChart()
    }, 100)
    }
  } catch (error) {
    console.error('获取会员历史统计失败:', error)
    // 429错误时，延迟后重试一次
    if ((error as any)?.response?.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      try {
        const retryRes = (await historyMemberChartList()) as unknown as ApiResponse<any[]>
        if (retryRes.success) {
          chartList.value = Array.isArray(retryRes.result) ? retryRes.result : (retryRes.result.chartData || retryRes.result.data || retryRes.result.dates || [])
          if (!historyMemberChart.value) {
            const container = document.getElementById('historyMemberChart')
            if (container) {
              historyMemberChart.value = new Chart({
                container: 'historyMemberChart',
                autoFit: true,
                height: 500,
                padding: 70 as any
              })
            }
          }
          setTimeout(() => {
            initHistoryMemberChart()
          }, 100)
        }
      } catch (retryError) {
        console.error('重试获取会员历史统计失败:', retryError)
      }
    }
  }
}

// 历史在线人数
const initHistoryMemberChart = () => {
  const num: any[] = []
  const lastNum: any[] = []

  // 确保 chartList.value 是数组
  if (!Array.isArray(chartList.value)) {
    console.warn('chartList.value 不是数组:', chartList.value)
    chartList.value = []
    return
  }

  chartList.value.forEach((item: any) => {
    num.push({
      date: item.date?.substring(5) || item.date,
      title: '最近48小时',
      num: item.num,
      res: item.num
    })

    lastNum.push({
      date: item.date?.substring(5) || item.date,
      title: '上一周期',
      lastNum: item.lastNum || 0,
      res: item.lastNum || 0
    })
  })

  const chartData = [...num, ...lastNum]
  
  // 检查图表实例是否有效
  if (!historyMemberChart.value) {
    console.warn('historyMemberChart 实例不存在')
    return
  }

  // 检查 Chart 实例的方法是否存在
  if (typeof historyMemberChart.value.data !== 'function' || typeof historyMemberChart.value.tooltip !== 'function') {
    console.error('G2 Chart 实例方法不存在，可能版本不兼容或未正确初始化')
    console.log('historyMemberChart.value:', historyMemberChart.value)
    return
  }

  // G2 4.x API
  historyMemberChart.value.data(chartData)
  historyMemberChart.value.tooltip({
    showCrosshairs: true,
    shared: true
  })
  historyMemberChart.value.line().position('date*res').color('title').label('res').shape('smooth')
  historyMemberChart.value.point().position('date*res').color('title').label('res').shape('circle')
  historyMemberChart.value.area().position('date*res').color('title').shape('smooth')
  historyMemberChart.value.render()
}

// 初始化信息 - 分批加载避免触发限流
const init = async () => {
  try {
    // 第一批：基础数据（优先级高）
    await Promise.all([
      getHomeData(),
      awaitTodo()
    ])
    
    // 延迟后加载第二批
    await new Promise(resolve => setTimeout(resolve, 200))
    await Promise.all([
      toHotGoods(),
      topHotShops()
    ])
    
    // 延迟后加载第三批：图表数据
    await new Promise(resolve => setTimeout(resolve, 300))
    await Promise.all([
      getPvChart(),
      initOrderChartList(),
      initHistoryMemberChartList()
    ])
  } catch (error) {
    console.error('初始化数据失败:', error)
  }
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
@import './home.scss';
</style>
