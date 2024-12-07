<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import { inject } from 'vue'
import region_list from '../datas/region.json'
import MapSelector from './widget/MapSelector.vue'
import { useRouter } from 'vue-router'

const api_endpoint = inject('api_endpoint')
const selectedProvince = ref('')
const selectedCity = ref('')
const shopName = ref('')
const locationDetail = ref('')
const tags = ref([])
const telOfLeader = ref('')
const provideTel = ref(false)
const creator = 0
const turnstileToken = ref(null)
const geoLX = ref(104.06) // 初始经度设置为中国的经度
const geoLY = ref(30.67) // 初始纬度设置为中国的纬度
const tagInput = ref('')
const router = useRouter()
const snackbar = ref({
  show: false,
  text: '',
  color: ''
})

// 判断设备类型
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// 根据已选择的省份获取城市列表
const getCitiesByProvince = (province) => {
  return province ? region_list.provinces.find(p => p.provinceName === province)?.citys : []
}

// 监听省变化时更新城市选项
watch(selectedProvince, (newVal) => {
  selectedCity.value = ''
})

// 加载Turnstile脚本
onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=0x4AAAAAAA1EWjwS3Dg4LMxI'
  script.async = true
  script.onload = () => {
    window.turnstile.render('#cf-turnstile-widget', {
      sitekey: '0x4AAAAAAA1EWjwS3Dg4LMxI',
      callback: (token) => {
        turnstileToken.value = token
      }
    })
  }
  document.head.appendChild(script)
})

// 处理地图选点组件返回的坐标
const handlePickedX = (lng) => {
  geoLX.value = lng
}

const handlePickedY = (lat) => {
  geoLY.value = lat
}

// 添加标签
const addTag = () => {
  if (tagInput.value.trim()) {
    tags.value.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

// 删除标签
const removeTag = (index) => {
  console.log('Removing tag at index:', index) // 添加调试信息
  tags.value.splice(index, 1)
}

// 提交表单的方法
const onSubmit = async () => {
  if (!turnstileToken.value) {
    alert('请完成人机验证')
    return
  }

  try {
    const response = await axios.post(`${api_endpoint}/new_shop`, {
      shop_name: shopName.value,
      tel_of_leader: provideTel.value ? telOfLeader.value : 'None',
      location: `${selectedProvince.value} ${selectedCity.value} ${locationDetail.value}`,
      tags: tags.value,
      geo_l_x: geoLX.value || null,
      geo_l_y: geoLY.value || null,
      turnstile_token: turnstileToken.value,
      creator: creator
    })

    if (response.data.code === 200) {
      snackbar.value.show = true
      snackbar.value.text = '提交成功, 审核后可见, 三秒后返回首页'
      snackbar.value.color = 'success'
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } else {
      snackbar.value.show = true
      snackbar.value.text = response.data.msg || '未知错误'
      snackbar.value.color = 'error'
      console.error('Unexpected response:', response.data)
    }
  } catch (error) {
    snackbar.value.show = true
    snackbar.value.text = error.message || '网络请求失败'
    snackbar.value.color = 'error'
    console.error('Error submitting form:', error)
  }
}

// 获取当前位置的方法
let hasFetchedLocation = ref(false)

const handleGetLocation = () => {
  console.log('Fetching geolocation...')
  if (!hasFetchedLocation.value) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          position => {
            geoLX.value = position.coords.longitude
            geoLY.value = position.coords.latitude
            hasFetchedLocation.value = true
            console.log('Geolocation fetched successfully:', geoLX.value, geoLY.value)
          },
          error => {
            console.error('Failed to get geolocation:', error)
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  } else {
    console.log('Location already fetched.')
  }
}
</script>

<template>
  <v-container class="text-center mt-10">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">添加谷店</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onSubmit">
              <v-text-field
                  label="店铺名称"
                  v-model="shopName"
                  variant="outlined"
                  required
              ></v-text-field>
              <v-select
                  label="请选择省份"
                  :items="region_list.provinces.map(p => p.provinceName)"
                  v-model="selectedProvince"
                  variant="outlined"
                  clearable
                  required
              ></v-select>
              <v-select
                  label="请选择城市"
                  :items="getCitiesByProvince(selectedProvince).map(c => c.cityName)"
                  v-model="selectedCity"
                  variant="outlined"
                  :disabled="!selectedProvince"
                  clearable
                  required
              ></v-select>
              <v-text-field
                  label="详细地址"
                  v-model="locationDetail"
                  variant="outlined"
                  required
              ></v-text-field>
              <v-checkbox
                  label="是否提供联系电话"
                  v-model="provideTel"
                  color="primary"
              ></v-checkbox>
              <v-text-field
                  v-if="provideTel"
                  label="请输入11位中国大陆电话号码"
                  v-model="telOfLeader"
                  variant="outlined"
                  :rules="[v => !v || /^1\d{10}$/.test(v) || '请输入有效的11位中国大陆电话号码']"
                  required
              ></v-text-field>
              <div>
                <p>请在地图上选取店铺的位置。</p>
                <MapSelector :initialGeoX="geoLX" :initialGeoY="geoLY" @update:PickedX="handlePickedX" @update:PickedY="handlePickedY" />
                <br><br>
                <v-btn v-if="isMobileDevice" color="primary" block @click="handleGetLocation">获取当前位置</v-btn>
              </div>
              <br><br>
              <v-text-field
                  label="添加标签"
                  v-model="tagInput"
                  variant="outlined"
                  append-inner-icon="mdi-plus"
                  @keydown.enter="addTag"
                  @click:append-inner="addTag"
              ></v-text-field>
              <v-chip-group column multiple>
                <v-chip
                    v-for="(tag, index) in tags"
                    :key="index"
                    close
                    @click="removeTag(index)"
                >
                  {{ tag }}
                </v-chip>
              </v-chip-group>
              <br><br>
              <div id="cf-turnstile-widget"></div>
              <br>
              <v-btn type="submit" color="primary" block>提交</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">{{ snackbar.text }}</v-snackbar>
  </v-container>
</template>

<style scoped>
.headline {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 16px;
}
</style>