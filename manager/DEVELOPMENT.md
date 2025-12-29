# 开发指南

## 项目启动

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境
确保 `public/config.js` 中的 API 地址配置正确。

### 3. 启动开发服务器
```bash
npm run dev
```

项目将在 `http://localhost:10003` 启动。

## 项目结构说明

```
src/
├── api/              # API 接口定义
│   ├── index.ts      # 主要 API 接口
│   ├── common.ts     # 通用 API
│   └── goods.ts      # 商品相关 API
├── assets/           # 静态资源（需要从 Vue2 项目复制）
├── components/       # 公共组件
│   ├── malleco/      # 自定义组件
│   └── verify/       # 验证码组件
├── config/           # 配置文件
├── libs/             # 工具库
│   ├── axios.ts      # HTTP 请求封装
│   ├── storage.ts    # 本地存储工具
│   ├── util.ts       # 工具函数（包含动态路由）
│   └── lazyLoading.ts # 路由懒加载
├── locale/           # 国际化
├── router/           # 路由配置
│   ├── index.ts      # 路由主文件
│   └── routes.ts     # 基础路由定义
├── stores/           # Pinia 状态管理
│   ├── app.ts        # 应用状态
│   ├── user.ts       # 用户状态
│   └── setting.ts    # 设置状态
├── styles/           # 样式文件
├── utils/            # 工具函数
├── views/            # 页面组件
│   ├── Main.vue      # 主布局
│   ├── login.vue     # 登录页
│   └── main-parts/   # 主布局子组件
└── main.ts           # 入口文件
```

## 核心功能说明

### 动态路由系统
- 路由在 `libs/util.ts` 的 `initRouter` 函数中动态生成
- 从后端 API `/permission/menu/memberMenu` 获取菜单数据
- 支持三级菜单结构

### 菜单树渲染
- 一级导航：顶部横向菜单（navList）
- 二级菜单：左侧菜单组（menuList）
- 三级菜单：具体页面路由

### 状态管理
使用 Pinia 替代 Vuex：
- `stores/app.ts` - 应用状态（菜单、路由、标签页等）
- `stores/user.ts` - 用户状态
- `stores/setting.ts` - 设置状态

## 开发注意事项

1. **UI 组件库**
   - 当前使用 `view-design-plus`，需要确认是否可用
   - 如果不可用，建议迁移到 Element Plus

2. **资源文件**
   - 需要从 Vue2 项目复制 `src/assets` 目录下的图片资源
   - 特别是 `logo.png` 和 `background.png`

3. **API 配置**
   - 确保 `public/config.js` 中的 API 地址正确
   - 开发环境使用 `API_DEV`，生产环境使用 `API_PROD`

4. **类型定义**
   - 所有 TypeScript 类型定义在相关文件中
   - 全局类型在 `src/vite-env.d.ts` 中定义

## 下一步开发

1. 迁移业务页面（从 Vue2 项目复制并适配）
2. 创建公共组件（上传、编辑器等）
3. 完善 API 接口定义
4. 测试和优化

