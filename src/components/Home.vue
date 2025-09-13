<script setup>
import { ref, onMounted,inject } from 'vue'
import axios from 'axios'
import { useOptionStore } from '../store' // 确保路径正确
const tagList = ref([])
const isLoading = ref(false)
const optionStore = useOptionStore() // 使用 Pinia store
import { useRouter } from 'vue-router'
const router = useRouter()



const to_by_tag_page = (tag) => {
  optionStore.setCurrentTag(tag,true);
  router.push('/by_tag');
}

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await axios.get(inject('api_endpoint')+'/get_tag_list')
    tagList.value = response.data.sort(() => 0.5 - Math.random()).slice(0, 10) // 随机选择10个标签
  } catch (error) {
    console.error('Error fetching tag list:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <v-container id="Welcome" class="text-center mt-10">
    <v-row>
      <v-col cols="12">
        <v-alert
            class="mb-4 alert-custom"
            align="center"
            style="max-width: 850px"
            text="ComicMap全国谷店地图在青岛的试点已结束,现正招募以下城市的谷店信息: 济南、日照、淄博、深圳、清远、厦门、福州、南昌"
            title="区域测试即将结束"
            type="warning"
        >
          <p>我们期待您的宝贵意见 <a href="https://jinshuju.net/f/aCOH2z" target="_blank" class="custom-link">意见与建议表单</a></p>
        </v-alert>
        <h1 class="display-2 font-weight-bold mb-4">欢迎来到全国谷店地图</h1>
        <h2 class="display-1 font-weight-medium mb-6">吃谷人找谷店的必备利器</h2>

        <v-card class="mx-auto" max-width="400">
          <v-card-text>
            <h3 class="inner_element_text">谷店检索</h3>
            <v-btn block class="mb-4" color="primary" to="/search">快速搜索</v-btn>
            <v-btn block class="mb-4" color="primary" to="/by_region">按地区检索</v-btn>
            <v-btn block class="mb-4" color="primary" to="/by_tag">按标签/IP检索</v-btn>
            <v-btn block disabled class="mb-4">敬请期待</v-btn>
          </v-card-text>
        </v-card>

        <v-card class="mx-auto mt-6" max-width="600">
          <v-card-title>不知道吃啥? 看看这些标签有没有你推</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item v-for="tag in tagList" :key="tag" :title="tag" @click="to_by_tag_page(tag)"></v-list-item>
            </v-list>
            <v-progress-linear v-if="isLoading" indeterminate></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
#Welcome {
  min-height: 100vh;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.display-2 {
  font-size: 2rem !important;
}

.display-1 {
  font-size: 1rem !important;
}

.v-card {
  padding: 16px;
}

.inner_element_text {
  font-weight: bold;
  padding: 3px 0;
  margin: 1px 5px;
  text-align: left;
  font-size: 1rem;
}

.alert-custom {
  margin: 0 auto; /* 水平居中 */
  font-size: 1rem; /* 调整字体大小 */
  padding: 10px; /* 调整内边距 */
  border-radius: 5px; /* 添加圆角 */
  background-color: #f0f0f0; /* 背景颜色 */
  color: #333; /* 文字颜色 */
  border: 1px solid #ccc; /* 边框 */
}
.custom-link {
  color: #ffff00; /* 链接颜色 */
  font-weight: bold; /* 加粗字体 */
}

.custom-link:hover {
  color: #FFCC04; /* 鼠标悬停时的颜色 */
  text-decoration: underline; /* 鼠标悬停时显示下划线 */
}
</style>
