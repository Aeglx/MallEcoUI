<template>
  <div class="foot">
    <el-row justify="space-around" class="help">
      <a class="item" href="javascript:void(0)" @click.prevent>帮助</a>
      <a class="item" href="javascript:void(0)" @click.prevent>隐私</a>
      <a class="item" href="javascript:void(0)" @click.prevent>条款</a>
    </el-row>
    <el-row justify="center" class="copyright">
      Copyright © {{ year }} - Present
      <span class="company-name" style="margin: 0 5px">
        {{ config.title }}
      </span>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import config from '@/config'

const year = ref(new Date().getFullYear())
</script>

<style lang="scss" scoped>
.foot {
  position: fixed;
  bottom: 4vh;
  width: 368px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  .help {
    margin: 0 auto;
    margin-bottom: 1vh;
    width: 60%;
    .item {
      color: rgba(0, 0, 0, 0.45);
    }
    :hover {
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .copyright {
    text-align: center;
  }
}
</style>

