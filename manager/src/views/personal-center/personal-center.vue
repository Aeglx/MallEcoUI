<template>
  <div class="own-space">
    <Card class="own-space-new">
      <div class="own-wrap">
        <div style="width: 240px">
          <Menu :active-name="activeName" theme="light" @on-select="changeMenu">
            <MenuItem name="基本信息">基本信息</MenuItem>
            <MenuItem name="安全设置">安全设置</MenuItem>
          </Menu>
        </div>
        <div style="padding: 8px 40px; width: 100%">
          <div class="title">{{ currMenu }}</div>
          <div>
            <div v-show="currMenu === '基本信息'">
              <Form ref="userFormRef" :model="userForm" :label-width="90" label-position="left">
                <FormItem label="用户头像：">
                  <div>头像上传功能待实现</div>
                </FormItem>
                <FormItem label="用户名：">
                  {{ userForm.username }}
                </FormItem>
                <FormItem label="昵称：" prop="nickName">
                  <Input maxlength="20" v-model="userForm.nickName" style="width: 250px" />
                </FormItem>
                <FormItem>
                  <Button type="primary" :loading="saveLoading" @click="saveUserInfo">
                    保存
                  </Button>
                  <Button @click="cancelEdit" style="margin-left: 8px">取消</Button>
                </FormItem>
              </Form>
            </div>
            <div v-show="currMenu === '安全设置'">
              <p>安全设置功能待实现</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Message } from 'view-design'
import Cookies from 'js-cookie'
import { userInfo, userInfoEdit } from '@/api/index'

const activeName = ref('基本信息')
const currMenu = ref('基本信息')
const userFormRef = ref()
const saveLoading = ref(false)

const userForm = ref({
  username: '',
  nickName: '',
  avatar: ''
})

const changeMenu = (name: string) => {
  currMenu.value = name
}

const saveUserInfo = async () => {
  userFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      saveLoading.value = true
      try {
        const res = await userInfoEdit(userForm.value)
        if (res.success) {
          ElMessage.success('保存成功')
          // 更新本地存储的用户信息
          const userInfoStr = Cookies.get('userInfoManager')
          if (userInfoStr) {
            const user = JSON.parse(userInfoStr)
            user.nickName = userForm.value.nickName
            Cookies.set('userInfoManager', JSON.stringify(user))
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        saveLoading.value = false
      }
    }
  })
}

const cancelEdit = () => {
  loadUserInfo()
}

const loadUserInfo = async () => {
  try {
    const res = await userInfo()
    if (res.success) {
      userForm.value = {
        username: res.result.username || '',
        nickName: res.result.nickName || '',
        avatar: res.result.avatar || ''
      }
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped lang="scss">
.own-space {
  padding: 20px;
}

.own-space-new {
  .own-wrap {
    display: flex;
  }

  .title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 20px;
  }
}
</style>

