# Vue3 迁移开发文档

## 项目概述

本项目是将 Vue2 管理端前端项目迁移到 Vue3 的完整重构版本。

**开发位置**: `E:\MallEco\MallEcoWeb\manager`

### 迁移目标
- ✅ 保留前端框架、逻辑、UI、渲染、交互、加载方式
- ✅ 重新设计登录页
- ✅ 侧边栏菜单树动态从后端获取
- ✅ 菜单树页面由前端渲染
- ✅ 统一的前端渲染机制

## 技术栈对比

### Vue2 技术栈
- Vue 2.6.10
- Vue Router 3.1.3
- Vuex 3.4.0
- view-design (iView) 4.7.0
- Vue CLI 4.x
- Webpack

### Vue3 技术栈
- Vue 3.4.0
- Vue Router 4.2.5
- Pinia 2.1.7 (替代 Vuex)
- View Design Plus (或 Element Plus)
- Vite 5.0.8 (替代 Vue CLI)
- TypeScript 5.3.3

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

## 开发进度

### ✅ 已完成
- [x] 项目结构分析
- [x] 技术栈确定
- [x] 开发文档创建
- [x] 项目基础配置文件创建 (package.json, vite.config.ts, tsconfig.json)
- [x] 核心工具库迁移 (storage.ts, md5.ts, config/index.ts)
- [x] 创建入口文件 (main.ts)
- [x] 创建根组件 (App.vue)
- [x] 迁移 axios 请求库 (libs/axios.ts)
- [x] 迁移国际化配置 (locale/index.ts, locale/lang/*.ts)
- [x] 迁移状态管理到 Pinia (stores/app.ts, stores/user.ts, stores/setting.ts)
- [x] 迁移路由系统 (router/index.ts, router/routes.ts)
- [x] 迁移工具库 (libs/util.ts, libs/lazyLoading.ts)
- [x] 迁移主布局组件 (views/Main.vue)
- [x] 迁移侧边栏菜单组件 (views/main-parts/shrinkable-menu)
- [x] 创建样式文件 (styles/common.scss, styles/theme.less, views/main.scss)
- [x] 重新设计登录页 (views/login.vue)
- [x] 创建 API 接口文件 (api/index.ts, api/common.ts, api/goods.ts)
- [x] 创建辅助组件 (tags-page-opened, message-tip, header, footer)
- [x] 创建错误页面组件 (404, 403, 500)
- [x] 创建首页组件 (views/home/home.vue)
- [x] 实现动态菜单树（从后端获取，前端渲染）
- [x] 创建必要组件 (circle-loading, config-drawer, verify)
- [x] 创建个人中心和修改密码页面
- [x] 创建配置文件 (public/config.js, vite-env.d.ts)
- [x] 修复依赖问题（view-design-plus -> view-design）
- [x] 将项目中的 'lili' 改为 'malleco'
- [x] 创建 malleco-dialog 组件
- [x] 迁移 UI 组件库从 view-design 到 Element Plus（解决 Vue3 兼容性问题）
- [x] 迁移首页（home.vue）- 将 view-design 组件替换为 Element Plus，使用 Vue3 Composition API
- [x] 创建图片上传组件（components/malleco/image-upload.vue）- 支持单图、多图上传
- [x] 创建文件上传组件（components/malleco/file-upload.vue）
- [x] 创建富文本编辑器组件（components/malleco/rich-text-editor.vue）
- [x] 创建增强表格组件（components/malleco/enhanced-table.vue）- 支持搜索、分页、选择等功能
- [x] 创建商品管理列表页面（views/goods/goods-list.vue）- 作为业务页面迁移示例
- [x] 创建表单增强组件（components/malleco/enhanced-form.vue）- 支持多种表单控件、验证、动态表单
- [x] 完善商品管理：创建商品详情页（views/goods/goods-detail.vue）
- [x] 完善商品管理：创建商品编辑/新增页（views/goods/goods-edit.vue）
- [x] 创建订单管理列表页面（views/order/order-list.vue）
- [x] 创建会员管理列表页面（views/member/member-list.vue）
- [x] 完善 API 接口（api/order.ts, api/goods.ts, api/member.ts）
- [x] 创建订单详情页面（views/order/order-detail.vue）
- [x] 创建订单发货对话框组件（views/order/components/ship-dialog.vue）
- [x] 创建订单退款对话框组件（views/order/components/refund-dialog.vue）
- [x] 创建会员详情页面（views/member/member-detail.vue）
- [x] 创建会员编辑页面（views/member/member-edit.vue）
- [x] 更新订单列表页面，集成发货和退款对话框
- [x] 添加新页面的路由配置（router/routes.ts）
- [x] 创建类型定义文件（types/goods.ts, types/order.ts, types/member.ts）
- [x] 创建工具函数（utils/error-handler.ts, utils/format.ts）
- [x] 优化现有页面，使用新的工具函数和类型定义
- [x] 创建促销活动管理模块（列表、详情、编辑）
- [x] 创建系统设置模块（系统设置页面）

### 🚧 进行中
- [ ] 测试和优化已创建的功能

### ⏳ 待完成
- [ ] 添加更多业务模块（促销活动、系统设置等）
- [ ] 测试和优化
- [ ] 部署配置

## 公共组件使用说明

### 1. 图片上传组件 (image-upload.vue)

支持单图和多图上传，基于 Element Plus Upload 组件封装。

```vue
<template>
  <image-upload
    v-model="imageUrl"
    :limit="1"
    :multiple="false"
    list-type="picture-card"
    button-text="上传图片"
    tip="只能上传jpg/png文件，且不超过5MB"
    @change="handleImageChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ImageUpload from '@/components/malleco/image-upload.vue'

const imageUrl = ref('')
const handleImageChange = (value: string) => {
  console.log('图片URL:', value)
}
</script>
```

**Props:**
- `modelValue`: 图片URL（字符串或字符串数组）
- `limit`: 最大上传数量，默认 9
- `multiple`: 是否支持多图，默认 false
- `listType`: 显示类型，'text' | 'picture' | 'picture-card'，默认 'picture-card'
- `maxSize`: 最大文件大小（MB），默认 5
- `disabled`: 是否禁用，默认 false
- `buttonText`: 按钮文字，默认 '点击上传'
- `tip`: 提示文字

### 2. 文件上传组件 (file-upload.vue)

支持文件上传，可配置文件类型和大小限制。

```vue
<template>
  <file-upload
    v-model="fileUrl"
    :limit="5"
    :multiple="true"
    accept=".pdf,.doc,.docx"
    button-text="上传文件"
    tip="支持PDF、Word文档，单个文件不超过10MB"
  />
</template>
```

### 3. 富文本编辑器组件 (rich-text-editor.vue)

基于 contenteditable 的简单富文本编辑器。

```vue
<template>
  <rich-text-editor
    v-model="content"
    height="500px"
    placeholder="请输入内容..."
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RichTextEditor from '@/components/malleco/rich-text-editor.vue'

const content = ref('')
</script>
```

**注意**: 如需更强大的富文本编辑器功能，建议集成 Quill 或 TinyMCE。

### 4. 增强表格组件 (enhanced-table.vue)

集成搜索、分页、选择、工具栏等功能的表格组件。

```vue
<template>
  <enhanced-table
    :data="tableData"
    :loading="loading"
    :search-items="searchItems"
    :show-selection="true"
    :show-pagination="true"
    :page="pagination.page"
    :page-size="pagination.pageSize"
    :total="pagination.total"
    @search="handleSearch"
    @reset="handleReset"
    @selection-change="handleSelectionChange"
    @page-change="handlePageChange"
  >
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="status" label="状态" />
    <el-table-column label="操作" width="200">
      <template #default="{ row }">
        <el-button @click="handleEdit(row)">编辑</el-button>
      </template>
    </el-table-column>
  </enhanced-table>
</template>
```

**搜索项配置:**
```typescript
const searchItems = [
  {
    prop: 'name',
    label: '名称',
    type: 'input',
    placeholder: '请输入名称'
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    options: [
      { label: '启用', value: '1' },
      { label: '禁用', value: '0' }
    ]
  },
  {
    prop: 'date',
    label: '日期',
    type: 'daterange'
  }
]
```

### 5. 表单增强组件 (enhanced-form.vue)

支持多种表单控件、表单验证、动态表单的增强表单组件。

```vue
<template>
  <enhanced-form
    v-model="formData"
    :form-items="formItems"
    :rules="formRules"
    :label-width="'120px'"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import EnhancedForm from '@/components/malleco/enhanced-form.vue'

const formData = reactive({
  name: '',
  category: '',
  price: 0,
  status: 'ENABLE'
})

const formRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' }
  ]
}

const formItems = [
  {
    prop: 'name',
    label: '名称',
    type: 'input',
    required: true
  },
  {
    prop: 'category',
    label: '分类',
    type: 'select',
    options: [
      { label: '分类1', value: '1' },
      { label: '分类2', value: '2' }
    ]
  },
  {
    prop: 'price',
    label: '价格',
    type: 'number',
    min: 0.01,
    precision: 2
  },
  {
    prop: 'status',
    label: '状态',
    type: 'switch',
    activeText: '启用',
    inactiveText: '禁用'
  }
]

const handleSubmit = (data: Record<string, any>) => {
  console.log('提交数据:', data)
}
</script>
```

**支持的控件类型:**
- `input` - 输入框
- `textarea` - 文本域
- `number` - 数字输入框
- `select` - 选择器
- `radio` - 单选按钮组
- `checkbox` - 复选框组
- `date` - 日期选择器
- `datetime` - 日期时间选择器
- `daterange` - 日期范围选择器
- `switch` - 开关
- `image` - 图片上传
- `file` - 文件上传
- `richtext` - 富文本编辑器
- `slot` - 自定义插槽

## 核心功能实现

### 1. 动态路由系统
- 从后端 API `/permission/menu/memberMenu` 获取菜单数据
- 动态生成路由配置
- 支持三级菜单结构

### 2. 菜单树渲染
- 一级导航：顶部横向菜单
- 二级菜单：左侧菜单组
- 三级菜单：具体页面路由

### 3. 登录系统
- 重新设计的登录界面
- 支持用户名密码登录
- 拼图验证码集成
- Token 刷新机制

## 开发规范

### 代码规范
- 使用 TypeScript
- 遵循 Vue3 Composition API
- 使用 ESLint + Prettier
- 组件命名使用 PascalCase
- 文件命名使用 kebab-case

### Git 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试
- chore: 构建/工具

## 快速开始

### 安装依赖
```bash
cd E:\MallEco\MallEcoWeb\manager
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 注意事项
1. 确保 `public/config.js` 中的 API 地址配置正确
2. 需要从 Vue2 项目复制 `src/assets` 目录下的图片资源
3. **已完成**：UI 组件库已从 `view-design` 迁移到 `Element Plus`，解决了 Vue3 兼容性问题
4. 安装依赖：
   ```bash
   npm install
   ```
5. 后续开发中，需要将 Vue2 项目中的 view-design 组件逐步替换为 Element Plus 组件

## 项目状态总结

### 核心功能已完成 ✅
1. **项目基础架构**
   - ✅ Vue3 + TypeScript + Vite 项目搭建
   - ✅ 路由系统（Vue Router 4，支持动态路由）
   - ✅ 状态管理（Pinia）
   - ✅ HTTP 请求封装（axios）
   - ✅ 国际化配置（vue-i18n）

2. **核心页面和组件**
   - ✅ 登录页（重新设计）
   - ✅ 主布局（Main.vue）
   - ✅ 侧边栏菜单（动态从后端获取）
   - ✅ 标签页管理
   - ✅ 错误页面（404, 403, 500）

3. **动态菜单系统**
   - ✅ 从后端 API 获取菜单数据
   - ✅ 动态生成路由配置
   - ✅ 三级菜单结构支持
   - ✅ 前端渲染菜单树

4. **工具和配置**
   - ✅ 工具函数库（util, storage, md5）
   - ✅ API 接口封装
   - ✅ 配置文件管理
   - ✅ 类型定义（api, goods, order, member）
   - ✅ 错误处理工具（error-handler.ts）
   - ✅ 格式化工具（format.ts）

### 待完善功能 ⏳
1. **业务页面功能完善**
   - ✅ 商品管理（列表、详情、编辑/新增）
   - ✅ 订单管理（列表、详情、发货、退款）
   - ✅ 会员管理（列表、详情、编辑/新增）
   - ✅ 促销活动管理（列表、详情、编辑/新增）
   - ✅ 系统设置（系统设置页面）
   - ⏳ 其他业务模块（根据需求继续扩展）

2. **公共组件** ✅
   - ✅ 上传组件（图片、文件）- image-upload.vue, file-upload.vue
   - ✅ 富文本编辑器 - rich-text-editor.vue
   - ✅ 表格组件增强 - enhanced-table.vue
   - ✅ 表单组件增强 - enhanced-form.vue（支持多种控件、验证、动态表单）

3. **UI 组件库** ✅
   - ✅ 已迁移到 Element Plus
   - ⏳ 样式主题定制（待完善）

## 更新日志

### 2024-01-XX
- 创建项目文档
- 在 `E:\MallEco\MallEcoWeb\manager` 位置创建 Vue3 项目
- 创建基础配置文件
- 迁移核心工具库
- 完成核心框架搭建（路由、状态管理、主布局、登录页）
- 实现动态菜单树功能
- 创建必要的辅助组件和页面
- 完成基础功能开发，项目框架已搭建完成

### 2024-01-XX（最新更新）
- ✅ 创建公共组件库
  - 图片上传组件（image-upload.vue）- 支持单图、多图上传，基于 Element Plus Upload 组件
  - 文件上传组件（file-upload.vue）- 支持文件上传，可配置文件类型和大小限制
  - 富文本编辑器组件（rich-text-editor.vue）- 基于 contenteditable 的简单富文本编辑器
  - 增强表格组件（enhanced-table.vue）- 集成搜索、分页、选择、工具栏等功能
  - 表单增强组件（enhanced-form.vue）- 支持多种表单控件（input、select、date、upload等）、表单验证、动态表单
- ✅ 完善商品管理模块
  - 商品列表页面（goods-list.vue）- 列表查询、搜索、分页、批量操作
  - 商品详情页面（goods-detail.vue）- 展示商品详细信息
  - 商品编辑/新增页面（goods-edit.vue）- 使用表单增强组件，支持商品的新增和编辑
- ✅ 创建订单管理模块
  - 订单列表页面（order-list.vue）- 订单查询、状态管理、发货、退款、导出等功能
- ✅ 创建订单管理模块
  - 订单列表页面（order-list.vue）- 订单查询、状态管理、发货、退款、导出等功能
  - 订单详情页面（order-detail.vue）- 展示订单详细信息、支持取消、发货、退款操作
  - 发货对话框组件（components/ship-dialog.vue）- 订单发货功能
  - 退款对话框组件（components/refund-dialog.vue）- 订单退款功能
- ✅ 创建会员管理模块
  - 会员列表页面（member-list.vue）- 会员查询、状态管理、批量操作
  - 会员详情页面（member-detail.vue）- 展示会员详细信息、统计信息
  - 会员编辑页面（member-edit.vue）- 会员新增和编辑功能
- ✅ 完善 API 接口
  - 订单相关 API（api/order.ts）- 订单列表、详情、状态更新、发货、退款等
  - 商品相关 API（api/goods.ts）- 新增、更新、删除、状态更新等
  - 会员相关 API（api/member.ts）- 新增、详情、更新、状态更新、删除等
- ✅ 完善路由配置
  - 添加商品管理相关路由（列表、详情、编辑）
  - 添加订单管理相关路由（列表、详情）
  - 添加会员管理相关路由（列表、详情、编辑）
- ✅ 创建类型定义系统
  - 商品类型定义（types/goods.ts）
  - 订单类型定义（types/order.ts）
  - 会员类型定义（types/member.ts）
- ✅ 创建工具函数
  - 错误处理工具（utils/error-handler.ts）- 统一处理 API 错误、确认对话框等
  - 格式化工具（utils/format.ts）- 价格、日期、文件大小等格式化函数
- ✅ 创建促销活动管理模块
  - 促销活动列表页面（promotion-list.vue）- 活动查询、搜索、分页、批量操作
  - 促销活动详情页面（promotion-detail.vue）- 展示活动详细信息
  - 促销活动编辑页面（promotion-edit.vue）- 活动新增和编辑功能
  - 促销活动 API（api/promotion.ts）- 列表、详情、新增、更新、删除等
  - 促销活动类型定义（types/promotion.ts）
- ✅ 创建系统设置模块
  - 系统设置页面（setting/system-setting.vue）- 网站基本信息配置
  - 系统设置 API（api/setting.ts）- 获取和更新系统设置
- ✅ 代码优化
  - 优化商品列表页面，使用新的工具函数和类型定义
  - 统一错误处理和格式化函数的使用
- ✅ 修复构建错误
  - 修复 `malleco-dialog` 组件导入问题（创建 index.ts 导出文件）
  - 修复 Sass 重复导入问题（创建单独的 variables.scss 文件，只注入变量到所有 SCSS 文件，避免重复导入样式）
  - 修复 config.js 配置，同步 MallEcoAPI 项目端口 9000
  - 修复 Pinia store 导出问题（为 app.ts、user.ts、setting.ts 添加命名导出，支持命名导入和默认导入两种方式）
  - 修复 login.vue 样式加载错误（SCSS 变量无法访问的问题）
  - 修复 login.vue 组件导入错误（将 view-design 组件替换为 Element Plus 组件：Row/Col → el-row/el-col, Form/FormItem → el-form/el-form-item, Input → el-input, Button → el-button）
  - 修复 header.vue 中的 require 错误（改为 ES 模块 import 导入，将 Row 替换为 el-row）
  - 修复 verify/index.vue 中的 Icon 组件错误（将 view-design 的 Icon 替换为 Element Plus 的 el-icon 和图标组件 Refresh、ArrowRight）
  - 修复 footer.vue 中的 Row 组件错误（将 Row 替换为 el-row，移除不支持的 type="flex" 属性）

