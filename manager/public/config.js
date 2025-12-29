var BASE = {
  /**
   * @description api请求基础路径
   * 开发环境：指向本地 MallEcoAPI 服务（端口 9000）
   * 生产环境：根据实际部署情况配置
   * 
   * 注意：MallEcoAPI 使用统一的服务，所有 API 都通过同一个端口 9000 访问
   * - 管理端API路径：/api/manager/xxx
   * - 通用API路径：/api/common/xxx
   * - 买家端API路径：/api/buyer/xxx
   * - 商家端API路径：/api/seller/xxx
   */
  API_DEV: {
    common: 'http://localhost:9000/api',
    buyer: 'http://localhost:9000/api',
    seller: 'http://localhost:9000/api',
    manager: 'http://localhost:9000/api'
  },
  API_PROD: {
    common: 'http://localhost:9000/api',
    buyer: 'http://localhost:9000/api',
    seller: 'http://localhost:9000/api',
    manager: 'http://localhost:9000/api'
  },
  /**
   * @description // 跳转买家端地址 pc端
   */
  PC_URL: 'https://pc-b2b2c.pickmall.cn',
  /**
   * @description  // 跳转买家端地址 wap端
   */
  WAP_URL: 'https://m-b2b2c.pickmall.cn',
  /**
   *  @description api请求基础路径前缀
   * 
   * 说明：
   * - MallEcoAPI 的控制器路径已经包含 /manager（如：@Controller('manager/passport')）
   * - 前端 API 调用时路径是 /passport/user/login（不包含 manager）
   * - managerUrl = BASE.API_DEV.manager + BASE.PREFIX
   * - 最终请求路径 = managerUrl + 前端API路径 = http://localhost:9000/api/manager + /passport/user/login
   * - 所以 PREFIX 应该是 '/manager'
   */
  PREFIX: '/manager'
}

