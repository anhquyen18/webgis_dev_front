<template>
  <div>
    <a-popover v-model:open="visible" title="Công cụ bản đồ" trigger="click" placement="leftBottom">
      <template #content>
        <ul class="tool-list">
          <a-popover>
            <template #content> Popup </template>
            <li class="tool-item">
              <a-switch
                v-model:checked="featurePopupVisible"
                checked-children="ON"
                un-checked-children="OFF"
                @change="featurePopupVisibleChange()" />
            </li>
          </a-popover>
          <a-popover>
            <template #content> Chuyển độ hệ toạ độ (CRS) </template>
            <li class="tool-item">
              <ConvertCrsTool></ConvertCrsTool>
            </li>
          </a-popover>
          <a-popover>
            <template #content> Tìm kiếm đối tượng theo vùng chọn </template>
            <li class="tool-item">
              <SearchFeatureByAreaTool
                @data-updated="searchFeatureUpdate"
                ref="clearSearchVectorRef"></SearchFeatureByAreaTool>
            </li>
          </a-popover>
          <a-popover>
            <template #content> Tìm kiếm đường đi </template>
            <li class="tool-item">
              <RoutingTool></RoutingTool>
            </li>
          </a-popover>
          <a-popover>
            <template #content> Đo đạc </template>
            <li class="tool-item">
              <MeasureTool ref="measureToolRef" @start-measure="startMeasure"></MeasureTool>
            </li>
          </a-popover>
          <a-popover>
            <template #content> Test </template>
            <li class="tool-item">
              <a-button type="primary" shape="round" @click="test"><i class="fa-solid fa-bed"></i></a-button>
            </li>
          </a-popover>
        </ul>
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
      style="position: fixed; top: 30%; left: 3rem; width: 300px; max-height: 600px">
      <a-card title="Kết quả tìm kiếm" size="small" :bodyStyle="{ padding: 0 }">
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
                  <a-button type="primary" size="small">Tìm đường</a-button>
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
      :class="{ 'measure-popup__active': measurePopupVisible }"
      style="position: fixed; top: 15%; left: 3rem; width: 200px; max-height: 200px">
      <a-card title="Đo đạc" size="small" :bodyStyle="{ padding: 0 }">
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
            <a-button type="primary" size="small" @click="clearMeasure">Xoá đo</a-button>
          </div>
        </div>
        <div class="row mt-2 justify-content-center align-items-center">
          <a-button type="text" size="small" danger style="width: 50%" @click="stopMeasure">
            <i class="fa-solid fa-ban me-1" style="font-size: 0.8rem"></i>Kết thúc đo
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
import RoutingTool from './routing-tool.vue';
import MeasureTool from './measure-tool.vue';

export default defineComponent({
  components: {
    ConvertCrsTool,
    SearchFeatureByAreaTool,
    RoutingTool,
    MeasureTool,
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
          label: 'Đo',
        },
        {
          value: 'inactive',
          label: 'Dừng',
        },
      ],
      measureStatus: 'active',
    };
  },

  mounted() {
    // console.log(this.map);
    // console.log(this.map);
    // this.featurePopupOverlay = this.map.getOverlayById('featurePopupOverlay');
  },

  watch: {
    map: {
      handler() {},
      deep: false,
    },
  },

  methods: {
    getOverlayById(id) {
      let overlay;
      overlay = this.map.getOverlayById(id);
      return overlay;
    },
    featurePopupVisibleChange() {
      this.getLayerByTitle('Feature popup highlight').getSource().clear();
      this.map.getOverlayById('featurePopupOverlay').setPosition(undefined);
      if (this.featurePopupVisible) {
        this.getLayerByTitle('Feature popup highlight').setVisible(true);
        document.getElementById('popup').style.display = 'block';
      } else {
        this.getLayerByTitle('Feature popup highlight').setVisible(false);
        document.getElementById('popup').style.display = 'none';
      }
    },
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
      this.measurePopupVisible = data;
    },
    test() {
      axios
        .get('http://127.0.0.1:8000/api/test')
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
    },
  },
});
</script>

<style scoped lang="scss">
.tool-list {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  flex-flow: row wrap;
  width: 315px;
  height: 60px;
}

.search-feature-popup {
  display: none;
  &__active {
    display: block;
  }
}

.measure-popup {
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
