# MallEco 移动端 - UniApp 项目

[![UniApp](https://img.shields.io/badge/UniApp-2.0-blue.svg)](https://uniapp.dcloud.io/)
[![Vue](https://img.shields.io/badge/Vue-3.4.0-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![UView](https://img.shields.io/badge/UView-2.0-orange.svg)](https://www.uviewui.com/)

> 📱 **项目状态**: 规划中 - 即将开发  
> 🚀 **目标平台**: H5、微信小程序、支付宝小程序、App

## 📋 项目简介

MallEco 移动端是基于 UniApp 框架开发的跨平台移动应用，为用户提供完整的电商购物体验。支持多端发布，覆盖H5、微信小程序、支付宝小程序以及原生App平台。

## 🎯 核心功能

### 用户端功能
- **商品浏览**: 商品列表、详情、搜索、筛选
- **购物车**: 商品添加、数量管理、批量操作
- **订单管理**: 下单、支付、订单跟踪、售后申请
- **用户中心**: 个人资料、地址管理、收藏夹、积分
- **支付功能**: 微信支付、支付宝支付、银行卡支付
- **营销活动**: 优惠券、秒杀、团购、积分兑换

### 直播功能
- **直播间**: 商品展示、实时互动、购买引导
- **商品推荐**: 直播商品快速购买
- **互动功能**: 点赞、评论、分享、关注

### 社交功能
- **商品评价**: 图文评价、视频评价、追评
- **晒单分享**: 买家秀展示、社区互动
- **好友推荐**: 好友商品分享、推荐

## 🛠️ 技术栈

### 核心框架
- **UniApp 2.0** - 跨平台开发框架
- **Vue 3.4.0** - 渐进式 JavaScript 框架
- **TypeScript 5.3.3** - 类型安全的 JavaScript

### UI 组件库
- **UView Plus 2.0** - 基于 Vue3 的 UI 组件库
- **自定义组件** - 电商专用组件库

### 状态管理
- **Pinia** - Vue 状态管理
- **uni.setStorageSync** - 本地存储

### 开发工具
- **HBuilderX** - UniApp 专用IDE
- **Vue Devtools** - Vue 调试工具
- **TypeScript** - 类型检查

## 📱 平台支持

| 平台 | 支持状态 | 备注 |
|------|----------|------|
| H5 | ✅ 完全支持 | 移动端浏览器访问 |
| 微信小程序 | ✅ 完全支持 | 微信内嵌浏览器 |
| 支付宝小程序 | ✅ 完全支持 | 支付宝内嵌浏览器 |
| App (Android/iOS) | ✅ 完全支持 | 原生App打包 |

## 📁 预期项目结构

```
uniapp/
├── pages/                    # 页面目录
│   ├── index/               # 首页
│   ├── goods/               # 商品相关
│   │   ├── list.vue         # 商品列表
│   │   ├── detail.vue       # 商品详情
│   │   ├── search.vue       # 搜索页面
│   │   └── category.vue     # 商品分类
│   ├── cart/                # 购物车
│   ├── order/               # 订单相关
│   │   ├── confirm.vue      # 确认订单
│   │   ├── list.vue         # 订单列表
│   │   └── detail.vue       # 订单详情
│   ├── user/                # 用户中心
│   │   ├── profile.vue      # 个人资料
│   │   ├── address.vue      # 地址管理
│   │   ├── favorites.vue    # 收藏夹
│   │   └── points.vue       # 积分中心
│   ├── live/                # 直播相关
│   │   ├── list.vue         # 直播间列表
│   │   ├── room.vue         # 直播间
│   │   └── player.vue       # 播放器
│   ├── promotion/           # 营销活动
│   │   ├── coupon.vue       # 优惠券
│   │   ├── seckill.vue      # 秒杀
│   │   └── group.vue        # 团购
│   └── auth/                # 认证相关
│       ├── login.vue        # 登录
│       ├── register.vue     # 注册
│       └── reset.vue        # 密码重置
├── components/              # 组件目录
│   ├── common/              # 通用组件
│   │   ├── goods-card.vue   # 商品卡片
│   │   ├── price-display.vue # 价格显示
│   │   ├── rating-star.vue  # 评分星级
│   │   └── lazy-image.vue   # 懒加载图片
│   ├── goods/               # 商品相关组件
│   │   ├── goods-sku.vue    # 商品规格选择
│   │   ├── goods-gallery.vue # 商品画廊
│   │   └── goods-specs.vue  # 商品规格
│   ├── cart/                # 购物车组件
│   │   ├── cart-item.vue    # 购物车项
│   │   └── cart-toolbar.vue # 购物车工具栏
│   └── user/                # 用户相关组件
│       ├── user-avatar.vue  # 用户头像
│       └── menu-item.vue    # 菜单项
├── static/                  # 静态资源
│   ├── images/              # 图片资源
│   ├── icons/               # 图标资源
│   └── fonts/               # 字体文件
├── stores/                  # Pinia 状态管理
│   ├── user.ts              # 用户状态
│   ├── cart.ts              # 购物车状态
│   ├── goods.ts             # 商品状态
│   └── app.ts               # 应用状态
├── utils/                   # 工具函数
│   ├── api.ts               # API 请求封装
│   ├── auth.ts              # 认证相关工具
│   ├── storage.ts           # 存储工具
│   ├── format.ts            # 格式化工具
│   └── platform.ts          # 平台检测
├── api/                     # API 接口
│   ├── user.ts              # 用户相关API
│   ├── goods.ts             # 商品相关API
│   ├── order.ts             # 订单相关API
│   ├── cart.ts              # 购物车相关API
│   ├── payment.ts           # 支付相关API
│   └── promotion.ts         # 营销相关API
├── manifest.json            # 应用配置
├── pages.json              # 页面配置
├── uni.scss               # 全局样式
├── App.vue                # 应用入口
└── main.ts               # 主入口文件
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- HBuilderX >= 3.8.0 (推荐) 或 Vue CLI
- 微信开发者工具 (开发微信小程序)
- 支付宝开发者工具 (开发支付宝小程序)

### 安装依赖

```bash
# 使用 HBuilderX
# 1. 下载项目到本地
# 2. 用 HBuilderX 打开项目
# 3. 点击 工具 -> 安装插件 -> npm

# 或使用命令行
npm install

# 安装 uni-app 相关依赖
npm install @dcloudio/uni-app
npm install @dcloudio/uni-ui
```

### 开发运行

```bash
# H5 开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin

# 支付宝小程序开发
npm run dev:mp-alipay

# App 开发
npm run dev:app
```

### 构建发布

```bash
# 构建 H5
npm run build:h5

# 构建微信小程序
npm run build:mp-weixin

# 构建支付宝小程序
npm run build:mp-alipay

# 构建 App
npm run build:app
```

## 🎨 设计规范

### 设计理念
- **简洁明了**: 界面简洁，操作直观
- **快速响应**: 优化加载速度，提升用户体验
- **一致性**: 统一的视觉语言和交互模式
- **可访问性**: 支持不同设备和用户群体

### 色彩规范
- **主色调**: #007AFF (品牌蓝)
- **辅助色**: #FF6B35 (活力橙)
- **成功色**: #52C41A (成功绿)
- **警告色**: #FAAD14 (警告黄)
- **错误色**: #FF4D4F (错误红)
- **中性色**: #F5F5F5 (背景灰)

### 字体规范
- **主字体**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **数字字体**: 'SF Pro Display', 'SF Pro Text'
- **字体大小**: 12px, 14px, 16px, 18px, 20px, 24px

## 🔧 开发规范

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint + Prettier 代码规范
- 组件采用 PascalCase 命名
- 文件采用 kebab-case 命名
- 使用 Composition API

### 目录规范
- 页面组件放在 `pages/` 目录下
- 公共组件放在 `components/` 目录下
- 工具函数放在 `utils/` 目录下
- API 接口放在 `api/` 目录下
- 状态管理放在 `stores/` 目录下

### 样式规范
- 使用 SCSS 预处理器
- 采用 BEM 命名规范
- 移动端优先的响应式设计
- 支持深色模式

## 📱 页面规划

### 核心页面
1. **首页** - 商品推荐、分类导航、促销活动
2. **分类页** - 商品分类、筛选排序
3. **商品详情** - 商品信息、规格选择、购买
4. **购物车** - 商品管理、结算
5. **订单确认** - 订单信息、地址选择、支付
6. **用户中心** - 个人信息、订单管理
7. **登录注册** - 用户认证

### 扩展页面
1. **直播页面** - 直播间、商品展示
2. **营销活动** - 优惠券、秒杀、团购
3. **个人中心** - 收藏、地址、设置
4. **帮助中心** - 客服、FAQ、意见反馈

## 🔒 安全考虑

### 数据安全
- 用户敏感信息加密存储
- API 接口签名验证
- HTTPS 强制使用
- 本地存储敏感数据加密

### 支付安全
- 集成官方支付SDK
- 支付结果验证
- 订单状态同步
- 异常订单监控

## 🚀 性能优化

### 加载优化
- 图片懒加载和压缩
- 组件按需加载
- 代码分割和缓存
- CDN 资源优化

### 运行优化
- 列表虚拟滚动
- 图片预加载
- 内存管理优化
- 电池使用优化

## 📊 监控分析

### 用户行为分析
- 页面访问统计
- 用户操作路径
- 转化率分析
- 性能监控

### 错误监控
- JavaScript 错误捕获
- API 请求失败监控
- 性能指标监控
- 用户反馈收集

## 🛣️ 开发计划

### Phase 1: 基础功能 (计划中)
- [ ] 项目初始化和基础框架搭建
- [ ] 用户认证系统 (登录/注册)
- [ ] 商品浏览功能 (列表/详情/搜索)
- [ ] 购物车功能

### Phase 2: 交易功能 (计划中)
- [ ] 订单管理系统
- [ ] 支付集成 (微信/支付宝)
- [ ] 用户中心功能
- [ ] 地址管理

### Phase 3: 营销功能 (计划中)
- [ ] 优惠券系统
- [ ] 秒杀活动
- [ ] 团购功能
- [ ] 积分系统

### Phase 4: 高级功能 (计划中)
- [ ] 直播功能
- [ ] 社交功能
- [ ] 个性化推荐
- [ ] 数据分析

## 📄 许可证

本项目采用 MIT 许可证。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 📞 联系方式

- 项目地址: [https://github.com/Aeglx/MallEcoUI](https://github.com/Aeglx/MallEcoUI)
- 问题反馈: [GitHub Issues](https://github.com/Aeglx/MallEcoUI/issues)

---

**MallEco Team** © 2025 | **移动端项目** - 规划中 🚀