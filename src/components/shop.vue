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
const dialog = ref(false)
const searchQuery = ref('')
const filteredTagsAndIPs = ref([])
const isAndroid = /android/i.test(navigator.userAgent)

import { useOptionStore } from '../store' // 确保路径正确
const optionStore = useOptionStore() // 使用 Pinia store
import { useRouter } from 'vue-router'
const router = useRouter()

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
    title.value = shop.value.shop_name + " 谷店详情 | " + title.value;
    updateFilteredTagsAndIPs();
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

const openDialog = () => {
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
}

const updateFilteredTagsAndIPs = () => {
  if (shop.value) {
    const tagsAndIPs = [...shop.value.tags];
    filteredTagsAndIPs.value = tagsAndIPs.filter(item =>
        item.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
}



const to_by_tag_page = (tag) => {
  optionStore.setCurrentTag(tag,true);
  router.push('/by_tag');
}
const edit_infos = () => {
  router.push('/maintenance/info/' + shop.value.sid);
}
const edit_tags = () => {
  router.push('/maintenance/tags/' + shop.value.sid);
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
              <v-btn variant="text" @click="edit_infos">
                修改谷店信息
              </v-btn>
              <v-list-item @click="openDialog">
                <v-list-item-icon>
                  <v-icon>mdi-tag</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>标签 (点击此处查看全部和修改)</v-list-item-title>
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
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card rounded="lg">
        <v-card-title>
          标签和IP
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          &nbsp;
          <v-btn icon @click="edit_tags">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="searchQuery"
              label="搜索..."
              outlined
              clearable
              @input="updateFilteredTagsAndIPs"
          ></v-text-field>
          <div style="max-height: 300px; overflow-y: auto;">
            <v-list>
              <v-list-item v-for="(item, index) in filteredTagsAndIPs" :key="index" link @click="to_by_tag_page(item)">
                <v-list-item-content>
                  <v-list-item-title>{{ item }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
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
