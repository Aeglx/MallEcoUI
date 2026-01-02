<template>
  <div class="pay">
    <Header />
    <div class="pay-container width_1200">
      <el-steps :active="payStep" finish-status="success" align-center>
        <el-step title="提交订单" />
        <el-step title="选择支付方式" />
        <el-step title="完成支付" />
      </el-steps>

      <!-- 订单信息 -->
      <div class="order-info" v-if="orderInfo">
        <h3>订单信息</h3>
        <div class="order-detail">
          <p>订单号：{{ orderInfo.orderSn || orderInfo.id }}</p>
          <p>订单金额：<span class="price">¥{{ orderInfo.flowPrice || orderInfo.totalAmount }}</span></p>
          <p>创建时间：{{ formatTime(orderInfo.createTime) }}</p>
        </div>
      </div>

      <!-- 支付方式选择 -->
      <div class="payment-methods" v-if="payStep === 1">
        <h3>选择支付方式</h3>
        <div class="methods-list">
          <div
            v-for="method in paymentMethods"
            :key="method.code"
            class="method-item"
            :class="{ active: selectedPaymentMethod === method.code }"
            @click="selectPaymentMethod(method.code)"
          >
            <div class="method-icon">
              <img
                v-if="method.code === 'WECHAT'"
                src="https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png"
                alt="微信支付"
              />
              <img
                v-else-if="method.code === 'ALIPAY'"
                src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                alt="支付宝"
              />
              <el-icon v-else><CreditCard /></el-icon>
            </div>
            <span class="method-name">{{ method.name }}</span>
            <el-icon v-if="selectedPaymentMethod === method.code" class="check-icon">
              <Check />
            </el-icon>
          </div>
        </div>
        <div class="pay-action">
          <el-button type="primary" size="large" @click="handlePay" :loading="paying">
            立即支付
          </el-button>
        </div>
      </div>

      <!-- 支付中/支付成功 -->
      <div class="pay-result" v-if="payStep === 2">
        <el-result
          :icon="payStatus === 'success' ? 'success' : 'warning'"
          :title="payStatus === 'success' ? '支付成功' : '支付处理中'"
          :sub-title="
            payStatus === 'success'
              ? '订单支付成功，我们将尽快为您发货'
              : '订单已提交，请完成支付'
          "
        >
          <template #extra>
            <el-button type="primary" @click="goToOrder">查看订单</el-button>
            <el-button @click="goHome">返回首页</el-button>
          </template>
        </el-result>
      </div>

      <!-- 支付表单（隐藏，用于支付宝PC支付） -->
      <div v-if="payFormHtml" v-html="payFormHtml" ref="payFormRef" style="display: none"></div>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CreditCard, Check } from '@element-plus/icons-vue'
import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer.vue'
import { createPayment, pay, queryPayment, getPaymentMethods } from '@/api/payment'
import { getOrderDetail } from '@/api/order'

const router = useRouter()
const route = useRoute()

const payStep = ref<number>(1) // 0: 提交订单, 1: 选择支付方式, 2: 完成支付
const orderInfo = ref<any>(null)
const paymentMethods = ref<any[]>([])
const selectedPaymentMethod = ref<string>('')
const paying = ref<boolean>(false)
const payStatus = ref<'success' | 'pending' | 'failed'>('pending')
const payFormHtml = ref<string>('')
const payFormRef = ref<HTMLElement>()

// 格式化时间
const formatTime = (time: string | Date) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

// 加载订单信息
const loadOrderInfo = async (orderId: string) => {
  try {
    const res = await getOrderDetail(orderId)
    const data = res.data || res
    if (data.success && data.result) {
      orderInfo.value = data.result
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取订单信息失败')
  }
}

// 加载支付方式
const loadPaymentMethods = async () => {
  try {
    const res = await getPaymentMethods()
    const data = res.data || res
    if (data.success && data.result) {
      paymentMethods.value = data.result.filter((m: any) => m.status === 1) // 只显示启用的支付方式
      if (paymentMethods.value.length > 0) {
        selectedPaymentMethod.value = paymentMethods.value[0].code
      }
    }
  } catch (error: any) {
    console.error('加载支付方式失败:', error)
  }
}

// 选择支付方式
const selectPaymentMethod = (methodCode: string) => {
  selectedPaymentMethod.value = methodCode
}

// 处理支付
const handlePay = async () => {
  if (!selectedPaymentMethod.value) {
    ElMessage.warning('请选择支付方式')
    return
  }

  if (!orderInfo.value) {
    ElMessage.error('订单信息不存在')
    return
  }

  paying.value = true

  try {
    // 1. 创建支付订单
    const orderId = orderInfo.value.orderSn || orderInfo.value.id
    const amount = orderInfo.value.flowPrice || orderInfo.value.totalAmount

    const createRes = await createPayment({
      orderId: orderId,
      paymentMethod: selectedPaymentMethod.value,
      paymentClient: 'pc', // PC端支付
      amount: amount,
      subject: `订单支付-${orderId}`,
      body: `订单支付-${orderId}`,
      returnUrl: `${window.location.origin}/pay?orderId=${orderId}`
    })

    const createData = createRes.data || createRes
    if (!createData.success) {
      throw new Error(createData.message || '创建支付订单失败')
    }

    const { outTradeNo } = createData.result

    // 2. 调用支付接口
    const payRes = await pay(selectedPaymentMethod.value, 'pc', {
      outTradeNo: outTradeNo
    })

    const payData = payRes.data || payRes
    if (!payData.success) {
      throw new Error(payData.message || '调用支付接口失败')
    }

    const paymentResult = payData.result

    // 3. 根据支付方式处理
    if (selectedPaymentMethod.value === 'ALIPAY') {
      // 支付宝PC支付 - 返回表单HTML，自动提交
      if (paymentResult.form) {
        payFormHtml.value = paymentResult.form
        await nextTick()
        if (payFormRef.value) {
          const form = payFormRef.value.querySelector('form')
          if (form) {
            form.submit()
          }
        }
      } else if (paymentResult.paymentUrl) {
        // 支付宝H5支付 - 跳转URL
        window.location.href = paymentResult.paymentUrl
      }
    } else if (selectedPaymentMethod.value === 'WECHAT') {
      // 微信支付 - 显示二维码或跳转
      if (paymentResult.codeUrl) {
        // PC端显示二维码
        ElMessage.info('请使用微信扫描二维码完成支付')
        // TODO: 显示二维码弹窗
        // 轮询查询支付状态
        startPollingPayment(outTradeNo)
      } else if (paymentResult.paymentUrl) {
        // H5支付跳转
        window.location.href = paymentResult.paymentUrl
      }
    } else {
      // 其他支付方式
      ElMessage.info('支付方式暂不支持，请选择其他方式')
      paying.value = false
    }
  } catch (error: any) {
    ElMessage.error(error.message || '支付失败，请重试')
    paying.value = false
  }
}

// 轮询查询支付状态
const startPollingPayment = (outTradeNo: string) => {
  const interval = setInterval(async () => {
    try {
      const res = await queryPayment(outTradeNo)
      const data = res.data || res
      if (data.success && data.result) {
        const status = data.result.status
        if (status === 'SUCCESS' || status === 1) {
          clearInterval(interval)
          payStatus.value = 'success'
          payStep.value = 2
          paying.value = false
          ElMessage.success('支付成功')
        } else if (status === 'CLOSED' || status === -1) {
          clearInterval(interval)
          paying.value = false
          ElMessage.warning('支付已关闭')
        }
      }
    } catch (error) {
      console.error('查询支付状态失败:', error)
    }
  }, 3000) // 每3秒查询一次

  // 30秒后停止轮询
  setTimeout(() => {
    clearInterval(interval)
    if (paying.value) {
      paying.value = false
      ElMessage.warning('支付超时，请重新支付')
    }
  }, 30000)
}

// 查看订单
const goToOrder = () => {
  router.push('/home/MyOrder')
}

// 返回首页
const goHome = () => {
  router.push('/')
}

onMounted(async () => {
  // 从路由获取订单ID
  const orderId = route.query.orderId as string
  if (orderId) {
    await loadOrderInfo(orderId)
  } else {
    ElMessage.error('订单ID不存在')
    router.push('/')
    return
  }

  // 加载支付方式
  await loadPaymentMethods()

  // 检查是否是从支付回调返回
  if (route.query.status === 'success') {
    payStatus.value = 'success'
    payStep.value = 2
  }
})
</script>

<style scoped lang="scss">
.pay {
  min-height: 100vh;
  background: #f5f5f5;
}

.width_1200 {
  width: 1200px;
  margin: 0 auto;
}

.pay-container {
  background: #fff;
  padding: 30px;
  margin: 20px auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-info {
  margin-top: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;

  h3 {
    margin-bottom: 15px;
    font-size: 18px;
    color: #333;
  }

  .order-detail {
    p {
      margin: 10px 0;
      font-size: 14px;
      color: #666;

      .price {
        font-size: 20px;
        color: #f31947;
        font-weight: bold;
      }
    }
  }
}

.payment-methods {
  margin-top: 30px;

  h3 {
    margin-bottom: 20px;
    font-size: 18px;
    color: #333;
  }

  .methods-list {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;

    .method-item {
      flex: 1;
      padding: 20px;
      border: 2px solid #e4e7ed;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      &:hover {
        border-color: #f31947;
      }

      &.active {
        border-color: #f31947;
        background: #fef0f0;
      }

      .method-icon {
        width: 60px;
        height: 60px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .el-icon {
          font-size: 40px;
          color: #909399;
        }
      }

      .method-name {
        font-size: 14px;
        color: #333;
      }

      .check-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        color: #f31947;
        font-size: 20px;
      }
    }
  }

  .pay-action {
    text-align: center;
    padding: 20px 0;
  }
}

.pay-result {
  margin-top: 30px;
}
</style>
