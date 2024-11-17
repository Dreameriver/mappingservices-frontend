<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { inject } from 'vue'
import region_list from '../datas/region.json'

const selectedProvince = ref('')
const selectedCity = ref('')
const shops = ref([])

const api_endpoint = inject('api_endpoint')

// 根据已选择的省份获取城市列表
const getCitiesByProvince = (province) => {
  return province ? region_list.provinces.find(p => p.provinceName === province).citys : []
}

// 监听省变化时更新城市选项
watch(selectedProvince, (newVal) => {
  selectedCity.value = ''
})

// 搜索店铺的方法
const onSearch = async () => {
  try {
    const response = await axios.get(`${api_endpoint}/get_sid_by_location`, {
      params: {location: selectedCity.value}
    })
    shops.value = response.data
  } catch (error) {
    console.error('Error fetching shops:', error)
  }
}
</script>

<template>
  <v-container class="text-center mt-10">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">地区搜索</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onSearch">
              <v-select
                  label="请选择省份"
                  :items="region_list.provinces.map(p => p.provinceName)"
                  v-model="selectedProvince"
                  variant="outlined"
                  clearable
              ></v-select>
              <v-select
                  label="请选择城市"
                  :items="getCitiesByProvince(selectedProvince).map(c => c.cityName)"
                  v-model="selectedCity"
                  variant="outlined"
                  :disabled="!selectedProvince"
                  clearable
              ></v-select>
              <v-btn type="submit" color="primary" block :disabled="!selectedCity">搜索</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
        <v-card class="mt-4" v-if="shops.length > 0">
          <v-card-title>搜索结果</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item v-for="shop in shops" :key="shop.sid" style="text-align: left" link
                           :to="'/shop/' + shop.sid">
                <v-list-item-content>
                  <v-list-item-title>{{ shop.shop_name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ shop.location }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
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
</style>