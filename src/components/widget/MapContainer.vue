<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

let map = null;

const props = defineProps(['geo_x', 'geo_y', 'shop_name']);
console.log(props.geo_x, props.geo_y, props.shop_name);

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "ecea0a31bcd79d3c2b88e46042345f78",
  };

  AMapLoader.load({
    key: "988f01c9be0f46e9913f71476d9ab0eb", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
      .then((AMap) => {
        const center = [parseFloat(props.geo_x), parseFloat(props.geo_y)];
        console.log('Center:', center); // 打印中心点坐标

        map = new AMap.Map("container", {
          viewMode: "3D", // 是否为3D地图模式
          zoom: 18, // 初始化地图级别
          center: center, // 初始化地图中心点位置
        });

        // 添加Marker
        const marker = new AMap.Marker({
          position: new AMap.LngLat(parseFloat(props.geo_x), parseFloat(props.geo_y)),
          title: props.shop_name,
          label: {
            content: props.shop_name,
            offset: new AMap.Pixel(0, -30) // 标签偏移量，使标签位于marker上方
          },
          icon: new AMap.Icon({ // 自定义图标
            size: new AMap.Size(25, 34),
            image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            imageOffset: new AMap.Pixel(0, 0)
          })
        });

        // 将marker添加到地图中
        map.add(marker);

        // 将地图中心点设置为marker的位置
        map.setCenter(marker.getPosition());
      })
      .catch((e) => {
        console.log(e);
      });
});

onUnmounted(() => {
  map?.destroy();
});
</script>

<template>
  <div id="container"></div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 500px;
}
</style>
