// 使用 Vite 的 glob 功能预加载所有视图文件
// 这样可以支持动态路径，同时满足 Vite 的静态分析要求
const modules = import.meta.glob('../views/**/*.vue')

/**
 * 路径映射表：将后端返回的 frontRoute 映射到实际的组件路径
 * 格式: { '后端路径': '实际组件路径' }
 * 注意：现在大部分页面使用自动生成，只有特殊页面需要映射
 */
const routeMap: Record<string, string> = {
  // ========== 错误页面 ==========
  'error-page/404': 'error-page/404',
  'error-page/403': 'error-page/403',
  'error-page/500': 'error-page/500',
  // ========== 会员模块 ==========
  'admin/member/list': 'member/member-list',
  'admin/member/recycle': 'member/member-recycle',
  'admin/member/reviews': 'member/member-review',
  'admin/member/points-history': 'member/points-history',
  'admin/member/funds': 'member/funds',
  'admin/member/recharge': 'member/recharge',
  'admin/member/withdraw': 'member/withdraw',
  // ========== 订单模块 ==========
  'admin/order/goods': 'order/goods-order',
  'admin/order/virtual': 'order/virtual-order',
  'admin/order/after-sale-manage': 'order/after-sale-manage',
  'admin/order/complaint': 'order/complaint',
  'admin/order/reason': 'order/reason',
  'admin/order/payment-record': 'order/payment-record',
  'admin/order/refund-flow': 'order/refund-flow',
  // ========== 商品模块 ==========
  'admin/goods/platform': 'goods/goods-list',
  'admin/goods/audit': 'goods/goods-audit',
  'admin/goods/category': 'goods/category',
  'admin/goods/brand': 'goods/brand',
  'admin/goods/spec': 'goods/spec',
  'admin/goods/unit': 'goods/unit',
  // ========== 促销模块 ==========
  'admin/promotion/coupon': 'promotion/coupon',
  'admin/promotion/full': 'promotion/full',
  'admin/promotion/seckill': 'promotion/seckill',
  'admin/promotion/group': 'promotion/group',
  // ========== 店铺模块 ==========
  'admin/shop/list': 'shop/shop-list',
  'admin/shop/audit': 'shop/shop-audit',
  'admin/shop/settlement-manage': 'shop/settlement-manage',
  'admin/shop/reconciliation': 'shop/reconciliation',
  // ========== 运营模块 ==========
  'admin/operate/pc': 'operate/pc',
  'admin/operate/mobile': 'operate/mobile',
  'admin/operate/hotwords': 'operate/hotwords',
  'admin/operate/article-category': 'operate/article-category',
  'admin/operate/article-manage': 'operate/article-manage',
  'admin/operate/feedback': 'operate/feedback',
  // ========== 公众号模块 ==========
  'admin/wechat/fans': 'wechat/fans',
  'admin/wechat/subscribe': 'wechat/subscribe',
  'admin/wechat/template': 'wechat/template',
  'admin/wechat/h5-pages': 'wechat/h5-pages',
  'admin/wechat/h5-template': 'wechat/h5-template',
  'admin/wechat/coupon-list': 'wechat/coupon-list',
  'admin/wechat/coupon-template': 'wechat/coupon-template',
  'admin/wechat/coupon-record': 'wechat/coupon-record',
  'admin/wechat/material-image': 'wechat/material-image',
  'admin/wechat/material-video': 'wechat/material-video',
  'admin/wechat/material-voice': 'wechat/material-voice',
  'admin/wechat/material-article': 'wechat/material-article',
  'admin/wechat/menu-config': 'wechat/menu-config',
  'admin/wechat/menu-keywords': 'wechat/menu-keywords',
  'admin/wechat/oauth-user': 'wechat/oauth-user',
  'admin/wechat/oauth-app': 'wechat/oauth-app',
  'admin/wechat/oauth-token': 'wechat/oauth-token',
  // ========== 直播模块 ==========
  'admin/live/room': 'live/room',
  'admin/live/goods': 'live/goods',
  'admin/live/statistics': 'live/statistics',
  // ========== 统计模块 ==========
  'admin/statistics/member': 'statistics/member',
  'admin/statistics/order': 'statistics/order',
  'admin/statistics/goods': 'statistics/goods',
  'admin/statistics/traffic': 'statistics/traffic',
  // ========== 设置模块 ==========
  'admin/settings/basic': 'settings/basic',
  'admin/settings/oss': 'settings/oss',
  'admin/settings/region': 'settings/region',
  'admin/settings/logistics': 'settings/logistics',
  'admin/settings/trust-login': 'settings/trust-login',
  'admin/settings/payment': 'settings/payment',
  'admin/settings/sensitive': 'settings/sensitive',
  'admin/settings/app': 'settings/app',
  'admin/settings/user-manage': 'settings/user-manage',
  'admin/settings/menu': 'settings/menu',
  'admin/settings/department': 'settings/department',
  'admin/settings/role': 'settings/role',
  // ========== 日志模块 ==========
  'admin/log/management': 'log/management',
}

/**
 * 智能匹配组件路径
 * @param frontRoute 后端返回的 frontRoute
 * @returns 匹配的组件加载函数或占位页面
 */
function findComponent(frontRoute: string): any {
  // 1. 首先检查映射表
  if (routeMap[frontRoute]) {
    const mappedPath = routeMap[frontRoute]
    // 如果是占位页面标记，返回占位页面
    if (mappedPath === 'placeholder') {
      console.warn(`⚠️ 路由 ${frontRoute} 标记为占位页面`)
      return () => import('../views/placeholder.vue')
    }
    // 否则查找对应的组件
    const fullPath = `../views/${mappedPath}.vue`
    const matched = Object.keys(modules).find(key => 
      key.replace(/\\/g, '/') === fullPath.replace(/\\/g, '/')
    )
    if (matched && modules[matched]) {
      return modules[matched]
    }
  }
  
  // 2. 尝试直接匹配
  const directPath = `../views/${frontRoute}.vue`
  const directMatch = Object.keys(modules).find(key => {
    const keyPath = key.replace(/\\/g, '/')
    const targetPath = directPath.replace(/\\/g, '/')
    return keyPath === targetPath
  })
  if (directMatch && modules[directMatch]) {
    return modules[directMatch]
  }
  
  // 3. 尝试模糊匹配（支持不同的路径格式）
  // 例如: admin/member/list -> member/member-list.vue
  // 或者: admin/member/management -> member/member-list.vue
  const parts = frontRoute.split('/')
  const fileName = parts[parts.length - 1] // 获取最后一部分作为文件名
  const moduleName = parts.length > 1 ? parts[parts.length - 2] : parts[0] // 模块名，如 member, goods
  
  // 构建可能的匹配模式
  const possiblePatterns = [
    `${moduleName}/${fileName}`, // member/list
    `${moduleName}/${moduleName}-${fileName}`, // member/member-list
    `${fileName}`, // list (仅文件名)
  ]
  
  // 尝试多种匹配方式
  let fuzzyMatches: string[] = []
  
  for (const pattern of possiblePatterns) {
    fuzzyMatches = Object.keys(modules).filter(key => {
      const keyPath = key.replace(/\\/g, '/').toLowerCase()
      const normalizedPattern = pattern.toLowerCase()
      // 匹配模式（包含路径和文件名）
      return keyPath.includes(normalizedPattern) && keyPath.endsWith('.vue')
    })
    
    if (fuzzyMatches.length > 0) {
      break
    }
  }
  
  if (fuzzyMatches.length > 0) {
    // 优先选择路径最相似的（优先匹配 moduleName-xxx-list 格式）
    const bestMatch = fuzzyMatches.find(key => {
      const keyPath = key.replace(/\\/g, '/')
      const keyParts = keyPath.split('/').map(p => p.replace('.vue', ''))
      const fileNameLower = fileName.toLowerCase()
      const moduleNameLower = moduleName.toLowerCase()
      
      // 优先匹配包含模块名和列表的文件
      return keyParts.some(part => {
        const partLower = part.toLowerCase()
        return (
          partLower === `${moduleNameLower}-${fileNameLower}` || 
          partLower === `${moduleNameLower}-list` ||
          (partLower.includes(moduleNameLower) && partLower.includes(fileNameLower)) ||
          partLower === fileNameLower
        )
      })
    }) || fuzzyMatches[0]
    
    if (modules[bestMatch]) {
      // 检查匹配是否合理：避免匹配到完全不相关的组件
      const keyPath = bestMatch.replace(/\\/g, '/')
      const keyParts = keyPath.split('/').map(p => p.replace('.vue', '').toLowerCase())
      const fileNameLower = fileName.toLowerCase()
      const moduleNameLower = moduleName.toLowerCase()
      
      // 如果匹配的组件路径中不包含模块名或文件名，可能是误匹配
      const isReasonable = keyParts.some(part => 
        part.includes(moduleNameLower) || part.includes(fileNameLower)
      )
      
      if (isReasonable) {
        console.log(`✅ 模糊匹配成功: ${frontRoute} -> ${bestMatch}`)
        return modules[bestMatch]
      } else {
        console.warn(`⚠️ 模糊匹配结果不合理，跳过: ${frontRoute} -> ${bestMatch}`)
      }
    }
  }
  
  // 4. 如果都找不到，返回占位页面
  console.warn(`⚠️ 未找到页面组件: ${frontRoute}，请创建对应的页面文件`)
  console.warn(`  建议路径: src/views/${frontRoute.replace(/^admin\//, '')}.vue`)
  return () => import('../views/placeholder.vue')
}

/**
 * 动态加载组件
 * @param url 组件路径，例如: 'goods/goods-list' 或 'admin/member/list'
 * @returns 组件加载函数
 */
export default (url: string): any => {
  if (!url) {
    return () => import('../views/placeholder.vue')
  }
  
  return findComponent(url)
}
