# MallEco 电商管理系统

[![Vue](https://img.shields.io/badge/Vue-3.4.0-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-purple.svg)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.4.4-blue.svg)](https://element-plus.org/)

MallEco 是一个现代化的电商管理系统，提供完整的电商业务管理功能。

## 📋 项目简介

MallEco 是一个现代化的电商生态系统，包含多个子项目：

- **管理端** (`manager`) - 基于 Vue3 + TypeScript 构建的管理后台 ✅ **已完成**
- **买家端** (`buyer`) - 面向消费者的购物平台，模块化渲染架构 ✅ **基础框架已完成**
- **商家端** (`seller`) - 为商家提供店铺管理解决方案 📋 **规划中**
- **移动端** (`uniapp`) - 基于 UniApp 的跨平台移动应用 📋 **规划中**
- **即时通讯** (`im`) - 实时通讯系统，连接买家、卖家和管理员 📋 **规划中**

整个系统提供完整的电商业务管理功能，包含商品管理、会员管理、订单管理、营销推广、统计分析等。

## 🚀 技术栈

### 前端技术
- **Vue 3.4.0** - 渐进式 JavaScript 框架
- **TypeScript 5.3.3** - 类型安全的 JavaScript
- **Vite 5.0.8** - 下一代前端构建工具
- **Element Plus 2.4.4** - 基于 Vue 3 的组件库
- **Pinia** - Vue 状态管理
- **Vue Router 4.2.5** - Vue.js 官方路由
- **Vue i18n 9.8.0** - 国际化支持（管理端）

### 开发工具
- **Vue-tsc** - TypeScript 编译器
- **Sass/SCSS** - CSS 预处理器
- **ESLint** - 代码检查
- **Auto Import** - 自动导入组件和API

## 📁 项目结构

```
MallEcoWeb/
├── manager/                 # 管理端前端项目 ✅ 已完成
│   ├── public/             # 公共资源
│   │   └── config.js       # API配置文件
│   ├── src/                # 源代码
│   │   ├── api/            # API 接口（16个模块）
│   │   ├── assets/         # 静态资源
│   │   ├── components/     # 公共组件
│   │   │   ├── malleco/    # 自定义组件库（7个组件）
│   │   │   └── malleco-dialog/ # 对话框组件库
│   │   ├── libs/           # 工具库
│   │   ├── locale/         # 国际化
│   │   ├── router/         # 路由配置
│   │   ├── stores/         # Pinia状态管理
│   │   ├── styles/         # 样式文件
│   │   ├── types/          # TypeScript类型定义
│   │   ├── utils/          # 工具函数
│   │   └── views/          # 页面组件（60+个页面）
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── buyer/                   # 买家端项目 ✅ 基础框架已完成
│   ├── public/             # 静态资源
│   │   └── config.js       # API配置文件
│   ├── src/                # 源代码
│   │   ├── api/            # API接口
│   │   │   ├── index.ts    # 首页数据接口
│   │   │   └── common.ts   # 通用接口
│   │   ├── components/     # 组件目录
│   │   │   └── indexDecorate/ # 页面装修组件
│   │   │       ├── ModelForm.vue      # 模块列表容器
│   │   │       ├── ModelFormItem.vue  # 模块渲染分发器
│   │   │       └── modelList/         # 模块组件库（14+个模块）
│   │   ├── libs/           # 工具库
│   │   │   └── axios.ts    # HTTP客户端
│   │   ├── pages/          # 页面组件
│   │   │   ├── Index.vue   # 首页
│   │   │   └── Topic.vue   # 专题页面
│   │   ├── router/         # 路由配置
│   │   ├── styles/         # 样式文件
│   │   ├── utils/          # 工具函数
│   │   ├── App.vue         # 根组件
│   │   └── main.ts         # 入口文件
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── seller/                  # 商家端项目 📋 规划中
│   └── README.md           # 项目说明
│
├── uniapp/                  # 移动端项目 📋 规划中
│   └── README.md           # 项目说明
│
├── im/                      # 即时通讯系统 📋 规划中
│   └── README.md           # 项目说明
│
├── .gitignore              # Git忽略文件
└── README.md               # 项目说明（本文件）
```

## 🛠️ 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0
- 后端服务 MallEcoAPI 运行在 `http://localhost:9000`

### 管理端开发

```bash
# 进入管理端项目目录
cd manager

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问地址: http://localhost:5173
```

### 买家端开发

```bash
# 进入买家端项目目录
cd buyer

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问地址: http://localhost:10000
```

### 构建生产

```bash
# 管理端构建
cd manager
npm run build

# 买家端构建
cd buyer
npm run build
```

## 📦 功能模块

### 管理端功能（已完成）

#### 商品管理
- 商品列表、分类、品牌、规格、单位管理
- 商品审核、批量操作
- 商品图片、视频上传

#### 会员管理
- 会员列表、审核、回收站
- 会员资金、积分、充值、提现
- 会员数据统计

#### 订单管理
- 商品订单、虚拟订单
- 售后管理、退款流程
- 订单统计、对账

#### 店铺管理
- 店铺列表、审核
- 结算管理、对账

#### 营销推广
- 优惠券、满减、团购、秒杀
- 营销活动配置

#### 直播管理
- 直播间、商品管理
- 直播数据统计

#### 微信管理
- 微信素材、模板、菜单
- 粉丝管理、订阅消息

#### 运营管理
- 文章管理、热词、反馈
- PC端、H5页面配置

#### 系统设置
- 基础设置、应用配置
- 用户管理、角色权限
- 物流配置、支付设置
- 地区管理、敏感词

#### 统计分析
- 商品、会员、订单统计
- 流量分析、交易数据

### 买家端功能（基础框架已完成）

#### 模块化渲染系统 ✅
- 后端数据驱动的前端渲染
- 14+ 种模块类型支持
- 灵活的页面装修能力

#### 已实现的模块 ✅
- 轮播图模块（3种类型）
- 商品展示模块（5种类型）
- 营销活动模块（4种类型）
- 布局模块（2种类型）

#### 待开发功能 📋
- 用户登录/注册
- 商品详情页
- 购物车功能
- 订单管理
- 个人中心
- 搜索功能

## 📚 子项目详情

### 🏢 管理端 (manager)

**状态**: ✅ **已完成**

管理端是整个电商系统的核心控制面板，为管理员提供全面的业务管理功能。

- **技术栈**: Vue 3 + TypeScript + Element Plus + Vite
- **主要功能**: 商品管理、会员管理、订单管理、营销推广、系统设置等
- **页面数量**: 60+ 个业务页面
- **API模块**: 16 个业务模块接口
- **组件库**: 7 个自定义组件 + 对话框组件库

**开发完成度**: 100%

**文档**: [管理端 README](./manager/README.md)

---

### 🛒 买家端 (buyer)

**状态**: ✅ **基础框架已完成**

面向消费者的购物平台，采用模块化渲染架构，后端负责组装模块数据，前端动态渲染。

- **技术栈**: Vue 3 + TypeScript + Element Plus + Vite
- **架构模式**: 后端渲染模块数据，前端动态渲染组件
- **模块系统**: 14+ 种模块类型，完全参照旧项目样式
- **主要功能**: 首页装修、专题页面、模块化渲染
- **已实现**: 所有模块组件、页面渲染系统、API集成

**开发完成度**: 基础框架 100%，业务功能规划中

**文档**: [买家端 README](./buyer/README.md)

---

### 🏪 商家端 (seller)

**状态**: 📋 **规划中**

为商家用户提供的店铺管理解决方案。

- **技术栈**: Vue 3 + TypeScript + Element Plus
- **主要功能**: 商品管理、订单处理、数据统计、店铺设置
- **开发计划**: 待启动

**文档**: [商家端 README](./seller/README.md)

---

### 📲 移动端 (uniapp)

**状态**: 📋 **规划中**

基于 UniApp 开发的跨平台移动应用，支持多端发布。

- **技术栈**: UniApp + Vue 3 + TypeScript + UView
- **目标平台**: H5、微信小程序、支付宝小程序、App
- **主要功能**: 商品浏览、购物车、订单管理、用户中心
- **开发计划**: 待启动

**文档**: [移动端 README](./uniapp/README.md)

---

### 💬 即时通讯 (im)

**状态**: 📋 **规划中**

实时通讯系统，连接买家、卖家和管理员。

- **技术栈**: Vue 3 + TypeScript + Socket.IO
- **主要功能**: 实时消息、群组聊天、消息推送、客服系统
- **开发计划**: 待启动

**文档**: [即时通讯 README](./im/README.md)

## 🔧 开发指南

### 项目架构
- 采用 Vue3 + Composition API
- 使用 Pinia 进行状态管理
- 基于 Vite 的现代化构建
- 多项目架构设计，独立部署维护
- 统一的API接口规范

### 代码规范
- TypeScript 严格模式
- ESLint 代码检查
- 组件按功能模块划分
- 统一的代码风格和命名规范

### 国际化
- 管理端支持中英文切换
- 完整的国际化配置

### 多项目开发
- 每个子项目独立运行和部署
- 共享通用的工具库和类型定义
- 统一的开发规范和构建流程
- 跨项目组件复用策略

### API 接口规范

所有项目统一使用后端 API (`MallEcoAPI`)：

- **管理端API**: `/api/manager/*`
- **买家端API**: `/api/buyer/*`
- **通用API**: `/api/common/*`

所有API请求统一通过 `public/config.js` 配置基础路径。

## 📝 开发规范

### 命名规范
- **组件**: PascalCase (如: `UserProfile.vue`)
- **文件**: kebab-case (如: `user-profile.ts`)
- **变量/函数**: camelCase (如: `userName`, `getUserInfo`)
- **常量**: UPPER_SNAKE_CASE (如: `API_BASE_URL`)

### 代码风格
- 使用 Composition API (setup语法糖)
- TypeScript 严格类型检查
- 组件 Props 和 Emits 类型定义
- 统一的代码格式化 (Prettier)

### Git 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

## 🚀 部署指南

### 开发环境
- 前端项目通过 Vite 开发服务器运行
- 后端服务通过 NestJS 运行在端口 9000
- 支持热重载和快速刷新

### 生产环境
- 前端构建输出到 `dist` 目录
- 可通过 Nginx 部署静态资源
- 建议使用 CDN 加速静态资源
- 配置反向代理到后端API

### Docker 部署
- 各项目包含 Dockerfile
- 支持 docker-compose 一键部署
- 生产环境配置优化

## 📊 项目统计

### 管理端
- **页面数量**: 60+ 个
- **API模块**: 16 个
- **组件数量**: 20+ 个
- **代码行数**: 约 50,000+ 行

### 买家端
- **模块组件**: 14+ 个
- **页面数量**: 2 个（基础）
- **API接口**: 3 个（基础）
- **代码行数**: 约 5,000+ 行

## 🔐 安全考虑

- HTTPS 加密传输
- Token 认证机制
- XSS 攻击防护
- CSRF 攻击防护
- 敏感数据加密存储

## 📄 许可证

本项目采用 MIT 许可证。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

### 贡献流程
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- GitHub Issues: [提交问题](https://github.com/Aeglx/MallEcoUI/issues)
- 项目地址: https://github.com/Aeglx/MallEcoUI

## 📅 项目进度

| 项目 | 状态 | 完成度 | 说明 |
|-----|------|--------|------|
| 管理端 (manager) | ✅ 已完成 | 100% | 所有功能模块已完成 |
| 买家端 (buyer) | ✅ 基础框架 | 30% | 模块渲染系统完成，业务功能待开发 |
| 商家端 (seller) | 📋 规划中 | 0% | 项目规划阶段 |
| 移动端 (uniapp) | 📋 规划中 | 0% | 项目规划阶段 |
| 即时通讯 (im) | 📋 规划中 | 0% | 项目规划阶段 |

## 🎯 近期计划

### 买家端开发计划
- [ ] 用户认证系统
- [ ] 商品详情页
- [ ] 购物车功能
- [ ] 订单管理系统
- [ ] 个人中心
- [ ] 搜索和筛选功能
- [ ] 移动端响应式适配

### 商家端开发计划
- [ ] 项目初始化
- [ ] 基础架构搭建
- [ ] 商家登录系统
- [ ] 商品管理模块
- [ ] 订单管理模块

---

**MallEco Team** © 2025
