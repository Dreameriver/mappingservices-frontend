<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { inject } from 'vue'

const shop_name = ref('')
const shops = ref([])
const api_endpoint = inject('api_endpoint')

const onSearch = async () => {
  try {
    const response = await axios.get(`${api_endpoint}/get_sid_by_name`, {
      params: { shop_name: shop_name.value }
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
          <v-card-title class="headline">快速搜索</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="onSearch">
              <v-text-field
                  label="搜索内容(暂仅支持店铺名称)"
                  variant="outlined"
                  v-model="shop_name"
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
            <v-list dense>
              <v-list-item v-for="shop in shops" :key="shop.sid" style="text-align: left" link :to="'/shop/'+shop.sid">
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
