<template>
  <div>
    <a-popover>
      <template #content> Routing </template>
      <a-button type="primary" shape="round" @click="openDrawer"><i class="fa-solid fa-route"></i></a-button>
    </a-popover>

    <a-drawer v-model:open="drawerVisible" title="Routing" placement="left" :maskClosable="false" :mask="false">
      <div class="row w-100">
        <a-radio-group
          v-model:value="transportType"
          button-style="solid"
          size="large"
          style="width: 100%; display: flex; flex-direction: row; justify-content: space-between">
          <a-popover>
            <template #content> Car </template>
            <a-radio-button class="transport-type-radio-button" value="car"
              ><i class="fa-solid fa-car"></i
            ></a-radio-button>
          </a-popover>
          <a-popover>
            <template #content> Motor </template>
            <a-radio-button class="transport-type-radio-button" value="motorcycle"
              ><i class="fa-solid fa-motorcycle"></i
            ></a-radio-button>
          </a-popover>
          <a-popover>
            <template #content> Public transport </template>
            <a-radio-button value="publicTransport" class="transport-type-radio-button"
              ><i class="fa-solid fa-bus"></i
            ></a-radio-button>
          </a-popover>
          <a-popover>
            <template #content> Walking </template>
            <a-radio-button value="walk" class="transport-type-radio-button"
              ><i class="fa-solid fa-person-walking"></i
            ></a-radio-button>
          </a-popover>
          <a-popover>
            <template #content> Bicycle </template>
            <a-radio-button value="bike" class="transport-type-radio-button"
              ><i class="fa-solid fa-person-biking"></i
            ></a-radio-button>
          </a-popover>
          <a-popover>
            <template #content> Train </template>
            <a-radio-button value="train" class="transport-type-radio-button"
              ><i class="fa-solid fa-train-subway"></i
            ></a-radio-button>
          </a-popover>
          <a-popover>
            <template #content> Plane </template>
            <a-radio-button value="plane" class="transport-type-radio-button"
              ><i class="fa-solid fa-plane"></i
            ></a-radio-button>
          </a-popover>
        </a-radio-group>
      </div>
      <div class="row mt-3">
        <div class="col-1 d-flex align-items-center justify-content-center">
          <i class="fa-regular fa-circle" style="color: gray"></i>
        </div>
        <div class="col-10 p-0"><a-input v-model:value="inputValue" placeholder="Pick a place" allowClear /></div>
        <div class="col-1 d-flex align-items-center justify-content-center">
          <a> <i class="fa-regular fa-circle-xmark fs-5"></i></a>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-1 d-flex align-items-center justify-content-center">
          <i class="fa-regular fa-circle" style="color: gray"></i>
        </div>
        <div class="col-10 p-0"><a-input v-model:value="inputValue" placeholder="Pick a place" allowClear /></div>
        <div class="col-1 d-flex align-items-center justify-content-center">
          <a> <i class="fa-regular fa-circle-xmark fs-5"></i></a>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-1 d-flex align-items-center justify-content-center">
          <i class="fa-regular fa-circle" style="color: gray"></i>
        </div>
        <div class="col-10 p-0"><a-input v-model:value="inputValue" placeholder="Pick a place" allowClear /></div>
        <div class="col-1 d-flex align-items-center justify-content-center">
          <a> <i class="fa-regular fa-circle-xmark fs-5"></i></a>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-1 d-flex align-items-center justify-content-center">
          <i class="fa-solid fa-location-dot" style="color: crimson"></i>
        </div>
        <div class="col-10 p-0"><a-input v-model:value="inputValue" placeholder="Pick a place" allowClear /></div>
        <div class="col-1 d-flex align-items-center justify-content-center">
          <a> <i class="fa-regular fa-circle-xmark fs-5"></i></a>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue';
import { mapState } from '../../stores/map-state';
import { dataState } from '../../stores/data-state';

export default defineComponent({
  components: {},
  setup() {
    const drawerVisible = ref(false);
    const transportType = ref('car');
    const inputValue = ref('');
    return {
      drawerVisible,
      transportType,
      inputValue,
    };
  },

  methods: {
    // changeLayerManagerImage(image) {
    //   this.layerManagerImage = image;
    // },
  },

  computed: {
    map() {
      return mapState().getMap;
    },
  },

  data() {
    return {
      startPointX: '579841.3',
      startPointY: '1720868.3',
      destPointX: '577970.9',
      destPointY: '1722938.7',
      excludeRoads: [],
    };
  },

  mounted() {
    // console.log(this.map);
    // console.log(this.map);
  },

  methods: {
    getLayerByTitle(title) {
      var layer;
      this.map
        .getLayers()
        .getArray()
        .forEach((element) => {
          if (element.get('title') == title) {
            layer = element;
          }
        });
      return layer;
    },

    getRoute() {
      const routeLayer = new ol.layer.Image({
        title: 'Route layer',
      });
      this.getLayerByTitle('Start and destination points').getSource().clear();
      // this.$message.success('anh quìn');
      const startPoint = new ol.Feature({
        geometry: new ol.geom.Point([this.startPointX, this.startPointY]),
      });
      const destPoint = new ol.Feature({
        geometry: new ol.geom.Point([this.destPointX, this.destPointY]),
      });

      this.getLayerByTitle('Start and destination points').getSource().addFeature(startPoint);
      this.getLayerByTitle('Start and destination points').getSource().addFeature(destPoint);

      var params = {
        LAYERS: 'webgis_dev:route',
        FORMAT: 'image/png',
      };
      var viewparams = [
        'x1:' + this.startPointX,
        'y1:' + this.startPointY,
        'x2:' + this.destPointX,
        'y2:' + this.destPointY,
      ];
      params.viewparams = viewparams.join(';');
      console.log(params);
      const routeSource = new ol.source.ImageWMS({
        url: 'http://localhost:8080/geoserver/webgis_dev/wms',
        params: params,
        // crossOrigin: 'anonymous',
        // crossOrigin: null
      });

      routeLayer.setSource(routeSource);

      this.map.addLayer(routeLayer);

      const insertExcludeRoads = () => {
        axios
          .post('http://127.0.0.1:8000/api/insert-exclude-roads', dataState().getExcludeRoads, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            if (response) {
              // router.push({ name: 'home-page' });
              console.log(response);
            }
          })
          .catch((error) => {
            // signInVisible.value = true;
            console.log(error);
          });
      };

      insertExcludeRoads();
    },

    openDrawer() {
      this.drawerVisible = true;
    },
  },
});
</script>

<style scoped lang="scss">
.transport-type-radio-button {
  font-size: large;
  width: 35px;
  align-items: center;
  justify-content: center;
  display: flex;

  &:first-child {
    border-radius: 0;
  }
  &:last-child {
    border-radius: 0;
  }
}
</style>
