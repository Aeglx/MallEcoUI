# MallEco 管理端 - Vue3 版本

## 项目简介

这是 MallEco 管理端前端项目的 Vue3 重构版本。

## 技术栈

- Vue 3.x
- Vue Router 4.x
- Pinia (状态管理)
- TypeScript
- Vite (构建工具)
- View Design Plus (UI 组件库)

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
manager/
├── src/
│   ├── api/              # API 接口定义
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── config/           # 配置文件
│   ├── libs/             # 工具库
│   ├── locale/           # 国际化
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── styles/           # 样式文件
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── public/               # 公共资源
├── package.json          # 依赖配置
├── vite.config.ts        # Vite 配置
└── tsconfig.json         # TypeScript 配置
```

## 开发文档

详细开发文档请查看 [VUE3_MIGRATION.md](./VUE3_MIGRATION.md)

