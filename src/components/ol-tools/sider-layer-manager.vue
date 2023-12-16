<template>
  <div>
    <a-card
      :tab-list="tabList"
      :active-tab-key="key"
      @tabChange="(key) => onTabChange(key)"
      :bodyStyle="{ padding: 0, backgroundColor: '#ffffff !important' }"
      style="border: none"
      :headStyle="{ borderRadius: '0.5rem' }">
      <div v-if="key === 'layersTab'">
        <a-menu class="layers-visible-menu" mode="inline" :selectable="false" style="border: none; padding-top: 0.5rem">
          <a-sub-menu key="sub1">
            <template #title>
              <icon>
                <template #component>
                  <i class="fa-solid fa-city"></i>
                </template>
              </icon>
              <span>TP Tam Kỳ </span>
            </template>
            <a-menu-item
              v-for="(layer, index) in mainLayerData"
              key="{{index}}"
              style="padding: 0"
              @click="layerChangeVisible(layer.title, layer.visible, index)">
              <a-row align-item="middle">
                <a-col :span="6">
                  <a-switch v-model:checked="layer.visible" style="pointer-events: none" />
                </a-col>
                <a-col :span="16" :offset="1">
                  <span style="text-wrap: wrap">
                    {{ layer.title }}
                  </span>
                </a-col>
              </a-row>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #title>
              <span>
                <ShopOutlined />
                <span>TP Tam Kỳ </span>
              </span>
            </template>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <template #title>
              <span>
                <ShopOutlined />
                <!-- <i class="fa-solid fa-cash-register"></i> -->
                <span>TP Tam Kỳ </span>
              </span>
            </template>
          </a-sub-menu>
          <a-sub-menu key="sub4">
            <template #title>
              <span>
                <ShopOutlined />
                <span>TP Tam Kỳ </span>
              </span>
            </template>
          </a-sub-menu>
          <a-sub-menu key="sub5">
            <template #title>
              <span>
                <ShopOutlined />
                <span>TP Tam Kỳ </span>
              </span>
            </template>
          </a-sub-menu>
        </a-menu>
      </div>

      <div v-if="key === 'searchingTab'">
        <a-spin :spinning="searchSpinning">
          <a-row class="mt-2">
            <a-col :span="24">
              <a-input-search
                v-model:value="searchValue"
                placeholder="Search"
                @search="onSearch"
                :loading="searchInputDisabled" />
            </a-col>
          </a-row>
          <a-menu v-if="searchResult" mode="inline" :selectable="false" style="border: none; padding-top: 0.5rem">
            <a-sub-menu
              v-for="(featureCollection, index) in searchResult"
              :key="index"
              :class="{ 'menu-item-display': !featureCollection.features.data.length > 0 }">
              <template #title>
                <span>
                  <CloudFilled />
                  <span>{{ featureCollection.features.total }} {{ featureCollection.featureName }} </span>
                </span>
              </template>
              <!-- <template #expandIcon> aaa </template> -->
              <a-menu-item
                v-for="(feature, index) in featureCollection.features.data"
                :key="index"
                @click="showFeature(feature.gid, featureCollection.layer, featureCollection.featureName)">
                {{ feature.gid }}
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-spin>
      </div>

      <a-drawer
        class="detail-drawer"
        v-model:open="detailDrawerOpen"
        root-class-name="root-class-name"
        :bodyStyle="{ padding: 0, backgroundColor: '#fff' }"
        width="300"
        placement="right"
        :mask="false"
        :maskClosable="false"
        :closable="false"
        @close="detailDrawerClose">
        <!-- <template #closeIcon>
        <i class="fa-solid fa-xmark fs-5 me-2"></i>
        <i class="fa-solid fa-minus"></i>
      </template> -->
        <template #title>
          <a-row align="middle">
            <p class="me-2">{{ detailDrawerTitle }}</p>
            <a-popover>
              <template #content>Zoom in</template>
              <a-button type="primary" class="me-2" @click="zoomInFeature">
                <i class="fa-solid fa-magnifying-glass"></i>
              </a-button>
            </a-popover>

            <a-popover>
              <template #content>Route</template>
              <a-button type="primary"><i class="fa-solid fa-route"></i></a-button>
            </a-popover>
          </a-row>
        </template>

        <template #extra>
          <!-- <a-popover>
          <template #content>Zoom in</template>
          <a-button type="primary" class="me-2" @click="zoomInFeature">
            <i class="fa-solid fa-magnifying-glass"></i>
          </a-button>
        </a-popover>

        <a-popover>
          <template #content>Route</template>
          <a-button type="primary"><i class="fa-solid fa-route"></i></a-button>
        </a-popover> -->

          <a-button type="link" @click="minimizeDrawer">
            <i class="fa-solid fa-minus"></i>
          </a-button>
          <a-button type="link" @click="closeDrawer">
            <i class="fa-solid fa-xmark fs-5"></i>
          </a-button>
        </template>

        <a-collapse v-model:activeKey="activeKey" :bordered="false" ghost>
          <a-collapse-panel key="1">
            <template #header>
              <p class="fw-bold">Infomation</p>
            </template>
            <p>Updating...</p>
          </a-collapse-panel>
          <a-collapse-panel key="2">
            <template #header>
              <p class="fw-bold">Properties</p>
            </template>
            <div v-for="(value, key, index) in feature.properties" class="mb-2" style="width: 100%">
              <a-row style="background-color: rgba(148, 134, 134, 0.2)">
                <p>{{ index }}. {{ key + 1 }}:</p>
              </a-row>
              <a-row justify="center">
                <p v-if="value" style="text-wrap: wrap; word-wrap: break-word; width: 100%; text-align: center">
                  {{ value }}
                </p>
                <p v-else>updating...</p>
              </a-row>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-drawer>
    </a-card>
    <div class="maximize-drawer-button" v-if="minimizeDrawerState">
      <a-button type="default" :style="{ borderRadius: '0.5rem 0 0 0.5rem' }" @click="maximizeDrawer">
        <i class="fa-solid fa-angles-left"></i>
      </a-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, inject } from 'vue';
import Icon, { ShopOutlined, CloudFilled } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { mapState } from '../../stores/map-state';
import { getLayerByTitle } from '../../js/VueLayer.js';
import * as VueLayer from '../../js/VueLayer.js';
import { Feature } from 'ol';
import { GeoJSON } from 'ol/format.js';
import { getCenter } from 'ol/extent.js';
export default defineComponent({
  name: 'MyIcon',
  components: {
    ShopOutlined,
    CloudFilled,
    Icon,
  },
  beforeRouteEnter(to, from, next) {
    // document.title = 'Forgot Password';
    next();
  },
  props: {},

  setup() {
    const tabList = [
      {
        key: 'layersTab',
        tab: 'Layers',
      },
      {
        key: 'searchingTab',
        tab: 'Searching',
      },
    ];
    const key = ref('layersTab');
    const onTabChange = (value) => {
      key.value = value;
    };

    // const mainLayerData = ref([
    //   {
    //     title: 'Cống ngầm',
    //     imagePath: '',
    //     visible: true,
    //   },
    //   {
    //     title: 'Kênh',
    //     imagePath: '',
    //     visible: true,
    //   },
    //   {
    //     title: 'Cống ngăn triều',
    //     imagePath: '',
    //     visible: true,
    //   },
    //   {
    //     title: 'Hố ga',
    //     imagePath: '',
    //     visible: true,
    //   },
    //   {
    //     title: 'Cửa xả',
    //     imagePath: '',
    //     visible: true,
    //   },
    //   {
    //     title: 'Hồ điều hoà',
    //     imagePath: '',
    //     visible: true,
    //   },
    //   {
    //     title: 'Trạm đo mưa',
    //     imagePath: '',
    //     visible: true,
    //   },
    // ]);

    const mainLayerData = inject('mainLayerData');
    const searchInputDisabled = inject('searchInputDisabled');
    const searchValue = ref('');
    const searchSpinning = ref(false);
    const searchResult = ref('');
    // http://localhost:8080/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typenames=webgis_dev:HoDieuHoa&filter=%3Cfes:Filter%20xmlns:fes=%22http://www.opengis.net/fes/2.0%22%3E%3Cfes:ResourceId%20rid=%22HoDieuHoa.3%22/%3E%3C/fes:Filter%3E&outputFormat=application%2Fjson

    // let highlightLayer = new VectorLayer({
    //   title: 'Feature highlight layer',
    //   source: new VectorSource({}),
    //   style: this.stylePopup,
    // });
    const detailDrawerOpen = ref(false);
    const detailDrawerTitle = ref('Drawer');
    const activeKey = ref([2]);
    const feature = ref('');
    const minimizeDrawerState = ref(false);
    return {
      tabList,
      key,
      onTabChange,
      searchInputDisabled,
      mainLayerData,
      searchValue,
      searchSpinning,
      searchInputDisabled,
      searchResult,
      detailDrawerOpen,
      detailDrawerTitle,
      activeKey,
      feature,
      minimizeDrawerState,
    };
  },

  computed: {
    map() {
      return mapState().getMap;
    },
  },

  data() {
    return {
      items: Array.from({ length: 50 }, (_, i) => i + 1),
      layerIndex: 0,
      // hightlight: this.map,
      // highlightLayer: VueLayer.getLayerByTitle(this.map, 'Search hightlight layer'),
    };
  },

  methods: {
    layerChangeVisible(title, visible, index) {
      this.mainLayerData[index].visible = !visible;
      getLayerByTitle(this.map, title, 1).setVisible(this.mainLayerData[index].visible);
      console.log(this.profileSpinning);
      // console.log(visible);
    },
    onSearch(searchValue) {
      // console.log(searchValue);
      this.key = 'searchingTab';
      this.searchValue = searchValue;
      this.searchSpinning = true;
      this.searchInputDisabled = true;
      axios
        .post('http://127.0.0.1:8000/api/search-feature', {
          data: searchValue,
        })
        .then((response) => {
          console.log(response);
          this.searchResult = response.data;
          this.searchSpinning = false;
          this.searchInputDisabled = false;
        })
        .catch((error) => {
          console.log(error);
          this.searchSpinning = false;
          this.searchInputDisabled = false;
          message.error('Somethings wrong, please try again later.');
        });
    },

    showFeature(id, layer, name) {
      // Không lấy highlight layer được tạo ở feauture-info-popup để hiển thị
      // vi khi tìm kiếm click vào feature khác thì nó nhảy đi
      // không phù hớp với chức năng tìm kiếm này
      // vì vậy tạo thành 2 layer hightlight riêng biệt
      // Layer được tạo ở map.js
      // console.log(VueLayer.getLayerByTitle(this.map, 'Feature highlight layer'));
      this.activeKey = [2];
      this.detailDrawerOpen = false;
      this.minimizeDrawerState = false;
      this.detailDrawerTitle = name + ' ' + id;
      const highlightLayer = VueLayer.getLayerByTitle(this.map, 'Search hightlight layer');
      highlightLayer.getSource().clear();
      // console.log(this.map.getLayers());
      document.body.style.cursor = 'progress';
      axios
        .post('http://127.0.0.1:8000/api/get-geoserver-feature-by-id', {
          id: id,
          layer: layer,
        })
        .then((response) => {
          console.log(response);
          this.feature = response.data.features[0];
          // const feature = new Feature({
          //   geometry: response.data.features[0].geometry,
          // });
          highlightLayer.getSource().addFeature(new GeoJSON().readFeature(this.feature));
          highlightLayer.setVisible(true);
          this.detailDrawerOpen = true;
          document.body.style.cursor = 'auto';
        })
        .catch((error) => {
          console.log(error);
          message.error('Somethings wrong, please try again later.');
          this.detailDrawerOpen = false;
          document.body.style.cursor = 'auto';
        });
    },

    detailDrawerClose() {
      VueLayer.getLayerByTitle(this.map, 'Search hightlight layer').getSource().clear();
    },

    zoomInFeature() {
      // console.log(this.feature);
      if (this.feature.geometry.type === 'Point') {
        this.map.getView().animate({
          center: this.feature.geometry.coordinates,
          duration: 1000,
          zoom: 20,
        });
      } else if (this.feature.geometry.type === 'MultiLineString') {
        var coordinateArray = this.feature.geometry.coordinates[0];
        var featureExtent = [
          coordinateArray[0][0],
          coordinateArray[0][1],
          coordinateArray[coordinateArray.length - 1][0],
          coordinateArray[coordinateArray.length - 1][1],
        ];
        var extentCenter = getCenter(featureExtent);
        this.map.getView().animate({
          center: extentCenter,
          duration: 1000,
          zoom: 17,
        });
      } else if (this.feature.geometry.type === 'MultiPolygon') {
        const extent = this.feature.properties['extent'].split(',');
        this.map.getView().fit(extent, { duration: 1000 });
      }
    },

    minimizeDrawer() {
      this.detailDrawerOpen = false;
      this.minimizeDrawerState = true;
    },

    closeDrawer() {
      this.detailDrawerOpen = false;
      this.minimizeDrawerState = false;
      VueLayer.getLayerByTitle(this.map, 'Search hightlight layer').getSource().clear();
    },

    maximizeDrawer() {
      this.detailDrawerOpen = true;
      this.minimizeDrawerState = false;
    },
  },

  mounted() {},
});
</script>

<style lang="scss">
// Dùng scoped là .ant-menu-item không hoạt động
.layers-visible-menu .ant-menu-item {
  padding-left: 1rem !important;
}

.menu-item-display {
  display: none;
}

.detail-drawer {
  position: relative;
  // &::before {
  //   content: 'Read this -';
  //   background-color: red;
  //   position: absolute;
  //   top: 1rem;
  //   left: -1rem;
  // }
  // overflow: hidden !important;
}

// .ant-drawer-content-wrapper {
//   background-color: red !important;
//   overflow: hidden !important;
// }

// .ant-drawer-content {
//   background-color: red !important;
//   overflow: hidden !important;
// }

// .ant-drawer-body {
//   background-color: red !important;
//   overflow: hidden !important;
// }

// .ant-drawer-wrapper-body {
//   // background-color: red !important;
//   overflow: hidden !important;
// }

// .minimize-drawer-button {
//   position: absolute;
//   top: 50%;
//   left: -10%;
// transform: translate(-50%, -50%);
// clip-path: inset(50%);
// }

.maximize-drawer-button {
  position: fixed;
  top: 50%;
  right: 0rem;
  z-index: 100000;
  // transform: translateX(-100%);
  animation: slide 0.2s linear;
}

@keyframes slide {
  0% {
    right: -2rem;
  }

  100% {
    right: 0;
  }
}
</style>
