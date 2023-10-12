<template>
  <a-popover trigger="click" placement="leftBottom" color="white">
    <template #content>
      <a-divider style="border-color: black" orientation="left">Các lớp dữ liệu</a-divider>
      <ul class="layer-list main-layer">
        <li v-for="layer in mainLayerData" class="me-2">
          <a-tooltip>
            <template #title> {{ layer.title }}</template>
            <div class="layer-image">
              <a-button
                @click="changeLayerVisible(layer.title, $event)"
                type="primary"
                shape="circle"
                block
                class="h-100">
                <img
                  :src="layer.imagePath"
                  alt=""
                  width="57"
                  height="57"
                  class="layer-image__image position-absolute rounded-circle layer-image__image--active" />
              </a-button>
            </div>
          </a-tooltip>
        </li>
      </ul>
      <a-divider style="border-color: black" orientation="left">Bản đồ nền</a-divider>
      <ul class="layer-list">
        <li v-for="layer in basemapLayerData" class="me-2">
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
        </li>
      </ul>
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
  </a-popover>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue';

// import { userState } from '../stores/user-state';
import { mapState } from '../../stores/map-state';
// import * as a from '../assets';

export default defineComponent({
  components: {},
  setup() {
    const basemapLayerData = [
      {
        title: 'Open Street Map',
        imagePath: '/src/assets/layer-image/osm.png',
      },
      {
        title: 'Google Map',
        imagePath: '/src/assets/layer-image/google.png',
      },
      {
        title: 'Water Color',
        imagePath: '/src/assets/layer-image/watercolor.png',
      },
      {
        title: 'Toner',
        imagePath: '/src/assets/layer-image/toner.png',
      },
      {
        title: 'No Basemap',
        imagePath: '/src/assets/layer-image/nobasemap.png',
      },
    ];
    const mainLayerData = [
      {
        title: 'Cống ngầm',
        imagePath: '',
        visible: true,
      },
      {
        title: 'Kênh',
        imagePath: '',
        visible: true,
      },
      {
        title: 'Cống ngăn triều',
        imagePath: '',
        visible: true,
      },
      {
        title: 'Hố ga',
        imagePath: '',
        visible: true,
      },
      {
        title: 'Cửa xả',
        imagePath: '',
        visible: true,
      },
      {
        title: 'Hồ điều hoà',
        imagePath: '',
        visible: true,
      },
      {
        title: 'Trạm đo mưa',
        imagePath: '',
        visible: true,
      },
    ];
    var layerManagerImage = ref(basemapLayerData[1].imagePath);
    const test = ref(false);
    return {
      basemapLayerData,
      layerManagerImage,
      mainLayerData,
      test,
    };
  },

  computed: {
    getSignInState: function () {
      return userState().getSignInState;
    },
    map() {
      // const mapStore = mapState();
      // const { getMap, setMap } = mapStore;
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
    getMainLayerByTitle(title) {
      const mainLayer = this.map.getLayers().getArray()[1].getLayers().getArray();
      var layer = null;
      mainLayer.forEach((element) => {
        if (element.get('title') == title) {
          layer = element;
        }
      });
      return layer;
    },
    changeLayerVisible(layerName, event) {
      var layer = this.getMainLayerByTitle(layerName);
      if (layer.getVisible()) {
        layer.setVisible(false);
        event.currentTarget.getElementsByTagName('img')[0].classList.remove('layer-image__image--active');
        this.test = false;
      } else if (!layer.getVisible()) {
        layer.setVisible(true);
        event.currentTarget.getElementsByTagName('img')[0].classList.add('layer-image__image--active');
      }
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

.layer-list {
  display: flex;
  // justify-content: space-between;
  flex-flow: row wrap;
  width: 315px;
  height: 60px;
}

.main-layer {
  height: 150px;
}
</style>
