<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTheme } from 'vuetify'

const drawer = ref(null)
const theme = useTheme()

// 检测系统主题偏好
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

// 读取本地存储中的用户主题设置
const savedTheme = localStorage.getItem('theme')

// 设置初始主题
if (savedTheme) {
  theme.global.name.value = savedTheme
} else {
  theme.global.name.value = prefersDark.matches ? 'dark' : 'light'
}

// 监听系统主题变化
watch(prefersDark, (isDark) => {
  if (!localStorage.getItem('theme')) {
    theme.global.name.value = isDark ? 'dark' : 'light'
  }
})

// 监听主题切换并保存到本地存储
watch(theme.global.name, (newTheme) => {
  localStorage.setItem('theme', newTheme)
})

</script>

<template>
  <v-app id="inspire" :theme="theme.global.name.value">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense nav>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6 text-center" style="min-height: 20px"><strong>折跃菜单</strong></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item-group>
          <v-list-item prepend-icon="mdi-home" title="首页" link to="/"></v-list-item>
          <p class="divider_title">谷店检索</p>
          <v-list-item prepend-icon="mdi-magnify" title="快速搜索" link to="/search"></v-list-item>
          <v-list-item prepend-icon="mdi-map-marker" title="按地区检索" link to="/by_region"></v-list-item>
          <v-list-item prepend-icon="mdi-tag" title="按标签/IP检索" link to="/by_tag"></v-list-item>
          <p class="divider_title">吃谷工具</p>
          <v-list-item prepend-icon="mdi-plus" title="添加谷店" link to="/add_shop"></v-list-item>
          <v-list-item prepend-icon="mdi-package-variant" title="谷子查找" link disabled></v-list-item>
          <v-list-item prepend-icon="mdi-information" title="谷子信息" link disabled></v-list-item>
          <p class="divider_title">站点信息</p>
          <v-list-item prepend-icon="mdi-information" title="关于" link to="/about"></v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>ComicMap 全国谷店地图 Beta</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="theme.global.name.value = theme.global.name.value === 'light' ? 'dark' : 'light'"><!-- 切换暗黑模式 -->
        <v-icon v-if="theme.global.name.value === 'light'">mdi-weather-night</v-icon>
        <v-icon v-else>mdi-white-balance-sunny</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer app>
      <v-container>
        <div class="text-center">
          <p>ComicMap Project - 全国谷店地图</p>
          <p>ComicMap Beta v1.4.18(Regional pilot)</p>
          <p>Copyright © 萌数次元Moedigital 2022-{{ new Date().getFullYear() }} 保留所有权利</p>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style scoped>
.divider_title {
  font-weight: bold;
  padding: 3px 0;
  margin: 1px 5px;
  color: gray;
}

/* 新增样式，确保“折跃菜单”不会被遮挡 */
.v-list-item__title {
  white-space: normal;
}
</style>
