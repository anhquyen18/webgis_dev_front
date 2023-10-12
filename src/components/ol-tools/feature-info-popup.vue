<template>
  <div id="popup" class="ol-popup" style="display: none">
    <a href="#" id="popup-closer" class="ol-popup-closer fs-6"></a>
    <div id="popup-content">
      <a-card
        size="small"
        style="width: 300px"
        :bodyStyle="{ padding: 0 }"
        :headStyle="{ paddingLeft: '8px', fontSize: '1rem' }"
        :bordered="false">
        <!-- <template #extra><a href="#">X</a></template> -->
        <!-- <template #title
          ><span style="font-weight: bold">{{ featureProp[0] }}</span></template
        > -->
        <template #title>
          <div class="d-flex">
            <span style="font-weight: bold" class="me-2">{{ title }}</span>
            <ChartPopup></ChartPopup>
          </div>
          <!-- <a-button v-if="isStation" class="ms-2" type="dashed" size="small" @click="showChart">Biểu đồ</a-button> -->
        </template>

        <a-table
          class="ant-table-striped"
          tableLayout="fixed"
          :columns="columns"
          :data-source="rows"
          size="small"
          :pagination="false"
          :showHeader="false"
          :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)"
          :style="{ fontSize: '0.8rem', borderRadius: '8px' }">
          <template #footer>
            <div class="d-flex justify-content-around">
              <a-button type="primary" size="small"
                >Phóng to <i class="fa-solid fa-magnifying-glass-plus ms-1"></i>
              </a-button>
              <a-button type="primary" size="small">Dẫn đường <i class="fa-solid fa-location-dot ms-1"></i></a-button>
            </div>
          </template>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue';
import { mapState } from '../../stores/map-state';
import ChartPopup from './chart-popup.vue';

export default defineComponent({
  components: {
    ChartPopup,
  },
  setup() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        align: 'center',
        width: 150,
      },
      {
        title: 'Value',
        dataIndex: 'value',
        align: 'center',
        width: 147,
      },
    ];
    return {
      columns,
    };
  },

  computed: {
    map() {
      return mapState().getMap;
    },
  },

  data() {
    return {
      featureProp: [],
      title: '',
      rows: [],
      isStation: false,
      stationData: { id: 1, year: 2023 },
      // signInState: true,
      // test: '123',
      // anhquyen: '321123',
      // map: new ol.Map({}),
    };
  },

  mounted() {
    // console.log(this.map);
    // console.log(this.$el.querySelector('div'));
    // console.log(this.map);
  },

  watch: {
    map: {
      // cái này chỉ dùng được khi khai báo ở home
      // khai báo ở các component con không hoạt động
      // chắc là do ở home là chỗ khai báo ol.Map
      handler() {
        this.addClick();
      },
      deep: false,
    },
  },

  methods: {
    // changeLayerManagerImage(image) {
    //   this.layerManagerImage = image;
    // },
    test: function () {
      // console.log(this.testData);
      // console.log('anhquydsa');
      // console.log(this.testa);
      // console.log('a');t
      this.isStation = false;
      console.log(this.isStation);
    },

    addClick() {
      let closer = document.getElementById('popup-closer');
      let highlightLayer = new ol.layer.Vector({
        title: 'Feature popup highlight',
        source: new ol.source.Vector({}),
      });
      highlightLayer.setVisible(false);
      const overlay = new ol.Overlay({
        title: 'Feature popup',
        id: 'featurePopupOverlay',
        element: document.getElementById('popup'),
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });

      closer.onclick = function () {
        highlightLayer.getSource().clear();
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };

      this.map.addOverlay(overlay);

      this.map.addLayer(highlightLayer);

      let that = this;
      this.map.on('singleclick', function (evt) {
        that.featureProp = [];

        highlightLayer.getSource().clear();
        evt.target.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
          if (layer) {
            // console.log(feature.getProperties());
            // click 2 lần liên tục trên 1 feature thì ở lần click thứ 2 nó sẽ nhận được
            // 2 feature 1 feature đầu sẽ chỉ bao gồm geometry mà không có property khác
            // feature thứ 2 có đủ các feature như bình thường
            // geometry vẫn có
            // properties không có???
            // id = undefined sau khi click trùng feature
            // console.log(feature.getId().split('.')[0]);
            if (feature.getId() && feature.getId().split('.')[0] === 'TramDoMua') that.isStation = true;
            else that.isStation = false;

            let featureProp = {};
            featureProp.title = layer.get('title');
            featureProp.rows = [];
            featureProp.geom = '';
            let props = feature.getProperties();
            console.log(feature.getProperties());
            Object.keys(props).forEach((x, i, arr) => {
              if (x != 'geometry' && x != 'HinhAnh') {
                featureProp.rows.push({
                  key: i + 1,
                  name: x.toUpperCase(),
                  value: props[x],
                });
              } else if (x == 'geometry') {
                featureProp.geom = props[x];
              }
              if (i > 10) {
                arr.length = i + 1;
              }
            });

            if (featureProp.rows.length) {
              that.featureProp.push(featureProp);
            }
          }
        });

        // console.log(that.featureProp[0].rows.target);
        // console.log(that.featureProp[0].geom);
        if (that.featureProp.length) {
          that.title = that.featureProp[0].title;
          that.rows = that.featureProp[0].rows;

          let feature = new ol.Feature({
            geometry: that.featureProp[0].geom,
          });

          // console.log(that.featureProp[0].rows);
          highlightLayer.getSource().addFeature(feature);
          const coordinate = evt.coordinate;
          overlay.setPosition(coordinate);
        } else {
          overlay.setPosition(undefined);
        }
      });
    },

    showChart() {
      axios
        .post('http://127.0.0.1:8000/api/get-measuring-data', this.stationData, {
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
    },

    popupCloser() {
      console.log(this.$el.querySelector('.ol-popup'));
    },
  },
});
</script>

<style scoped lang="scss">
// #feature-info-popup {
//   width: 200px;
//   height: 200px;
//   background-color: salmon;
// }

.ol-popup {
  background: transparent;
  position: absolute;
  // box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  // border-radius: 10px;
  // border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  // min-width: 280px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  z-index: 1000;
}
.ol-popup-closer:after {
  content: '✖';
}

#popup-content {
  // & > div {
  //   padding: 0 !important;
  // }
}

[data-doc-theme='light'] .ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
[data-doc-theme='dark'] .ant-table-striped :deep(.table-striped) td {
  background-color: rgb(29, 29, 29);
}
</style>
