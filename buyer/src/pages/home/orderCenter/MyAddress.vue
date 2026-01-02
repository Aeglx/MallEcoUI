<template>
  <div class="my-address">
    <div class="header">
      <h2>收货地址</h2>
      <el-button type="primary" @click="handleAdd">新增地址</el-button>
    </div>
    <div class="address-list">
      <el-empty v-if="addressList.length === 0" description="暂无收货地址" />
      <div v-else v-for="address in addressList" :key="address.id" class="address-item">
        <div class="address-info">
          <div class="name-phone">
            <span>{{ address.name }}</span>
            <span>{{ address.mobile }}</span>
            <el-tag v-if="address.defaultFlag" type="danger" size="small">默认</el-tag>
          </div>
          <div class="address-detail">{{ address.fullAddress }}</div>
        </div>
        <div class="address-actions">
          <el-button link @click="handleEdit(address)">编辑</el-button>
          <el-button link @click="handleSetDefault(address.id)" v-if="!address.defaultFlag"
            >设为默认</el-button
          >
          <el-button link type="danger" @click="handleDelete(address.id)">删除</el-button>
        </div>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="收货人" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" />
        </el-form-item>
        <el-form-item label="所在地区" prop="region">
          <el-cascader
            v-model="form.region"
            :options="regionOptions"
            :props="{
              expandTrigger: 'hover',
              lazy: true,
              lazyLoad: async (node: any, resolve: any) => {
                const children = await loadRegionData(node.value)
                resolve(children)
              }
            }"
            @change="handleRegionChange"
            placeholder="请选择省/市/区"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input v-model="form.detail" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.defaultFlag">设为默认地址</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '@/api/member'
import { getRegion } from '@/api/common'

const formRef = ref<FormInstance>()
const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('新增地址')
const addressList = ref<any[]>([])
const currentId = ref<string>('')

const form = reactive({
  name: '',
  mobile: '',
  region: [],
  detail: '',
  defaultFlag: false
})

const regionOptions = ref<any[]>([]) // 地区数据（三级联动）

// 加载地区数据
const loadRegionData = async (parentId: string = '0') => {
  try {
    const res = await getRegion(parentId)
    const data = res.data || res
    if (data.success && data.result) {
      const regions = Array.isArray(data.result) ? data.result : []
      return regions.map((item: any) => ({
        value: item.id,
        label: item.name,
        children: [] as any[]
      }))
    }
    return []
  } catch (error) {
    console.error('加载地区数据失败:', error)
    return []
  }
}

// 初始化地区数据
const initRegionOptions = async () => {
  try {
    // 加载省份
    const provinces = await loadRegionData('0')
    regionOptions.value = provinces

    // 如果表单已有地区，加载对应的城市和区县
    if (form.region && form.region.length > 0) {
      await loadFullRegionPath(form.region)
    }
  } catch (error) {
    console.error('初始化地区数据失败:', error)
  }
}

// 加载完整的地区路径（用于编辑时回显）
const loadFullRegionPath = async (regionIds: string[]) => {
  if (regionIds.length === 0) return

  try {
    // 加载省份
    const provinces = await loadRegionData('0')
    regionOptions.value = provinces

    if (regionIds.length >= 1) {
      // 加载城市
      const cities = await loadRegionData(regionIds[0])
      const provinceIndex = regionOptions.value.findIndex((p: any) => p.value === regionIds[0])
      if (provinceIndex !== -1) {
        regionOptions.value[provinceIndex].children = cities

        if (regionIds.length >= 2) {
          // 加载区县
          const districts = await loadRegionData(regionIds[1])
          const cityIndex = cities.findIndex((c: any) => c.value === regionIds[1])
          if (cityIndex !== -1) {
            regionOptions.value[provinceIndex].children[cityIndex].children = districts
          }
        }
      }
    }
  } catch (error) {
    console.error('加载完整地区路径失败:', error)
  }
}

// 地区选择变化事件
const handleRegionChange = async (value: any) => {
  if (!value || value.length === 0) {
    form.region = []
    return
  }

  // 重置后续级别
  if (value.length === 1) {
    // 选择了省份，加载城市
    const cities = await loadRegionData(value[0])
    const provinceIndex = regionOptions.value.findIndex((p: any) => p.value === value[0])
    if (provinceIndex !== -1) {
      regionOptions.value[provinceIndex].children = cities
    }
  } else if (value.length === 2) {
    // 选择了城市，加载区县
    const districts = await loadRegionData(value[1])
    const provinceIndex = regionOptions.value.findIndex((p: any) => p.value === value[0])
    if (provinceIndex !== -1) {
      const cityIndex = regionOptions.value[provinceIndex].children.findIndex(
        (c: any) => c.value === value[1]
      )
      if (cityIndex !== -1) {
        regionOptions.value[provinceIndex].children[cityIndex].children = districts
      }
    }
  }
}

const rules: FormRules = {
  name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

const getAddresses = async () => {
  try {
    const res = await getAddressList()
    const data = res.data || res
    if (data.success && data.result) {
      addressList.value = data.result || []
    }
  } catch (error) {
    console.error('获取地址列表失败:', error)
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增地址'
  currentId.value = ''
  Object.assign(form, {
    name: '',
    mobile: '',
    region: [],
    detail: '',
    defaultFlag: false
  })
  dialogVisible.value = true
}

const handleEdit = async (address: any) => {
  dialogTitle.value = '编辑地址'
  currentId.value = address.id
  // 解析地址路径
  let regionIds: string[] = []
  if (address.consigneeAddressPath) {
    regionIds = address.consigneeAddressPath.split(',').filter((id: string) => id)
  }
  Object.assign(form, {
    name: address.name || address.consigneeName,
    mobile: address.mobile || address.consigneeMobile,
    region: regionIds,
    detail: address.detail || address.consigneeDetail,
    defaultFlag: address.defaultFlag
  })
  dialogVisible.value = true
  // 加载完整地区路径
  if (regionIds.length > 0) {
    await loadFullRegionPath(regionIds)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const params = {
          ...form,
          consigneeName: form.name,
          consigneeMobile: form.mobile,
          consigneeAddressPath: form.region.join(','),
          consigneeDetail: form.detail,
          defaultFlag: form.defaultFlag
        }
        if (currentId.value) {
          await updateAddress(currentId.value, params)
        } else {
          await addAddress(params)
        }
        ElMessage.success(currentId.value ? '更新成功' : '添加成功')
        dialogVisible.value = false
        getAddresses()
      } catch (error: any) {
        ElMessage.error(error.message || '操作失败')
      }
    }
  })
}

const handleSetDefault = async (id: string) => {
  try {
    await setDefaultAddress(id)
    ElMessage.success('设置成功')
    getAddresses()
  } catch (error: any) {
    ElMessage.error(error.message || '设置失败')
  }
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个地址吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteAddress(id)
    ElMessage.success('删除成功')
    getAddresses()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  getAddresses()
  initRegionOptions()
})
</script>

<style scoped lang="scss">
.my-address {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.address-list {
  margin-top: 20px;
}

.address-item {
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: #f31947;
  }
}

.address-info {
  flex: 1;
}

.name-phone {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 10px;
  font-weight: bold;
}

.address-detail {
  color: #666;
}
</style>

