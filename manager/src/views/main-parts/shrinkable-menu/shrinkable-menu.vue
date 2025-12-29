<template>
  <div class="ivu-shrinkable-menu">
    <!-- 一级菜单 -->
    <el-menu
      ref="sideMenuRef"
      :default-active="currNav"
      class="side-menu"
      mode="vertical"
      :collapse="false"
      background-color="#f5f7fa"
      text-color="#606266"
      active-text-color="#409EFF"
      @select="selectNav"
    >
      <el-menu-item v-for="(item, i) in navList" :key="i" :index="item.name">
        <span style="font-size: 12px;">{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
    <!-- 二级菜单 -->
    <el-menu
      ref="childrenMenuRef"
      :default-active="route.name as string"
      class="children-menu"
      mode="vertical"
      :collapse="false"
      @select="changeMenu"
    >
      <template v-for="item in menuList" :key="item.id">
        <!-- 如果有子菜单，使用 menu-item-group 显示二级菜单标题（加粗），然后显示三级菜单 -->
        <el-menu-item-group v-if="item.children && item.children.length > 0">
          <template #title>
            <span class="menu-level-2-title">{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="menu in item.children"
            :key="menu.name"
            :index="menu.name"
            @click="changeMenu(menu.name)"
            class="menu-level-3-item"
          >
            <span style="font-size: 12px;">{{ menu.title }}</span>
          </el-menu-item>
        </el-menu-item-group>
        <!-- 如果没有子菜单，直接显示为二级菜单项 -->
        <el-menu-item
          v-else
          :index="item.name"
          @click="changeMenu(item.name)"
        >
          <span style="font-size: 12px;">{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import util from '@/libs/util'
import { setStore } from '@/libs/storage'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const sideMenuRef = ref()
const childrenMenuRef = ref()

const menuList = computed(() => appStore.menuList)
const navList = computed(() => appStore.navList)
const currNav = computed(() => appStore.currNav)

// 不再需要 defaultOpeneds，因为使用 menu-item-group 不需要折叠功能

// 监听路由变化
watch(
  () => route.meta?.firstRouterName,
  (firstRouterName) => {
    if (firstRouterName && firstRouterName !== currNav.value) {
      selectNav(firstRouterName)
    }
  }
)

const changeMenu = (name: string) => {
  // 二级路由点击
  router.push({
    name: name
  })
}

const selectNav = (name: string) => {
  // 一级路由点击事件
  appStore.setCurrNav(name)
  setStore('currNav', name)
  util.initRouter(router)
  nextTick(() => {
    // Element Plus menu 不需要 updateActiveName，会自动更新
  })
}
</script>

<style lang="scss" scoped>
.ivu-shrinkable-menu {
  height: calc(100% - 60px);
  width: 180px;
  display: flex;
  
  .side-menu {
    width: 80px;
    border-right: none;
  }
  
  .children-menu {
    width: 100px;
    border-right: none;
  }
}

/* 重置所有菜单项的默认样式 */
:deep(.el-menu-item) {
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  text-align: left !important;
  justify-content: flex-start !important;
  padding-left: 20px !important;
  padding-right: 20px !important;
}

:deep(.el-menu-item span) {
  font-size: 12px;
  text-align: left !important;
  display: block;
  width: 100%;
}

/* 二级菜单标题样式 - 加粗，左对齐，无下拉三角 */
:deep(.el-menu-item-group__title) {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 12px !important;
  text-align: left !important;
  justify-content: flex-start !important;
  padding-left: 20px !important;
  padding-right: 20px !important;
  color: #303133 !important;
  font-weight: bold !important;
  display: flex !important;
  align-items: center !important;
}

/* 二级菜单标题文本样式 */
.menu-level-2-title {
  font-size: 12px !important;
  font-weight: bold !important;
  color: #303133 !important;
  text-align: left !important;
  display: block !important;
  width: 100% !important;
}

/* 三级菜单项样式 - 左对齐，与二级菜单相同的左侧内边距 */
.menu-level-3-item,
:deep(.el-menu-item-group .el-menu-item) {
  padding-left: 20px !important;
  text-align: left !important;
  justify-content: flex-start !important;
  margin-left: 0 !important;
}

/* 确保三级菜单项内的文本也左对齐 */
.menu-level-3-item span,
:deep(.el-menu-item-group .el-menu-item span) {
  text-align: left !important;
  display: block !important;
  width: 100% !important;
}

/* 隐藏 menu-item-group 可能存在的图标和伪元素 */
:deep(.el-menu-item-group__title::before),
:deep(.el-menu-item-group__title::after) {
  display: none !important;
}

/* 确保菜单项组内的所有内容都左对齐 */
:deep(.el-menu-item-group) {
  text-align: left !important;
}

/* 覆盖 Element Plus 的默认右对齐样式 */
:deep(.el-menu--vertical .el-menu-item),
:deep(.el-menu--vertical .el-menu-item-group__title) {
  text-align: left !important;
  justify-content: flex-start !important;
  margin-left: 0 !important;
}

/* 确保菜单项内容区域左对齐 */
:deep(.el-menu-item > *),
:deep(.el-menu-item-group__title > *) {
  text-align: left !important;
  justify-content: flex-start !important;
  margin-left: 0 !important;
}

/* 强制覆盖 Element Plus 可能存在的 flex 布局右对齐 */
:deep(.el-menu-item-group__title) {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
}

/* 确保二级和三级菜单的文本都从左边开始 */
:deep(.children-menu .el-menu-item-group__title),
:deep(.children-menu .el-menu-item) {
  padding-left: 20px !important;
  text-align: left !important;
  justify-content: flex-start !important;
}
</style>

