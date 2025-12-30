var BASE = {
  /**
   * @description api请求基础路径
   * 开发环境：指向本地 MallEcoAPI 服务（端口 9000）
   * 生产环境：根据实际部署情况配置
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
   * @description 跳转买家端地址 pc端
   */
  PC_URL: 'https://pc-b2b2c.pickmall.cn',
  /**
   * @description 跳转买家端地址 wap端
   */
  WAP_URL: 'https://m-b2b2c.pickmall.cn',
  PREFIX: ''
}

