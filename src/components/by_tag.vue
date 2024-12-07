<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOptionStore } from '../store' // 确保路径正确
import axios from 'axios'
import { inject } from 'vue'

const OptionStore = useOptionStore()
const tag = ref('')
const subSearchTerm = ref('')
const shops = ref([])
const api_endpoint = inject('api_endpoint')

onMounted(() => {
  if (OptionStore.getCurrentTag.search_tag_now === true) {
    tag.value = OptionStore.getCurrentTag.currentTag
    OptionStore.setCurrentTag(null, false) // 使用 action 修改状态
    onSearch()
  }
})

const onSearch = async () => {
  try {
    const response = await axios.get(`${api_endpoint}/get_sid_by_tags`, {
      params: { tags: tag.value }
    })
    shops.value = response.data
  } catch (error) {
    console.error('Error fetching shops:', error)
  }
}

const filteredShops = computed(() => {
  return shops.value.filter(shop =>
      shop.shop_name.toLowerCase().includes(subSearchTerm.value.toLowerCase()) ||
      shop.location.toLowerCase().includes(subSearchTerm.value.toLowerCase())
  )
})
</script>

<template>
  <v-container class="text-center mt-10">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title class="headline">标签/IP 搜索</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onSearch">
              <v-text-field
                  label="标签/IP"
                  variant="outlined"
                  v-model="tag"
                  prepend-icon="mdi-magnify"
                  clearable
              ></v-text-field>
              <v-btn type="submit" color="primary" block>搜索</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
        <v-card class="mt-4" v-if="shops.length > 0">
          <v-card-title>搜索结果</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onSearch">
              <v-text-field
                  label="店铺名称或地址"
                  variant="outlined"
                  v-model="subSearchTerm"
                  prepend-icon="mdi-magnify"
                  clearable
              ></v-text-field>
            </v-form>
            <v-list dense>
              <v-list-item v-for="shop in filteredShops" :key="shop.sid" style="text-align: left" link :to="'/shop/'+shop.sid">
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
