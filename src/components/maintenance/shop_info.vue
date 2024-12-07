<script setup>
import { ref, onMounted, inject } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import MapSelector from '../widget/MapSelector.vue'

const route = useRoute()
const router = useRouter()
const sid = route.params.sid

if (sid === '') {
  router.push('/')
}

const shop_name = ref('')
const tel_of_leader = ref('')
const location = ref('')
const tags = ref([])
const geo_l_x = ref(null)
const geo_l_y = ref(null)
const turnstile_token = ref('') // 这里假设前端会处理turnstile token的验证部分

const api_endpoint = inject('api_endpoint')

// Snackbar properties
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

// 获取店铺信息
const fetchShopInfo = async () => {
  try {
    const response = await axios.get(`${api_endpoint}/get_shop_info`, {
      params: { sid }
    })
    const data = response.data
    shop_name.value = data.shop_name
    tel_of_leader.value = data.tel_of_leader
    location.value = data.location
    tags.value = data.tags.join(', ') // 假设tags是以逗号分隔的字符串
    geo_l_x.value = data.geo_location_x
    geo_l_y.value = data.geo_location_y
  } catch (error) {
    console.error('Error fetching shop info:', error)
    showSnackbar('获取店铺信息失败', 'error')
    router.push('/') // 如果获取失败，跳转回主页或其他合适的地方
  }
}

// 更新店铺信息
const updateShopInfo = async () => {
  try {
    if (!turnstile_token.value) {
      showSnackbar('请完成人机验证', 'warning')
      return
    }

    const response = await axios.post(`${api_endpoint}/update_shop`, {
      sid,
      shop_name: shop_name.value,
      tel_of_leader: tel_of_leader.value,
      location: location.value,
      tags: tags.value.split(',').map(tag => tag.trim()), // 将字符串转换为数组
      geo_l_x: geo_l_x.value,
      geo_l_y: geo_l_y.value,
      turnstile_token: turnstile_token.value // 确保这里有一个有效的token
    })

    if (response.data.code === 200) {
      showSnackbar('店铺信息更新成功', 'success')
    } else {
      showSnackbar('店铺信息更新失败', 'error')
    }
  } catch (error) {
    console.error('Error updating shop info:', error)
    showSnackbar('店铺信息更新失败', 'error')
  }
}

// 显示 Snackbar
const showSnackbar = (message, color) => {
  snackbarText.value = message
  snackbarColor.value = color
  snackbar.value = true
}

// 处理地图选点组件返回的坐标
const handlePickedX = (lng) => {
  geo_l_x.value = lng
}

const handlePickedY = (lat) => {
  geo_l_y.value = lat
}

// 加载Turnstile脚本
onMounted(() => {
  fetchShopInfo()

  const script = document.createElement('script')
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=0x4AAAAAAA1EWjwS3Dg4LMxI'
  script.async = true
  script.onload = () => {
    window.turnstile.render('#cf-turnstile-widget', {
      sitekey: '0x4AAAAAAA1EWjwS3Dg4LMxI',
      callback: (token) => {
        turnstile_token.value = token
      }
    })
  }
  document.head.appendChild(script)
})
</script>

<template>
  <v-container class="text-center mt-10">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">编辑店铺信息</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="updateShopInfo">
              <v-text-field
                  label="店铺名称"
                  variant="outlined"
                  v-model="shop_name"
                  prepend-icon="mdi-store"
                  required
              ></v-text-field>
              <v-text-field
                  label="负责人电话"
                  variant="outlined"
                  v-model="tel_of_leader"
                  prepend-icon="mdi-phone"
                  required
              ></v-text-field>
              <v-text-field
                  label="位置"
                  variant="outlined"
                  v-model="location"
                  prepend-icon="mdi-map-marker"
                  required
              ></v-text-field>
              <v-text-field
                  label="标签（用逗号分隔）"
                  variant="outlined"
                  v-model="tags"
                  prepend-icon="mdi-tag"
                  required
              ></v-text-field>
              <v-row align="center">
                <v-col cols="6">
                  <v-text-field
                      label="地理坐标X"
                      variant="outlined"
                      v-model="geo_l_x"
                      type="number"
                      prepend-icon="mdi-crosshairs-gps"
                      required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                      label="地理坐标Y"
                      variant="outlined"
                      v-model="geo_l_y"
                      type="number"
                      prepend-icon="mdi-crosshairs-gps"
                      required
                  ></v-text-field>
                </v-col>
              </v-row>
              <MapSelector :initialGeoX="geo_l_x" :initialGeoY="geo_l_y" @update:PickedX="handlePickedX"
                           @update:PickedY="handlePickedY"/>
              <br><br>
              <div id="cf-turnstile-widget"/>
              <br><br>
              <v-btn type="submit" color="primary" block>保存更改</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.headline {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 16px;
}
</style>
