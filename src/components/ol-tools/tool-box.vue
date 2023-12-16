<template>
  <div>
    <a-popover v-model:open="visible" title="Map tools" trigger="click" placement="topRight">
      <template #content>
        <a-row style="margin-bottom: 5px" :gutter="[0, 8]">
          <a-col :span="6">
            <a-popover>
              <template #content> Popup </template>
              <a-switch
                v-model:checked="featurePopupVisible"
                checked-children="ON"
                un-checked-children="OFF"
                @change="featurePopupVisibleChange()" />
            </a-popover>
          </a-col>
          <a-col :span="6" style="align-items: center; justify-items: center">
            <ConvertCrsTool></ConvertCrsTool>
          </a-col>
          <a-col :span="6">
            <SearchFeatureByAreaTool
              @data-updated="searchFeatureUpdate"
              ref="clearSearchVectorRef"></SearchFeatureByAreaTool>
          </a-col>
          <a-col :span="6">
            <RoutingTool></RoutingTool>
          </a-col>

          <a-col :span="6">
            <MeasureTool ref="measureToolRef" @start-measure="startMeasure"></MeasureTool>
          </a-col>
          <a-col :span="6">
            <a-popover>
              <template #content> Test </template>
              <a-button type="primary" shape="round" @click="test"><i class="fa-solid fa-bed"></i></a-button>
            </a-popover>
          </a-col>
          <a-col :span="6">
            <WaterLevelWarning></WaterLevelWarning>
          </a-col>

          <a-col :span="6">
            <!-- <WaterLevelWarning></WaterLevelWarning> -->
          </a-col>
        </a-row>

        <a-row style="min-width: 250px"> </a-row>
      </template>
      <a-button ghost size="large" shape="circle" style="background: transparent">
        <template #icon>
          <i class="fa-solid fa-screwdriver-wrench"></i>
        </template>
      </a-button>
    </a-popover>

    <!-- popup for search feature by area tool -->
    <div
      class="search-feature-popup"
      :class="{ 'search-feature-popup__active': searchFeaturePopupVisible }"
      style="position: fixed; top: 15vh; left: 3vw; width: 300px; max-height: 600px">
      <a-card title="Search result" size="small" :bodyStyle="{ padding: 0 }">
        <template #extra
          ><a @click="removeSearch"><i class="fa-solid fa-xmark"></i></a
        ></template>
        <!-- [header:'abc'; foundFeature:[feature1,feature2,feature3]] -->
        <a-collapse
          v-model:activeKey="searchFeaturePopupActivateKey"
          :style="{
            backgroundColor: 'white',
            height: '100%',
            width: '100%',
            overflowY: 'auto',
            maxHeight: '400px',
            borderRadius: '0 5',
          }"
          :bordered="false">
          <a-collapse-panel v-for="data in searchFeatureData" :key="data.key" :header="data.header">
            <template #extra>
              <p class="me-2">{{ data.foundFeature.length }}</p>
            </template>
            <div class="row mb-1" v-for="feature in data.foundFeature">
              <div class="col-6">
                <p class="d-flex h-100 justify-content-start align-items-center">
                  {{ `${data.header} - ${feature.getId()}` }}
                </p>
              </div>
              <div class="col-6">
                <div class="d-flex h-100 justify-content-start align-items-center">
                  <a-button type="primary" size="small">Search</a-button>
                </div>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-card>
    </div>

    <!-- popup for measure tool -->
    <div
      class="measure-popup"
      v-if="measurePopupVisible"
      style="position: fixed; top: 15vh; left: 3vw; width: 200px; max-height: 200px">
      <a-card title="Measure" size="small" :bodyStyle="{ padding: '5px' }">
        <!-- <template #extra
          ><a @click="removeMeasure"><i class="fa-solid fa-xmark"></i></a
        ></template> -->
        <!-- Làm đo và dừng đo thành một select -->
        <a-select
          v-model:value="measureType"
          style="width: 100%"
          :options="measureTypes"
          @change="measureTypeChange"></a-select>
        <div class="row p-0 mt-2">
          <div class="col-6">
            <a-select
              size="small"
              v-model:value="measureStatus"
              :options="mesureStatuses"
              style="width: 100%"
              @change="measureStatusChange"></a-select>
          </div>
          <div class="col-6">
            <a-button type="primary" size="small" @click="clearMeasure">Remove</a-button>
          </div>
        </div>
        <div class="row mt-2 justify-content-center align-items-center">
          <a-button type="text" size="small" danger style="width: 50%" @click="stopMeasure">
            <i class="fa-solid fa-ban me-1" style="font-size: 0.8rem"></i>Stop
          </a-button>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue';
import { mapState } from '../../stores/map-state';
import { interfaceState } from '../../stores/interface-state';
import ConvertCrsTool from './convert-crs-tool.vue';
import SearchFeatureByAreaTool from './search-feature-by-area-tool.vue';
import WaterLevelWarning from './water-level-warning.vue';
import RoutingTool from './routing-tool.vue';
import MeasureTool from './measure-tool.vue';
import * as VueLayer from '../../js/VueLayer';

export default defineComponent({
  components: {
    ConvertCrsTool,
    SearchFeatureByAreaTool,
    RoutingTool,
    MeasureTool,
    WaterLevelWarning,
  },
  setup() {
    const visible = ref(interfaceState().getToolBoxVisible);
    const featurePopupVisible = ref(interfaceState().getFeaturePopupVisible);
    const searchFeaturePopupActivateKey = ref();
    const searchFeaturePopupVisible = ref(false);
    const measurePopupVisible = ref(false);
    return {
      visible,
      featurePopupVisible,
      searchFeaturePopupActivateKey,
      searchFeaturePopupVisible,
      measurePopupVisible,
    };
  },

  methods: {
    // changeLayerManagerImage(image) {
    //   this.layerManagerImage = image;
    // },
  },

  computed: {
    map() {
      // const mapStore = mapState();
      // const { getMap, setMap } = mapStore;
      return mapState().getMap;
    },
  },

  data() {
    return {
      featurePopupOverlay: null,
      searchFeatureData: [],
      measureType: 'LineString',
      measureTypes: [
        {
          value: 'LineString',
          label: 'Length (LineString)',
        },
        {
          value: 'Polygon',
          label: 'Area (Polygon)',
        },
      ],
      mesureStatuses: [
        {
          value: 'active',
          label: 'Active',
        },
        {
          value: 'inactive',
          label: 'Stop',
        },
      ],
      measureStatus: 'active',
    };
  },

  mounted() {
    // console.log(this.map);
    // console.log(this.map);
    // this.featurePopupOverlay = this.map.getOverlayById('featurePopupOverlay');
    // console.log(this.map);
  },

  watch: {
    map: {
      handler() {},
      deep: false,
    },
  },

  methods: {
    featurePopupVisibleChange() {
      VueLayer.getLayerByTitle(this.map, 'Feature highlight layer').getSource().clear();
      this.map.getOverlayById('featurePopupOverlay').setPosition(undefined);
      if (this.featurePopupVisible) {
        VueLayer.getLayerByTitle(this.map, 'Feature highlight layer').setVisible(true);
        document.getElementById('popup').style.display = 'block';
      } else {
        VueLayer.getLayerByTitle(this.map, 'Feature highlight layer').setVisible(false);
        document.getElementById('popup').style.display = 'none';
      }
    },

    removeSearch() {
      // console.log('anhquyen');
      // console.log(this.searchFeatureData);
      // console.log(this.$refs.clearSearchVectorRef);
      this.$refs.clearSearchVectorRef.clearSearchVector();
      this.searchFeaturePopupVisible = false;
    },
    searchFeatureUpdate(data) {
      this.searchFeaturePopupVisible = true;
      this.searchFeatureData = data;
    },
    clearMeasure() {
      this.$refs.measureToolRef.clearMeasureTool();
    },
    measureTypeChange() {
      if (this.measureStatus === 'active') this.$refs.measureToolRef.measureTypeChange(this.measureType);
    },
    measureStatusChange() {
      // measureStatus: 'active'
      this.$refs.measureToolRef.measureStatusChange(this.measureStatus);
    },
    stopMeasure() {
      this.$refs.measureToolRef.stopMeasure();
      this.measurePopupVisible = false;
    },
    startMeasure(data) {
      console.log(data, this.measurePopupVisible);

      this.measurePopupVisible = data;
    },
    test() {
      // var layerGroupIndex = 1;
      // const mainLayer = this.map.getLayers().getArray();
      // const mainLayer = this.map.getLayers().getArray();
      // const mainLayer = this.map.getLayers().getArray()[5].getLayers().getArray();

      var layer = null;
      var title = 'Cống ngầm';
      // console.log(getLayerByTitle(this.map, title, 1));
      // console.log(getAllLayerTitle(this.map, 1));

      // getLayerByTitle
      // return layer;

      // console.log(this.map.getLayers().getArray());
      // axios
      //   .get('http://127.0.0.1:8000/api/test')
      //   .then((response) => {
      //     if (response) {
      //       // router.push({ name: 'home-page' });
      //       console.log(response);
      //     }
      //   })
      //   .catch((error) => {
      //     // signInVisible.value = true;
      //     console.log(error);
      //   });
    },
  },
});
</script>

<style scoped lang="scss">
.search-feature-popup {
  display: none;
  &__active {
    display: block;
  }
}

::-webkit-scrollbar-track {
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: grey;

  border-radius: 16px;
}

::-webkit-scrollbar {
  width: 0px;
}
</style>
