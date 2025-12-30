# MallEco 买家端项目

[![Vue](https://img.shields.io/badge/Vue-3.4.0-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-purple.svg)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.4.4-blue.svg)](https://element-plus.org/)

> 🛍️ **项目状态**: ✅ 已开发 - 基础框架已完成  
> 👤 **目标用户**: 买家端用户  
> 🛒 **主要功能**: 模块化页面渲染、首页装修、专题页面  
> 📱 **架构模式**: 后端渲染模块数据，前端动态渲染组件

## 项目概述

MallEco 买家端是面向消费者的电商购物平台，采用模块化渲染架构。后端负责组装模块数据，前端根据模块类型动态渲染对应的组件，实现了灵活的页面装修功能。

## 核心特性

### 🎨 模块化渲染系统

- **后端数据驱动**: 后端返回模块数据结构，前端根据 `type` 字段动态渲染
- **模块类型丰富**: 支持轮播图、商品列表、营销活动等多种模块类型
- **组件化设计**: 每个模块对应独立的Vue组件，易于维护和扩展

### 📦 已实现的模块组件

#### 轮播图模块

- **Carousel1**: 首页主轮播图（支持背景色切换）
- **Carousel**: 标准轮播图组件
- **Carousel2**: 二级轮播图组件

#### 营销模块

- **Seckill**: 限时秒杀模块
- **Recommend**: 好货推荐模块（左右布局）
- **NewGoodsSort**: 新品排行模块（三栏布局）
- **ForYour**: 为你推荐模块
- **FirstPageAdvert**: 首页广告模块（渐变背景）

#### 商品展示模块

- **GoodsAndType**: 商品分类模块（带标签切换）
- **OnlyGoodsModel**: 纯商品列表模块
- **MixModel**: 混合模块（商品+品牌组合）
  - **MixGoods**: 混合商品子模块
  - **MixBrand**: 混合品牌子模块

#### 布局模块

- **OneRowThreeColumns**: 一行三列布局
- **NotEnough**: 补货中模块（带分类导航）
- **BannerAdvert**: 横幅广告模块

### 🔧 技术架构

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite 5.0.8
- **UI组件库**: Element Plus 2.4.4
- **状态管理**: Pinia
- **路由管理**: Vue Router 4.2.5
- **HTTP客户端**: Axios
- **样式预处理**: SCSS

## 项目结构

```
buyer/
├── public/                      # 静态资源
│   ├── config.js                # API配置文件
│   └── favicon.ico              # 网站图标
├── src/
│   ├── api/                     # API接口定义
│   │   ├── index.ts             # 首页数据接口
│   │   └── common.ts            # 通用接口（站点信息等）
│   ├── components/              # 组件目录
│   │   └── indexDecorate/       # 页面装修组件
│   │       ├── ModelForm.vue    # 模块列表容器
│   │       ├── ModelFormItem.vue # 模块渲染分发器
│   │       └── modelList/       # 模块组件库
│   │           ├── Carousel.vue      # 轮播图
│   │           ├── Carousel1.vue     # 轮播图1
│   │           ├── Carousel2.vue     # 轮播图2
│   │           ├── Seckill.vue       # 限时秒杀
│   │           ├── Recommend.vue     # 好货推荐
│   │           ├── NewGoodsSort.vue  # 新品排行
│   │           ├── ForYour.vue       # 为你推荐
│   │           ├── FirstPageAdvert.vue # 首页广告
│   │           ├── GoodsAndType.vue  # 商品分类
│   │           ├── OnlyGoodsModel.vue # 纯商品模块
│   │           ├── MixModel.vue      # 混合模块
│   │           ├── OneRowThreeColumns.vue # 一行三列
│   │           ├── NotEnough.vue     # 补货中
│   │           └── mixs/             # 混合模块子组件
│   │               ├── MixGoods.vue  # 混合商品
│   │               └── MixBrand.vue  # 混合品牌
│   ├── libs/                    # 工具库
│   │   └── axios.ts             # HTTP客户端配置
│   ├── pages/                   # 页面组件
│   │   ├── Index.vue            # 首页
│   │   └── Topic.vue            # 专题页面
│   ├── router/                  # 路由配置
│   │   └── index.ts             # 路由定义
│   ├── styles/                  # 样式文件
│   │   ├── variables.scss       # 样式变量
│   │   ├── global.scss          # 全局样式
│   │   └── index.scss           # 样式入口
│   ├── utils/                   # 工具函数
│   │   └── storage.ts           # 存储工具（Cookie）
│   ├── App.vue                  # 根组件（站点信息初始化）
│   ├── main.ts                  # 应用入口
│   └── vite-env.d.ts            # TypeScript声明文件
├── index.html                   # HTML模板
├── package.json                 # 项目配置
├── tsconfig.json                # TypeScript配置
├── tsconfig.node.json           # Node TypeScript配置
├── vite.config.ts               # Vite配置
├── .gitignore                   # Git忽略文件
└── README.md                    # 项目说明
```

## 模块渲染机制

### 数据流程

1. **后端服务** (`MallEcoAPI`) 组装模块数据
2. **前端请求** 通过 `/buyer/other/pageData/getIndex` 获取页面数据
3. **数据解析** 前端解析 `pageData`（可能是JSON字符串）
4. **模块渲染** `ModelFormItem` 根据 `element.type` 渲染对应组件

### 模块数据结构

```typescript
interface ModuleData {
  key: string;              // 模块唯一标识
  type: string;             // 模块类型（如：carousel1, seckill等）
  options: {                // 模块配置数据
    [key: string]: any;     // 根据模块类型不同而变化
  };
}
```

### 支持的模块类型

| 模块类型                 | 组件                 | 说明         |
| -------------------- | ------------------ | ---------- |
| `carousel1`          | Carousel1          | 首页主轮播图     |
| `carousel`           | Carousel           | 标准轮播图      |
| `carousel2`          | Carousel2          | 二级轮播图      |
| `seckill`            | Seckill            | 限时秒杀       |
| `recommend`          | Recommend          | 好货推荐       |
| `newGoodsSort`       | NewGoodsSort       | 新品排行       |
| `forYour`            | ForYour            | 为你推荐       |
| `firstAdvert`        | FirstPageAdvert    | 首页广告       |
| `bannerAdvert`       | BannerAdvert       | 横幅广告       |
| `goodsType`          | GoodsAndType       | 商品分类       |
| `onlyGoodsModel`     | OnlyGoodsModel     | 纯商品模块      |
| `mixModel`           | MixModel           | 混合模块       |
| `oneRowThreeColumns` | OneRowThreeColumns | 一行三列       |
| `notEnough`          | NotEnough          | 补货中        |
| `hotAdvert`          | -                  | 热门广告（内联渲染） |
| `discountAdvert`     | -                  | 折扣广告（内联渲染） |

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 进入项目目录
cd buyer

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
http://localhost:10000
```

**注意**: 确保后端服务 `MallEcoAPI` 在 `http://localhost:9000` 运行

### 构建生产

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 代码检查

```bash
# ESLint 检查和修复
npm run lint
```

## API 接口

### 首页数据接口

```typescript
// 获取首页装修数据
GET /buyer/other/pageData/getIndex?clientType=PC

// 响应格式
{
  success: true,
  result: {
    pageData: {
      list: [
        {
          key: 'carousel1',
          type: 'carousel1',
          options: { ... }
        },
        ...
      ]
    }
  }
}
```

### 专题页面接口

```typescript
// 获取专题页面数据
GET /buyer/other/pageData/get/:id

// 响应格式同上
```

### 通用接口

```typescript
// 获取站点基础信息
GET /common/common/site

// 响应格式
{
  success: true,
  result: {
    settingValue: '{"siteName":"MallEco","buyerSideLogo":"...","buyerSideIcon":"..."}'
  }
}
```

## 配置说明

### API 配置 (`public/config.js`)

```javascript
var BASE = {
  API_DEV: {
    common: 'http://localhost:9000/api',
    buyer: 'http://localhost:9000/api',
    seller: 'http://localhost:9000/api',
    manager: 'http://localhost:9000/api'
  },
  API_PROD: {
    // 生产环境配置
  },
  PREFIX: ''
}
```

### Vite 配置

- **开发端口**: 10000
- **代理配置**: `/api` 代理到 `http://localhost:9000`
- **构建优化**: 代码分割、Tree Shaking

## 样式规范

### 主题颜色

```scss
$theme_color: #F31947;              // 主题色（红色）
$primary_color: #2d8cf0;            // 主色（蓝色）
$success_color: #19be6b;            // 成功色（绿色）
$warning_color: #ff9900;            // 警告色（橙色）
$error_color: #ed3f14;              // 错误色（红色）
```

### 布局宽度

- **容器宽度**: 1200px
- **响应式**: 支持移动端适配（规划中）

### 全局样式类

- `.width_1200_auto`: 1200px居中容器
- `.mb_20`: 底部间距20px
- `.hover-pointer`: 鼠标悬停指针
- `.wes-2`: 两行文字省略

## 开发指南

### 添加新模块组件

1. 在 `src/components/indexDecorate/modelList/` 创建新组件
2. 在 `ModelFormItem.vue` 中添加模块类型判断和组件引用
3. 在 `ModelFormItem.vue` 的 `<template>` 中添加渲染逻辑

示例：

```vue
<!-- ModelFormItem.vue -->
<template>
  <!-- 现有模块 -->
  ...

  <!-- 新模块 -->
  <NewModule
    v-if="element.type === 'newModule'"
    :data="element"
    class="mb_20 width_1200_auto"
  />
</template>

<script setup lang="ts">
import NewModule from './modelList/NewModule.vue'
// ...
</script>
```

### 模块组件开发规范

```vue
<template>
  <div class="module-name" v-if="data?.options">
    <!-- 模块内容 -->
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  data: any  // 模块数据
}>()

const router = useRouter()

// 跳转处理
const linkTo = (url: string) => {
  if (url) {
    if (url.substr(0, 1) === '/') {
      router.push(url)  // 内部路由
    } else {
      window.open(url, '_blank')  // 外部链接
    }
  }
}
</script>

<style lang="scss" scoped>
.module-name {
  // 模块样式
}
</style>
```

## 与旧项目对比

### 相同点

- ✅ 模块类型和数据结构完全一致
- ✅ 样式和布局1:1还原
- ✅ 交互体验保持一致

### 不同点

- ✅ 技术栈升级：Vue 2 → Vue 3
- ✅ UI库更换：iView → Element Plus
- ✅ 构建工具：Webpack → Vite
- ✅ 类型支持：JavaScript → TypeScript
- ✅ 组件写法：Options API → Composition API

## 已实现功能

### ✅ 已完成

- [x] 项目基础架构搭建
- [x] API请求配置
- [x] 模块渲染系统
- [x] 所有模块组件实现
- [x] 首页页面实现
- [x] 专题页面实现
- [x] 站点信息初始化
- [x] 路由配置
- [x] 样式系统

### 📋 待开发

- [ ] 用户登录/注册
- [ ] 商品详情页
- [ ] 购物车功能
- [ ] 订单管理
- [ ] 个人中心
- [ ] 搜索功能
- [ ] 分类页面
- [ ] 移动端适配

## 开发计划

### 第二阶段：用户系统

- [ ] 用户注册/登录
- [ ] 用户信息管理
- [ ] 地址管理
- [ ] 收藏管理

### 第三阶段：购物功能

- [ ] 商品详情页
- [ ] 购物车
- [ ] 订单创建
- [ ] 支付集成

### 第四阶段：移动端

- [ ] 响应式布局
- [ ] 移动端适配
- [ ] 触摸优化

## 性能优化

### 已实现

- ✅ 路由懒加载
- ✅ 组件按需加载
- ✅ 图片懒加载（规划中）

### 计划中

- [ ] 虚拟滚动（长列表）
- [ ] 图片压缩和WebP
- [ ] CDN资源优化
- [ ] 缓存策略

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 遵循 Vue 3 Composition API 最佳实践
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 配置规则
- 编写有意义的提交信息

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目地址: [https://github.com/Aeglx/MallEcoUI](https://github.com/Aeglx/MallEcoUI)
- 问题反馈: [GitHub Issues](https://github.com/Aeglx/MallEcoUI/issues)

## 更新日志

### v1.0.0 (2025-01-XX)

- ✅ 完成项目基础架构搭建
- ✅ 实现模块化渲染系统
- ✅ 实现所有模块组件（14+个模块类型）
- ✅ 完成首页和专题页面
- ✅ 完成API接口集成
- ✅ 完成样式系统（1:1还原旧项目样式）

---

**MallEco Team** © 2025 | **买家端项目** - 基础框架已完成 ✅
