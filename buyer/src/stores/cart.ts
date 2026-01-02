import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartCount, cartGoodsAll } from '@/api/cart'
import storage from '@/utils/storage'

export const useCartStore = defineStore('cart', () => {
  const cartNum = ref<number>(0)
  const cartList = ref<any[]>([])

  // 初始化购物车数量
  const initCartNum = () => {
    const storedNum = storage.getItem('cartNum')
    if (storedNum) {
      cartNum.value = parseInt(storedNum, 10) || 0
    }
  }

  // 获取购物车数量
  const fetchCartCount = async () => {
    try {
      const res = await cartCount()
      const data = res.data || res
      if (data.success && data.result !== undefined) {
        cartNum.value = data.result
        storage.setItem('cartNum', cartNum.value.toString())
      }
    } catch (error) {
      console.error('获取购物车数量失败:', error)
    }
  }

  // 获取购物车列表
  const fetchCartList = async () => {
    try {
      const res = await cartGoodsAll()
      const data = res.data || res
      if (data.success && data.result) {
        cartList.value = data.result.skuList || []
        cartNum.value = cartList.value.length
        storage.setItem('cartNum', cartNum.value.toString())
      }
    } catch (error) {
      console.error('获取购物车列表失败:', error)
    }
  }

  // 设置购物车数量
  const setCartNum = (num: number) => {
    cartNum.value = num
    storage.setItem('cartNum', num.toString())
  }

  // 增加购物车数量
  const increaseCartNum = (num: number = 1) => {
    cartNum.value += num
    storage.setItem('cartNum', cartNum.value.toString())
  }

  // 减少购物车数量
  const decreaseCartNum = (num: number = 1) => {
    cartNum.value = Math.max(0, cartNum.value - num)
    storage.setItem('cartNum', cartNum.value.toString())
  }

  // 清空购物车
  const clearCart = () => {
    cartNum.value = 0
    cartList.value = []
    storage.removeItem('cartNum')
  }

  // 初始化
  initCartNum()

  return {
    cartNum,
    cartList,
    fetchCartCount,
    fetchCartList,
    setCartNum,
    increaseCartNum,
    decreaseCartNum,
    clearCart
  }
})

