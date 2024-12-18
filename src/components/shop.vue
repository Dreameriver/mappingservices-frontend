<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { inject } from 'vue'
import MapContainer from "./widget/MapContainer.vue";
import { useTitle } from '@vueuse/core'
import * as XLSX from 'xlsx'

const title = useTitle()

const route = useRoute()
const api_endpoint = inject('api_endpoint')
const shop = ref(null)
const error = ref('')
const dialog = ref(false)
const formatDialog = ref(false)
const searchQuery = ref('')
const filteredTagsAndIPs = ref([])
const isAndroid = /android/i.test(navigator.userAgent)
const selectedFormat = ref('csv') // 默认选择 CSV 格式

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

const tagDisplay = computed(() => {
  return shop.value && shop.value.tags.length > 1 ? shop.value.tags.join(', ') : '店家拒绝提供标签/IP或未录入';
});

const to_by_tag_page = (tag) => {
  optionStore.setCurrentTag(tag, true);
  router.push('/by_tag');
}
const edit_infos = () => {
  router.push('/maintenance/info/' + shop.value.sid);
}
const edit_tags = () => {
  router.push('/maintenance/tags/' + shop.value.sid);
}

const exportData = (format) => {
  if (!shop.value || !shop.value.tags || shop.value.tags.length === 0) {
    alert('没有可用的数据可供导出');
    return;
  }

  if (format === 'csv') {
    let csvContent = "\ufeff"; // BOM for UTF-8
    csvContent += "sid,tags_name\n";

    shop.value.tags.forEach((tag) => {
      csvContent += `${shop.value.sid},${tag}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${shop.value.shop_name}_tags.csv`);
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } else if (format === 'xlsx') {
    const data = shop.value.tags.map(tag => ({ sid: shop.value.sid, tags_name: tag }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, `${shop.value.shop_name}_tags.xlsx`);
  }
}

const showFormatDialog = () => {
  formatDialog.value = true;
}

const confirmExport = () => {
  exportData(selectedFormat.value);
  formatDialog.value = false;
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
                  <v-list-item-subtitle>{{ tagDisplay }}</v-list-item-subtitle>
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
          &nbsp;
          <v-btn icon @click="showFormatDialog">
            <v-icon>mdi-download</v-icon>
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
    <v-dialog v-model="formatDialog" max-width="300px" persistent>
      <v-card>
        <v-card-title>选择导出格式</v-card-title>
        <v-card-text>
          <v-radio-group v-model="selectedFormat" row>
            <v-radio label="CSV (UTF-8, 导入数据库/学习研究使用)" value="csv"></v-radio>
            <v-radio label="XLSX (支持Excel打开)" value="xlsx"></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="formatDialog = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="confirmExport">确认</v-btn>
        </v-card-actions>
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
