<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { inject } from 'vue'

const route = useRoute()
const sid = route.params.sid
const api_endpoint = inject('api_endpoint')

const initialTags = ref([])
const userAddedTags = ref([])
const removeTags = ref([])
const shop_name = ref('')
const newTagInput = ref('') // 新增中间变量

const is_exist_shop = ref(true)

const fetchShopInfo = async () => {
  try {
    const response = await axios.get(`${api_endpoint}/get_shop_info`, {
      params: { sid }
    })
    initialTags.value = response.data.tags || []
    shop_name.value = response.data.shop_name
  } catch (error) {
    console.error('Error fetching shop info:', error)
    is_exist_shop.value = false
  }
}

const handleTagClick = (tag, isInitial) => {
  if (isInitial) {
    if (!removeTags.value.includes(tag)) {
      removeTags.value.push(tag)
    } else {
      removeTags.value = removeTags.value.filter(t => t !== tag)
    }
  } else {
    userAddedTags.value = userAddedTags.value.filter(t => t !== tag)
  }
}

const addNewTag = (newTag) => {
  const trimmedTag = newTag.trim()
  if (trimmedTag && !initialTags.value.includes(trimmedTag) && !userAddedTags.value.includes(trimmedTag)) {
    userAddedTags.value.push(trimmedTag)
    newTagInput.value = '' // 清空输入框
  }
}

const updateTags = async () => {
  try {
    const response = await axios.post(`${api_endpoint}/update_tags`, {
      sid,
      add: userAddedTags.value,
      remove: removeTags.value
    })
    console.log(response.data)
    // Optionally, you can refresh the tags after successful update
    fetchShopInfo()
    userAddedTags.value = []
    removeTags.value = []
  } catch (error) {
    console.error('Error updating tags:', error)
  }
}

onMounted(() => {
  fetchShopInfo()
})
</script>

<template>
  <v-container class="text-center mt-10">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card v-if="is_exist_shop">
          <v-card-title class="headline">店铺标签管理</v-card-title>
          <h2>{{ shop_name }}</h2>
          <v-card-text>
            <div v-if="initialTags.length > 0">
              <h4>初始标签</h4>
              <v-chip-group multiple column>
                <v-chip
                    v-for="(tag, index) in initialTags"
                    :key="index"
                    @click="handleTagClick(tag, true)"
                    :class="{ 'chip-remove': removeTags.includes(tag) }"
                >
                  {{ tag }}
                </v-chip>
              </v-chip-group>
            </div>
            <div v-if="userAddedTags.length > 0">
              <h4>用户添加的标签</h4>
              <v-chip-group multiple column>
                <v-chip
                    v-for="(tag, index) in userAddedTags"
                    :key="index"
                    @click="handleTagClick(tag, false)"
                >
                  {{ tag }}
                </v-chip>
              </v-chip-group>
            </div>
            <div class="mt-4">
              <v-text-field
                  label="添加新标签"
                  variant="outlined"
                  v-model="newTagInput"
              @keyup.enter="addNewTag(newTagInput)"
              append-inner-icon="mdi-plus"
              @click:append-inner="addNewTag(newTagInput)"
              clearable
              ></v-text-field>
            </div>
            <v-btn color="primary" block @click="updateTags">保存更改</v-btn>
          </v-card-text>
        </v-card>
        <v-card v-else>
          <v-card-title class="headline">店铺不存在或店铺因故不可见</v-card-title>
          <v-card-text>请检查店铺ID是否正确。</v-card-text>
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

.chip-remove {
  background-color: #f5c6cb;
  color: #721c24;
}
</style>
