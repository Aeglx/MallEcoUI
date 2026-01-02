<template>
  <footer class="footer">
    <!-- 服务特色：多快好省 -->
    <div class="service-features">
      <div class="features-container width_1200_auto">
        <div class="feature-item">
          <div class="feature-icon">多</div>
          <div class="feature-text">品类齐全，轻松购物</div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">快</div>
          <div class="feature-text">多仓直发，极速配送</div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">好</div>
          <div class="feature-text">正品行货，精致服务</div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">省</div>
          <div class="feature-text">天天低价，畅选无忧</div>
        </div>
      </div>
    </div>

    <!-- 服务指南区域 -->
    <div class="service-guide">
      <div class="guide-container width_1200_auto">
        <div class="guide-column" v-for="(guide, index) in guideArr" :key="index">
          <div class="guide-title">{{ guide.title }}</div>
          <ul class="guide-list">
            <li
              v-for="(item, idx) in guide.items"
              :key="idx"
              @click="handleLinkClick(item)"
              class="guide-item"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 友情链接 -->
    <div class="friend-links">
      <div class="links-container width_1200_auto">
        <span
          v-for="(link, index) in moreLink"
          :key="index"
          class="friend-link-item"
          @click="handleLinkClick(link)"
        >
          {{ link }}
        </span>
      </div>
    </div>

    <!-- 备案信息和版权 -->
    <div class="footer-bottom">
      <div class="bottom-container width_1200_auto">
        <div class="icp-info">
          <span v-if="siteInfo.icpCard" class="icp-item">
            <a
              :href="`https://tsm.miit.gov.cn/dxxzsp/xkz/xkzgl/resource/qiyesearch.jsp?num=${siteInfo.icpCard}&type=xuke`"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ siteInfo.icpCard }}
            </a>
          </span>
          <span v-if="siteInfo.icpMessage" class="icp-item">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
              {{ siteInfo.icpMessage }}
            </a>
          </span>
        </div>
        <div class="company-info" v-if="siteInfo.company?.name">
          <a :href="siteInfo.company.href || '#'" class="company-link">
            <img
              v-if="showZhizhao && zhizhaoImgSrc"
              class="zhizhao"
              :src="zhizhaoImgSrc"
              alt="营业执照"
              @error="handleImageError"
            />
            <span>{{ siteInfo.company.name }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="copyright">
      <div class="copyright-container width_1200_auto">
        <p>Copyright © {{ year }} {{ siteName }} 版权所有</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import storage from '@/utils/storage'

const router = useRouter()
const year = new Date().getFullYear()
const siteName = ref<string>('MallEco 购物商城')
const showZhizhao = ref<boolean>(true)
const zhizhaoImgSrc = ref<string>('/zhizhao.jpg')

const siteInfo = ref<any>({
  icpCard: '',
  icpMessage: '',
  company: {
    name: '',
    href: '#'
  }
})

const guideArr = [
  {
    title: '购物指南',
    items: ['购物流程', '会员介绍', '生活旅行', '常见问题']
  },
  {
    title: '配送方式',
    items: ['上门自提', '配送查询', '收取标准', '物流规则']
  },
  {
    title: '支付方式',
    items: ['在线支付', '公司转账', '余额支付', '积分支付']
  },
  {
    title: '售后服务',
    items: ['售后政策', '退款说明', '返修/退货', '取消订单']
  }
]

const moreLink = ['关于我们', '联系我们', '联系客服', '商家帮助', '隐私政策']

const handleLinkClick = (item: string) => {
  const routeUrl = router.resolve({
    path: '/article'
  })
  window.open(routeUrl.href, '_blank')
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img) {
    showZhizhao.value = false
  }
}

onMounted(() => {
  const storedSiteName = storage.getItem('siteName')
  if (storedSiteName) {
    siteName.value = storedSiteName
  }
  // TODO: 从API获取站点配置信息
})
</script>

<style scoped lang="scss">
.footer {
  width: 100%;
  background: #ffffff;
  margin-top: 40px;
}

.width_1200_auto {
  width: 1200px;
  margin: 0 auto;
}

/* 服务特色区域 */
.service-features {
  padding: 30px 0;
  border-bottom: 1px solid #e5e5e5;
}

.features-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.feature-item {
  display: flex;
  align-items: center;
  cursor: default;
}

.feature-icon {
  width: 36px;
  height: 36px;
  border: 1.4px solid #cecece;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: normal;
  color: #333;
  margin-right: 11px;
}

.feature-text {
  font-size: 16px;
  font-weight: normal;
  color: #333;
}

/* 服务指南区域 */
.service-guide {
  padding: 40px 0;
  border-bottom: 1px solid #e5e5e5;
}

.guide-container {
  display: flex;
  justify-content: space-between;
}

.guide-column {
  flex: 1;
}

.guide-title {
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 15px;
}

.guide-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guide-item {
  font-size: 12px;
  color: #666666;
  line-height: 24px;
  cursor: pointer;

  &:hover {
    color: $theme_color;
  }
}

/* 友情链接 */
.friend-links {
  padding: 20px 0;
  border-bottom: 1px solid #e5e5e5;
  text-align: center;
}

.links-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.friend-link-item {
  font-size: 12px;
  color: #666666;
  cursor: pointer;
  padding: 0 10px;
  border-right: 1px solid #e5e5e5;

  &:last-child {
    border-right: none;
  }

  &:hover {
    color: $theme_color;
  }
}

/* 底部信息 */
.footer-bottom {
  padding: 20px 0;
  border-bottom: 1px solid #e5e5e5;
}

.bottom-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.icp-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icp-item {
  font-size: 12px;
  color: #999999;

  a {
    color: #999999;
    text-decoration: none;

    &:hover {
      color: $theme_color;
    }
  }
}

.company-info {
  display: flex;
  align-items: center;
}

.company-link {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #3457ff;
  text-decoration: none;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
}

.zhizhao {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

/* 版权信息 */
.copyright {
  padding: 20px 0;
  background: #f5f5f5;
  text-align: center;
}

.copyright-container {
  p {
    font-size: 12px;
    color: #999999;
    margin: 0;
  }
}
</style>
