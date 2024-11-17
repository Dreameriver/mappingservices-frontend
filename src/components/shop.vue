<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { inject } from 'vue'
import MapContainer from "./widget/MapContainer.vue";
import { useTitle } from '@vueuse/core'
const title = useTitle()

const route = useRoute()
const api_endpoint = inject('api_endpoint')
const shop = ref(null)
const error = ref('')
const isAndroid = /android/i.test(navigator.userAgent)

onMounted(async () => {
  const sid = route.params.sid
  if (!sid) {
    error.value = '该谷店不存在'
    return
  }
  try {
    const response = await axios.get(`${api_endpoint}/get_shop_info`, {
      params: { sid }
    })
    shop.value = response.data
    title.value = shop.value.shop_name+" 谷店详情 | "+title.value;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      error.value = '该谷店不存在'
    } else {
      console.error('Error fetching shop details:', err)
      error.value = '获取店铺信息失败'
    }
  }
})

const getGaodeMapUrl = (lat, lng, name) => {
  if (isAndroid) {
    return `androidamap://viewMap?sourceApplication=ComicMap&poiname=${encodeURIComponent(name)}&lat=${lat}&lon=${lng}`;
  } else {
    return `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(name)}&src=ComicMap`;
  }
}

const getButtonLabel = () => {
  return isAndroid ? '前往高德地图APP' : '前往高德地图';
}
</script>

<template>
  <v-container class="mt-10">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card v-if="shop">
          <v-card-title class="headline">{{ shop.shop_name }}</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-map-marker</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>地址</v-list-item-title>
                  <v-list-item-subtitle>{{ shop.location }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-phone</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>电话</v-list-item-title>
                  <v-list-item-subtitle>{{ shop.tel_of_leader }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-tag</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>标签</v-list-item-title>
                  <v-list-item-subtitle>{{ shop.tags.join(', ') }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-map</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>地图</v-list-item-title>
                  <a :href="getGaodeMapUrl(shop.geo_location_y, shop.geo_location_x, shop.shop_name)" target="_blank">
                    <v-btn small color="primary">{{ getButtonLabel() }}</v-btn>
                  </a>
                  <br><br>
                  <MapContainer :geo_x="shop.geo_location_x" :geo_y="shop.geo_location_y" :shop_name="shop.shop_name"/>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        <v-card v-else-if="error">
          <v-card-title class="headline error--text">{{ error }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.headline {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 16px;
}

.error--text {
  color: red;
}
</style>