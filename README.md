# MallEco 电商管理系统

[![Vue](https://img.shields.io/badge/Vue-3.4.0-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-purple.svg)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.4.4-blue.svg)](https://element-plus.org/)

MallEco 是一个现代化的电商管理系统，提供完整的电商业务管理功能。

## 📋 项目简介

MallEco 是一个现代化的电商生态系统，包含多个子项目：
- **管理端** - 基于 Vue3 + TypeScript 构建的管理后台
- **移动端** - 基于 UniApp 的跨平台移动应用
- **商家端** - 为商家提供店铺管理解决方案
- **买家端** - 面向消费者的购物平台
- **即时通讯** - 实时通讯系统，连接买家、卖家和管理员

整个系统提供完整的电商业务管理功能，包含商品管理、会员管理、订单管理、营销推广、统计分析等。

## 🚀 技术栈

### 前端技术
- **Vue 3.4.0** - 渐进式 JavaScript 框架
- **TypeScript 5.3.3** - 类型安全的 JavaScript
- **Vite 5.0.8** - 下一代前端构建工具
- **Element Plus 2.4.4** - 基于 Vue 3 的组件库
- **Pinia** - Vue 状态管理
- **Vue Router 4.2.5** - Vue.js 官方路由
- **Vue i18n 9.8.0** - 国际化支持

### 开发工具
- **Vue-tsc** - TypeScript 编译器
- **Sass/SCSS** - CSS 预处理器
- **ESLint** - 代码检查
- **Auto Import** - 自动导入组件和API

## 📁 项目结构

```
MallEcoWeb/
├── manager/                 # 管理端前端项目 (已开发)
│   ├── public/             # 公共资源
│   │   └── config.js       # 配置文件
│   ├── src/                # 源代码
│   │   ├── api/            # API 接口
│   │   │   ├── after-sale.ts    # 售后接口
│   │   │   ├── common.ts        # 通用接口
│   │   │   ├── goods.ts         # 商品接口
│   │   │   ├── live.ts          # 直播接口
│   │   │   ├── log.ts           # 日志接口
│   │   │   ├── member.ts        # 会员接口
│   │   │   ├── operate.ts       # 运营接口
│   │   │   ├── order.ts         # 订单接口
│   │   │   ├── promotion.ts     # 营销接口
│   │   │   ├── rbac.ts          # 权限接口
│   │   │   ├── setting.ts       # 设置接口
│   │   │   ├── shop.ts          # 店铺接口
│   │   │   ├── statistics.ts    # 统计接口
│   │   │   ├── wallet.ts        # 钱包接口
│   │   │   └── wechat.ts        # 微信接口
│   │   ├── assets/          # 静态资源
│   │   │   ├── background.png   # 背景图片
│   │   │   └── logo.png         # Logo
│   │   ├── components/      # 公共组件
│   │   │   ├── malleco/         # 自定义组件库
│   │   │   │   ├── circle-loading.vue    # 圆形加载
│   │   │   │   ├── config-drawer.vue     # 配置抽屉
│   │   │   │   ├── enhanced-form.vue     # 增强表单
│   │   │   │   ├── enhanced-table.vue    # 增强表格
│   │   │   │   ├── file-upload.vue       # 文件上传
│   │   │   │   ├── image-upload.vue      # 图片上传
│   │   │   │   └── rich-text-editor.vue  # 富文本编辑器
│   │   │   └── malleco-dialog/   # 对话框组件
│   │   ├── config/          # 配置文件
│   │   ├── libs/            # 工具库
│   │   │   ├── axios.ts          # HTTP客户端
│   │   │   ├── lazyLoading.ts    # 懒加载
│   │   │   ├── storage.ts        # 存储工具
│   │   │   └── util.ts           # 通用工具
│   │   ├── locale/          # 国际化
│   │   ├── router/          # 路由配置
│   │   ├── stores/          # Pinia状态管理
│   │   ├── styles/          # 样式文件
│   │   ├── types/           # TypeScript类型定义
│   │   ├── utils/           # 工具函数
│   │   ├── views/           # 页面组件
│   │   │   ├── change-password/     # 修改密码
│   │   │   ├── error-page/         # 错误页面
│   │   │   ├── external-link/      # 外部链接
│   │   │   ├── goods/              # 商品管理
│   │   │   ├── home/               # 首页
│   │   │   ├── live/               # 直播管理
│   │   │   ├── log/                # 日志管理
│   │   │   ├── main-parts/         # 主体部件
│   │   │   ├── member/             # 会员管理
│   │   │   ├── operate/            # 运营管理
│   │   │   ├── order/              # 订单管理
│   │   │   ├── personal-center/    # 个人中心
│   │   │   ├── promotion/          # 营销推广
│   │   │   ├── settings/           # 系统设置
│   │   │   ├── shop/               # 店铺管理
│   │   │   ├── statistics/         # 统计分析
│   │   │   ├── wechat/             # 微信管理
│   │   │   ├── Main.vue            # 主布局
│   │   │   └── login.vue           # 登录页面
│   │   ├── App.vue             # 根组件
│   │   └── main.ts             # 入口文件
│   ├── package.json           # 依赖配置
│   ├── vite.config.ts         # Vite配置
│   ├── tsconfig.json          # TypeScript配置
│   └── auto-imports.d.ts      # 自动导入声明
├── uniapp/                  # 移动端项目 (规划中)
│   ├── public/              # 静态资源
│   ├── src/                 # 源代码
│   │   ├── api/             # API接口
│   │   ├── components/      # 公共组件
│   │   ├── pages/           # 页面组件
│   │   ├── static/          # 静态资源
│   │   ├── store/           # 状态管理
│   │   ├── styles/          # 样式文件
│   │   ├── uni_modules/     # UniApp模块
│   │   └── main.ts          # 入口文件
│   ├── manifest.json        # 应用配置
│   ├── pages.json           # 页面配置
│   └── uni.scss            # 全局样式
├── seller/                  # 商家端项目 (规划中)
│   ├── public/              # 静态资源
│   ├── src/                 # 源代码
│   │   ├── api/             # API接口
│   │   ├── components/      # 公共组件
│   │   ├── layouts/         # 布局组件
│   │   ├── pages/           # 页面组件
│   │   │   ├── dashboard/   # 仪表盘
│   │   │   ├── product/     # 商品管理
│   │   │   ├── order/       # 订单管理
│   │   │   ├── finance/     # 财务管理
│   │   │   ├── shop/        # 店铺管理
│   │   │   └── analytics/   # 数据分析
│   │   ├── router/          # 路由配置
│   │   ├── store/           # 状态管理
│   │   ├── styles/          # 全局样式
│   │   ├── types/           # 类型定义
│   │   ├── utils/           # 工具函数
│   │   └── main.ts          # 应用入口
│   ├── .env                 # 环境变量
│   ├── index.html           # HTML模板
│   ├── package.json         # 项目配置
│   ├── tsconfig.json        # TypeScript配置
│   └── vite.config.ts       # Vite配置
├── buyer/                   # 买家端项目 (规划中)
│   ├── public/              # 静态资源
│   │   ├── favicon.ico      # 网站图标
│   │   └── images/          # 图片资源
│   ├── src/                 # 源代码
│   │   ├── api/             # API接口
│   │   ├── components/      # 公共组件
│   │   ├── pages/           # 页面组件
│   │   │   ├── Home/        # 首页
│   │   │   ├── Category/    # 商品分类
│   │   │   ├── Product/     # 商品详情
│   │   │   ├── Cart/        # 购物车
│   │   │   ├── Order/       # 订单相关
│   │   │   ├── Profile/     # 个人中心
│   │   │   └── Auth/        # 认证相关
│   │   ├── router/          # 路由配置
│   │   ├── store/           # 状态管理
│   │   ├── styles/          # 样式文件
│   │   ├── utils/           # 工具函数
│   │   ├── types/           # 类型定义
│   │   ├── hooks/           # 自定义Hooks
│   │   └── main.ts          # 应用入口
│   ├── .env                 # 环境变量
│   ├── index.html           # HTML模板
│   ├── package.json         # 项目配置
│   ├── tsconfig.json        # TypeScript配置
│   └── vite.config.ts       # Vite配置
├── im/                      # 即时通讯系统 (规划中)
│   ├── client/              # 前端代码
│   │   ├── public/          # 静态资源
│   │   ├── src/             # 源代码
│   │   │   ├── api/         # API接口
│   │   │   ├── components/  # 公共组件
│   │   │   ├── pages/       # 页面组件
│   │   │   ├── store/       # 状态管理
│   │   │   ├── services/    # 通讯服务
│   │   │   ├── utils/       # 工具函数
│   │   │   └── types/       # 类型定义
│   │   └── package.json     # 前端依赖
│   ├── server/              # 后端代码
│   │   ├── controllers/     # 控制器
│   │   ├── middleware/      # 中间件
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   ├── services/        # 业务逻辑
│   │   ├── socket/          # WebSocket处理
│   │   └── utils/           # 工具函数
│   ├── docs/                # 文档
│   └── docker/              # Docker配置
├── .gitignore               # Git忽略文件
└── README.md                # 项目说明
```

## 🛠️ 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm 或 yarn

### 安装依赖

```bash
# 进入管理端项目目录
cd manager

# 安装依赖
npm install

# 或使用 yarn
yarn install
```

### 开发运行

```bash
# 启动开发服务器
npm run dev

# 访问地址
http://localhost:5173
```

### 构建生产

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 📦 功能模块

### 商品管理
- 商品列表、分类、品牌、规格、单位管理
- 商品审核、批量操作
- 商品图片、视频上传

### 会员管理
- 会员列表、审核、回收站
- 会员资金、积分、充值、提现
- 会员数据统计

### 订单管理
- 商品订单、虚拟订单
- 售后管理、退款流程
- 订单统计、对账

### 店铺管理
- 店铺列表、审核
- 结算管理、对账

### 营销推广
- 优惠券、满减、团购、秒杀
- 营销活动配置

### 直播管理
- 直播间、商品管理
- 直播数据统计

### 微信管理
- 微信素材、模板、菜单
- 粉丝管理、订阅消息

### 运营管理
- 文章管理、热词、反馈
- PC端、H5页面配置

### 系统设置
- 基础设置、应用配置
- 用户管理、角色权限
- 物流配置、支付设置
- 地区管理、敏感词

### 统计分析
- 商品、会员、订单统计
- 流量分析、交易数据

## � 子项目详情

### 🏢 管理端 (manager)
管理端是整个电商系统的核心控制面板，为管理员提供全面的业务管理功能。
- **开发状态**: ✅ 已完成
- **技术栈**: Vue 3 + TypeScript + Element Plus
- **主要功能**: 商品管理、会员管理、订单管理、营销推广、系统设置

### 📲 移动端 (uniapp) 
基于 UniApp 开发的跨平台移动应用，支持多端发布。
- **开发状态**: 📋 规划中
- **技术栈**: UniApp + Vue 3 + TypeScript + UView
- **目标平台**: H5、微信小程序、支付宝小程序、App
- **主要功能**: 商品浏览、购物车、订单管理、用户中心

### 🏪 商家端 (seller)
为商家用户提供的店铺管理解决方案。
- **开发状态**: 📋 规划中
- **技术栈**: Vue 3 + TypeScript + Element Plus
- **主要功能**: 商品管理、订单处理、数据统计、店铺设置

### 🛒 买家端 (buyer)
面向消费者的购物平台，提供完整的购物体验。
- **开发状态**: 📋 规划中
- **技术栈**: Vue 3 + TypeScript + Element Plus
- **主要功能**: 商品浏览、购物车、订单管理、支付结算、用户中心

### 💬 即时通讯 (im)
实时通讯系统，连接买家、卖家和管理员。
- **开发状态**: 📋 规划中
- **技术栈**: Vue 3 + TypeScript + Socket.IO
- **主要功能**: 实时消息、群组聊天、消息推送、客服系统

## � 开发指南

### 项目架构
- 采用 Vue3 + Composition API
- 使用 Pinia 进行状态管理
- 基于 Vite 的现代化构建
- 多项目架构设计，独立部署维护

### 代码规范
- TypeScript 严格模式
- ESLint 代码检查
- 组件按功能模块划分
- 统一的代码风格和命名规范

### 国际化
- 支持中英文切换
- 完整的国际化配置

### 多项目开发
- 每个子项目独立运行和部署
- 共享通用的工具库和类型定义
- 统一的开发规范和构建流程
- 跨项目组件复用策略

## 📄 许可证

本项目采用 MIT 许可证。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- GitHub Issues: [提交问题](https://github.com/Aeglx/MallEcoUI/issues)
- 项目地址: https://github.com/Aeglx/MallEcoUI

---

**MallEco Team** © 2025