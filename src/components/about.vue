<script setup>

</script>

<template>
  <v-container class="about-container">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="10" rounded="lg" class="pa-6">
          <h1 class="text-h3 font-weight-bold mb-4 text-center primary--text">关于</h1>
          <h2 class="text-h5 font-weight-medium mb-6 text-center secondary--text">ComicMap全国谷店地图</h2>
          <div class="section">
            <h3 class="text-h6 font-weight-bold mb-4 primary--text">为什么要做这个地图?</h3>
            <p class="text-body-1 mb-4">
              其实,这是我们几乎每个人都会遇到的问题。<br />
              众所周知,全中国685个城市,无数个区县。隐藏着无数谷店,通常你直接在地图上搜索谷店,一来会发现搜索结果非常有限,而且很多谷店并没有在地图上标注出来。<br />
              因为很多谷店的字号是礼品店、或者压根就没有谷店这种关键词。<br />
              二来,谷店里的IP在你前往之前都是未知数,很有可能跑空一场。<br />
              为了解决这个问题,早期有人采用了发布吃谷视频的方式来解决,但这样的缺点也有很多:比如你还是没办法一次性从一个视频里看到所有IP,
              并且这类视频一般只标注大致地点并附带一张门头照片。这就导致你在复杂的商场/商业街里要找到这家店就如大世界探索般,无疑是对吃谷人上了强度。<br />
              某天我在“全国音游地图”项目中诞生灵感(感谢前辈的灵感),如果有一个平台,可以方便游客查看全国谷店的位置,并且标注了IP,那不就完美了吗?<br />
              所以,“全国谷店地图”诞生了。
            </p>
          </div>
          <div class="section">
            <h3 class="text-h6 font-weight-bold mb-4 primary--text">数据从哪里来?</h3>
            <p class="text-body-1 mb-4">
              项目测试的早期,各谷店数据均为运营方亲自到达谷店征求意见后采集。未来将允许公众添加和店家添加,也会开放店家认领。但我们会对信息进行审核。
            </p>
          </div>
          <div class="section">
            <h3 class="text-h6 font-weight-bold mb-4 primary--text">我是谷店店长 我以后有可能通过平台维护店铺吗?</h3>
            <p class="text-body-1 mb-4">
              是的,未来我们会开放谷店认领功能,谷店店长可以认领自己的店铺,并维护店铺信息。同时我们在开发的谷子列表也可以方便游客查阅。
            </p>
          </div>
          <div class="section">
            <h3 class="text-h6 font-weight-bold mb-4 primary--text">这个项目由谁维护? 是否会盈利?</h3>
            <p class="text-body-1 mb-4">
              本项目由 萌数次元 Moedigital 维护, 不会盈利,如果您喜欢本项目,可以考虑通过爱发电捐助我们。这纯属自愿
            </p>
          </div>
          <div class="section">
            <h3 class="text-h6 font-weight-bold mb-4 primary--text">项目由哪些开源项目驱动?</h3>
            <p class="text-body-1 mb-4">
              <a href="https://cn.vuejs.org" target="_blank" class="link">Vue.js 3</a><br/>
              <a href="https://vuetifyjs.com" target="_blank" class="link">Vuetify</a><br/>
              <a href="https://vite.dev" target="_blank" class="link">Vite</a><br/>
              <a href="https://expressjs.com" target="_blank" class="link">Express.js</a><br/>
              <a href="https://www.mysql.com" target="_blank" class="link">MySQL</a><br/>
              <a href="https://vueuse.org" target="_blank" class="link">VueUse</a>
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.about-container {
  padding-top: 50px;
}

.section:not(:last-child) {
  margin-bottom: 2rem;
}

.primary--text {
  color: #1976D2; /* Vuetify default primary color */
}

.secondary--text {
  color: #424242; /* Vuetify default secondary color */
}

.link {
  color: #1976D2; /* Vuetify default primary color */
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: #124BDD; /* Darker shade of the primary color */
}
</style>

