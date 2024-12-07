<!-- widget/MapSelector.vue -->
<template>
  <div :id="mapId" style="width: 100%; height: 500px;"></div>
</template>

<script>
import { onMounted, ref, watch, onUnmounted } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
  props: {
    initialGeoX: {
      type: Number,
      required: true
    },
    initialGeoY: {
      type: Number,
      required: true
    }
  },
  emits: ['update:PickedX', 'update:PickedY'],
  setup(props, { emit }) {
    let map = null;
    let marker = null;
    let moveEndListener = null;

    const mapId = ref(`mapContainer-${Math.random().toString(36).substr(2, 9)}`); // 生成唯一的ID

    const initMap = async () => {
      await AMapLoader.load({
        key: '988f01c9be0f46e9913f71476d9ab0eb',
        version: '2.0',
        plugins: []
      });

      map = new window.AMap.Map(mapId.value, {
        center: [props.initialGeoX, props.initialGeoY],
        zoom: 13
      });

      marker = new window.AMap.Marker({
        position: new window.AMap.LngLat(props.initialGeoX, props.initialGeoY)
      });
      map.add(marker);

      // Ensure the marker is always at the center of the map
      moveEndListener = map.on('moveend', (event) => {
        const centerPosition = event.target.getCenter();
        marker.setPosition(centerPosition);
        emit('update:PickedX', centerPosition.lng);
        emit('update:PickedY', centerPosition.lat);
      });

      // Initial set marker to center
      updateMarkerToCenter();
    };

    const updateMarkerToCenter = () => {
      if (map && marker) {
        const centerPosition = map.getCenter();
        marker.setPosition(centerPosition);
        emit('update:PickedX', centerPosition.lng);
        emit('update:PickedY', centerPosition.lat);
      }
    };

    onMounted(() => {
      console.log('MapSelector mounted');
      initMap();
    });

    onUnmounted(() => {
      if (map && moveEndListener) {
        map.off('moveend', moveEndListener);
      }
    });

    watch(
        [() => props.initialGeoX, () => props.initialGeoY],
        ([newX, newY]) => {
          console.log('Initial Geo updated:', newX, newY);
          if (map && marker) {
            map.setCenter([newX, newY]);
            marker.setPosition(new window.AMap.LngLat(newX, newY));
            emit('update:PickedX', newX);
            emit('update:PickedY', newY);
          }
        },
        { immediate: true }
    );

    return {
      mapId
    };
  }
};
</script>

<style scoped>
/* No additional styles needed */
</style>