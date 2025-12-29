<template>
  <div class="menu-config-page">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>菜单配置</span>
          <div>
            <el-button type="primary" @click="handleSave">
              <el-icon><Check /></el-icon>
              保存并发布
            </el-button>
            <el-button @click="handlePreview">
              <el-icon><View /></el-icon>
              预览
            </el-button>
          </div>
        </div>
      </template>

      <div class="menu-editor">
        <el-form :model="menuForm" label-width="100px">
          <el-form-item label="菜单结构">
            <div class="menu-tree">
              <!-- 这里可以使用树形组件或拖拽组件来编辑菜单 -->
              <el-input
                v-model="menuForm.menuJson"
                type="textarea"
                :rows="15"
                placeholder="请输入菜单JSON结构"
              />
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, View } from '@element-plus/icons-vue'
import { getWechatMenu, updateWechatMenu } from '@/api/wechat'

const menuForm = reactive({
  menuJson: ''
})

const handleSave = async () => {
  try {
    let menuData
    try {
      menuData = JSON.parse(menuForm.menuJson)
    } catch (error) {
      ElMessage.error('菜单JSON格式错误')
      return
    }
    const res = await updateWechatMenu(menuData)
    const data = res.data || res
    if (data.success) {
      ElMessage.success('保存并发布成功')
    }
  } catch (error) {
    console.error('保存菜单失败:', error)
  }
}

const handlePreview = () => {
  console.log('预览菜单')
}

// 加载菜单数据
const loadMenu = async () => {
  try {
    const res = await getWechatMenu()
    const data = res.data || res
    if (data.success && data.result) {
      menuForm.menuJson = JSON.stringify(data.result, null, 2)
    }
  } catch (error) {
    console.error('加载菜单失败:', error)
  }
}

loadMenu()
</script>

<style scoped lang="scss">
.menu-config-page {
  font-size: 12px;
  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .menu-editor {
      .menu-tree {
        width: 100%;
      }
    }
  }
}
</style>

