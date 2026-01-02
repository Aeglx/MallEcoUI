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
  // 卖家端的路由映射会根据实际API返回的菜单数据来配置
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
    if (mappedPath === 'placeholder') {
      console.warn(`⚠️ 路由 ${frontRoute} 标记为占位页面`)
      return () => import('../views/placeholder.vue')
    }
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
  
  // 3. 尝试模糊匹配
  const parts = frontRoute.split('/')
  const fileName = parts[parts.length - 1]
  const moduleName = parts.length > 1 ? parts[parts.length - 2] : parts[0]
  
  const possiblePatterns = [
    `${moduleName}/${fileName}`,
    `${moduleName}/${moduleName}-${fileName}`,
    `${fileName}`,
  ]
  
  let fuzzyMatches: string[] = []
  
  for (const pattern of possiblePatterns) {
    fuzzyMatches = Object.keys(modules).filter(key => {
      const keyPath = key.replace(/\\/g, '/').toLowerCase()
      const normalizedPattern = pattern.toLowerCase()
      return keyPath.includes(normalizedPattern) && keyPath.endsWith('.vue')
    })
    
    if (fuzzyMatches.length > 0) {
      break
    }
  }
  
  if (fuzzyMatches.length > 0) {
    const bestMatch = fuzzyMatches.find(key => {
      const keyPath = key.replace(/\\/g, '/')
      const keyParts = keyPath.split('/').map(p => p.replace('.vue', ''))
      const fileNameLower = fileName.toLowerCase()
      const moduleNameLower = moduleName.toLowerCase()
      
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
      const keyPath = bestMatch.replace(/\\/g, '/')
      const keyParts = keyPath.split('/').map(p => p.replace('.vue', '').toLowerCase())
      const fileNameLower = fileName.toLowerCase()
      const moduleNameLower = moduleName.toLowerCase()
      
      const isReasonable = keyParts.some(part => 
        part.includes(moduleNameLower) || part.includes(fileNameLower)
      )
      
      if (isReasonable) {
        console.log(`✅ 模糊匹配成功: ${frontRoute} -> ${bestMatch}`)
        return modules[bestMatch]
      }
    }
  }
  
  // 4. 如果都找不到，返回占位页面
  console.warn(`⚠️ 未找到页面组件: ${frontRoute}，请创建对应的页面文件`)
  return () => import('../views/placeholder.vue')
}

/**
 * 动态加载组件
 * @param url 组件路径，例如: 'goods/goods-list' 或 'store/goods/list'
 * @returns 组件加载函数
 */
export default (url: string): any => {
  if (!url) {
    return () => import('../views/placeholder.vue')
  }
  
  return findComponent(url)
}

