<template>
  <div>
    <a-popover>
      <template #content> Search For Object By Area </template>
      <a-button type="primary" shape="round" @click="showModal">
        <template #icon>
          <i class="fa-solid fa-tower-cell"></i>
        </template>
      </a-button>
    </a-popover>

    <a-modal
      :open="visible"
      title="Search for objects by area"
      :closable="false"
      :zIndex="1000"
      @ok="modalOk"
      @cancel="modalCancel">
      <a-form layout="horizontal">
        <div class="row mb-2">
          <div class="col-4">
            <p class="d-flex justify-content-center align-items-center h-100">X Coordinate</p>
          </div>
          <div class="col-8">
            <a-input type="number" v-model:value="x" placeholder="" />
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-4">
            <p class="d-flex justify-content-center align-items-center h-100">Y Coordinate</p>
          </div>
          <div class="col-8">
            <a-input type="number" v-model:value="y" placeholder="" />
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-4">
            <p class="d-flex justify-content-center align-items-center h-100">Radius (m)</p>
          </div>
          <div class="col-8">
            <a-input type="number" v-model:value="radius" placeholder="" />
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-12">
            <a-select
              style="width: 100%"
              mode="multiple"
              v-model:value="selectedItem"
              :options="layerOptions"
              :filter-option="filterOption"
              placeholder="Select object">
            </a-select>
          </div>
        </div>

        <div class="row mb-2">
          <p class="text-warning">* CRS in map: EPSG:5899</p>
        </div>
      </a-form>
    </a-modal>
  </div>

  <!-- <a-modal title="Đối tượng được tìm thấy" :open="true" closable="true" :mask="false" :maskClosable="false"> </a-modal> -->

  <!-- <div style="position: fixed; top: 2px; left: 2px; background-color: red; z-index: 9999">avc</div> -->
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue';
import { mapState } from '../../stores/map-state';
import { interfaceState } from '../../stores/interface-state';
import { dataState } from '../../stores/data-state';
import * as VueLayer from '../../js/VueLayer';
import { Feature } from 'ol';
import { Circle } from 'ol/geom';

export default defineComponent({
  components: {},

  setup() {
    const visible = ref(false);

    const modalCancel = () => {
      visible.value = false;
    };

    const filterOption = (input, option) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    const layerOptions = ref([]);
    const selectedItem = ref([]);
    return {
      visible,
      modalCancel,
      filterOption,
      layerOptions,
      selectedItem,
    };
  },

  computed: {
    map() {
      return mapState().getMap;
    },
  },

  data() {
    return {
      // Nếu dùng hệ toạ độ có đơn vị độ thì chỗ radius bé hơn rất nhiều
      // radius 1000 ở hệ mét bằng khoảng 0.01 ở hệ độ
      x: 578976.4241944507,
      y: 1721853.3454252372,
      radius: 1000,
      foundData: [],
      excludeRoads: [],
    };
  },

  mounted() {},

  methods: {
    showModal() {
      this.visible = true;
      if (!this.layerOptions.length > 0) {
        VueLayer.getAllLayerTitle(this.map, 1).forEach((element, index) => {
          this.layerOptions.push({ value: element, label: element });
        });
        // this.getAllMainLayerName();
      }
    },
    modalOk() {
      if (this.x && this.y && this.radius && this.selectedItem.length > 0) {
        const searchVector = VueLayer.getLayerByTitle(this.map, 'Search layer');
        searchVector.getSource().clear();
        this.foundData = [];
        var feature = new Feature({
          geometry: new Circle([Number(this.x), Number(this.y)], Number(this.radius)),
        });
        searchVector.getSource().addFeature(feature);

        let i = 0;

        this.selectedItem.forEach((title) => {
          this.foundData.push({ key: i + 1, header: title, foundFeature: [] });
          VueLayer.getLayerByTitle(this.map, title, 1)
            .getSource()
            .forEachFeature((checkedFeature) => {
              if (feature.getGeometry().intersectsExtent(checkedFeature.getGeometry().getExtent())) {
                searchVector.getSource().addFeature(checkedFeature);
                this.foundData[i].foundFeature.push(checkedFeature);
              }
            });
          i++;
        });

        // phải là visible mới get intersectsExtent
        // this.getLayerByTitle('Roads layer').setVisible(true);

        VueLayer.getLayerByTitle(this.map, 'Roads layer')
          .getSource()
          .forEachFeature((checkedFeature) => {
            if (feature.getGeometry().intersectsExtent(checkedFeature.getGeometry().getExtent())) {
              dataState().getExcludeRoads.push(checkedFeature.getProperties()['target']);
            }
          });
        // console.log(this.getLayerByTitle('Roads layer').getSource().getFeatures());
        // this.getLayerByTitle('Roads layer').setVisible(false);

        // console.log(this.excludeRoads);
        console.log(dataState().getExcludeRoads);
        this.visible = false;
        this.sendDataToPopup();
      }
    },
    // getAllMainLayerName() {
    //   const mainLayer = this.map.getLayers().getArray()[1].getLayers().getArray();
    //   mainLayer.forEach((element) => {
    //     this.layerOptions.push({ label: element.get('title'), value: element.get('title') });
    //   });
    // },

    sendDataToPopup() {
      console.log('updated');
      this.$emit('data-updated', this.foundData);
    },

    clearSearchVector() {
      // console.log('search vector');
      // console.log(this.getLayerByTitle('Search layer').get('title'));

      VueLayer.getLayerByTitle(this.map, 'Search layer').getSource().clear();
    },
  },
});
</script>

<style scoped lang="scss"></style>
