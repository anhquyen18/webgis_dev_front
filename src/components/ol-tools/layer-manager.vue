<template>
  <a-popover trigger="click" placement="topRight" color="white">
    <template #content>
      <div style="max-width: 70vw">
        <a-divider style="border-color: black" orientation="left">
          Layers
          <a-button @click="showLayersInfoModal" style="border: none; padding: 0; font-size: 1rem">
            <InfoCircleOutlined />
          </a-button>
        </a-divider>
        <a-row class="main-layer" :gutter="[0, 8]">
          <a-col :xl="4" :xs="6" v-for="(layer, index) in mainLayerData">
            <a-tooltip>
              <template #title> {{ layer.title }}</template>
              <div class="layer-image">
                <a-button
                  @click="changeLayerVisible(layer.title, index)"
                  type="primary"
                  shape="circle"
                  block
                  class="h-100"
                  :style="{ margin: 0, padding: 0 }">
                  <img
                    :src="layer.imagePath"
                    alt=""
                    width="57"
                    height="57"
                    :class="{ 'layer-image__image--active': layer.visible }"
                    class="layer-image__image position-absolute rounded-circle" />
                </a-button>
              </div>
            </a-tooltip>
          </a-col>
        </a-row>
        <a-divider style="border-color: black" orientation="left">Basemaps</a-divider>
        <a-row class="basemap-layer" :gutter="[0, 8]">
          <a-col :xl="4" :xs="6" v-for="layer in basemapLayerData">
            <a-tooltip>
              <template #title>{{ layer.title }}</template>
              <div class="layer-image">
                <a-button
                  @click="changeBaseMap(layer.imagePath, layer.title)"
                  type="primary"
                  shape="circle"
                  block
                  class="h-100">
                  <img
                    :src="layer.imagePath"
                    alt=""
                    width="57"
                    height="57"
                    class="layer-image__image position-absolute rounded-circle" />
                </a-button>
              </div>
            </a-tooltip>
          </a-col>
        </a-row>
      </div>
    </template>
    <div class="layer-image">
      <a-button type="primary" shape="circle" block class="h-100">
        <img
          :src="layerManagerImage"
          alt=""
          width="57"
          height="57"
          class="layer-image__image position-absolute rounded-circle" />
      </a-button>
    </div>

    <a-modal v-model:open="layersInfoOpen" title="Layers Infomation" @ok="layersInfoModalOk" :zIndex="100000">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </a-popover>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, inject } from 'vue';

// import { userState } from '../stores/user-state';
import { mapState } from '../../stores/map-state';
import * as VueLayer from '../../js/VueLayer';
import { InfoCircleOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    InfoCircleOutlined,
  },
  setup() {
    const basemapLayerData = [
      {
        title: 'Open Street Map',
        imagePath: '/src/assets/layer-image/Openstreetmap_logo.png',
      },
      {
        title: 'Google Map',
        imagePath: '/src/assets/layer-image/googlemap.jpg',
      },
      // {
      //   title: 'Water Color',
      //   imagePath: '/src/assets/layer-image/watercolor.png',
      // },
      {
        title: 'Toner',
        imagePath: '/src/assets/layer-image/toner.png',
      },
      {
        title: 'Topo Map',
        imagePath: '/src/assets/layer-image/topo.jpg',
      },
      {
        title: 'Streets Map',
        imagePath: '/src/assets/layer-image/streets.png',
      },
      {
        title: 'No Basemap',
        imagePath: '/src/assets/layer-image/nobasemap.png',
      },
    ];

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

    // default basemap
    var layerManagerImage = ref(basemapLayerData[4].imagePath);
    const layersInfoOpen = ref(false);
    const test = ref(false);

    return {
      basemapLayerData,
      layerManagerImage,
      mainLayerData,
      layersInfoOpen,
      test,
    };
  },

  computed: {
    getSignInState: function () {
      return userState().getSignInState;
    },
    map() {
      return mapState().getMap;
    },
  },

  data() {
    return {
      // signInState: true,
      // test: '123',
      // anhquyen: '321123',
      // map: new ol.Map({}),
    };
  },

  mounted() {
    // console.log(this.map);
  },

  methods: {
    test() {
      // console.log('anhquyend');
      // console.log(this.map);
    },
    changeBaseMap(image, title) {
      this.layerManagerImage = image;
      // const baseLayerGroup = this.map.getLayers().getArray()[0];
      const baseLayers = this.map.getLayers().getArray()[0].getLayers().getArray();
      baseLayers.forEach((element) => {
        element.setVisible(false);
        if (element.get('title') == title) {
          element.setVisible(true);
        }
      });
    },
    changeLayerVisible(layerName, index) {
      var layer = VueLayer.getLayerByTitle(this.map, layerName, 1);
      if (layer.getVisible()) {
        this.mainLayerData[index].visible = false;
        layer.setVisible(false);
        // event.currentTarget.getElementsByTagName('img')[0].classList.remove('layer-image__image--active');
        // this.test = false;
      } else if (!layer.getVisible()) {
        layer.setVisible(true);
        this.mainLayerData[index].visible = true;

        // event.currentTarget.getElementsByTagName('img')[0].classList.add('layer-image__image--active');
      }
    },
    showLayersInfoModal() {
      this.layersInfoOpen = true;
    },
    layersInfoModalOk() {
      this.layersInfoOpen = false;
    },
  },
});
</script>

<style scoped lang="scss">
.layer-image {
  position: relative;
  width: 55px;
  height: 55px;
  &__image {
    top: -2px;
    left: -2px;
    border: 3px solid #ffffff;
    &--active {
      // top: -1px;
      // left: -1px;
      border: 3px solid #4eee60;
    }
  }
}
</style>
