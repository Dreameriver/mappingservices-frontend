<script setup>
import { reactive } from "vue";
const versions = reactive([
  {
    version: "v1.8.0 | Petit-SEKAI",
    date: "2024-12-20",
    changes: [
      "Android App端支持",
        "Google Play服务连接支持",
        "支持Google鉴权、通行密钥、Google TOTP"
    ]
  },
  {
    version: "v1.7.2 | Frieren",
    date: "2024-12-20",
    changes: [
      "逐步支持Vue Vapor Mode无虚拟DOM渲染模式. 当前为兼容模式",
      "修复一些bug"
    ]
  },
  {
    version: "v1.7.1",
    date: "2024-12-05",
    changes: [
      "兼容Everymap 任意地图客户端",
      "去除无用组件"
    ]
  },
  {
    version: "v1.7.0 | Ave Mujica",
    date: "2025-02-01",
    changes: [
        "青岛局域试点结束",
        "扩大测试范围",
        "修复一些bug",
        "版本更新信息功能追加"
    ]
  }
])
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="mx-auto mt-6" max-width="600">
          <v-card-title>
            <h1 class="text-h4">版本更新日志</h1>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="version in versions" :key="version.version">
                <v-list-item-title>
                  <h2 class="text-h5">{{ version.version }}</h2>
                  <p class="text-subtitle-1">{{ version.date }}</p>
                </v-list-item-title>
                  <ul>
                    <li v-for="change in version.changes" :key="change">{{ change }}</li>
                  </ul>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>