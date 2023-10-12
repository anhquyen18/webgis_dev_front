<template>
  <a-spin :spinning="homeSpinning" tip="Loading..." size="large">
    <div class="content-container vh-100">
      <div id="map" class="map h-100"></div>
      <div class="top-left-nav d-inline-flex align-items-center">
        <Category></Category>
        <a-input-search class="ms-3 rounded" placeholder="Tìm kiếm" style="width: 300px" enter-button allowClear />
      </div>

      <div class="top-right-nav d-inline-flex align-items-center align-content-end">
        <AppManager v-if="getSignInState === true" />
        <SignIn></SignIn>
      </div>

      <div class="bottom-right-nav align-items-center">
        <!-- <LayerManager class="mt-2"> </LayerManager> -->
        <!-- <a-button type="primary" @click="test()">Tét</a-button> -->
        <ToolBox class="mt-5"></ToolBox>
        <LayerManager class="mt-5"></LayerManager>
      </div>
    </div>
    <FeatureInfoPopup></FeatureInfoPopup>
  </a-spin>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, provide } from 'vue';

import runMap from '../js/map.js';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { userState } from '../stores/user-state';
import { mapState } from '../stores/map-state';
import { storeToRefs } from 'pinia';
import * as customCRS from '../js/CustomCRS.js';
import SignIn from '../components/sign-in.vue';
import Category from '../components/category.vue';
import AppManager from '../components/ol-tools/app-manager.vue';
import LayerManager from '../components/ol-tools/layer-manager.vue';
import FeatureInfoPopup from '../components/ol-tools/feature-info-popup.vue';
import ToolBox from '../components/ol-tools/tool-box.vue';
import { setCookie, getCookie } from '../js/util';

// import * as a from '../assets';

export default defineComponent({
  components: {
    SignIn,
    Category,
    AppManager,
    LayerManager,
    FeatureInfoPopup,
    ToolBox,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = userState();
    const userData = ref();
    provide('userData', userData);

    const homeSpinning = ref(true);
    provide('homeSpinning', homeSpinning);

    let accessToken = {
      headers: {
        Authorization: `Bearer ${getCookie('accessToken')}`,
      },
    };
    let data = {
      accountId: '',
    };

    const getSignedIn = () => {
      axios
        .post('http://127.0.0.1:8000/api/signed-in', data, accessToken)
        .then((response) => {
          if (response) {
            userState().onAuthentication();
            userData.value = response.data.user;
            homeSpinning.value = false;
            // console.log(response.data);
            // console.log(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
          homeSpinning.value = false;

          userState().onLogOut();
        });
    };
    getSignedIn();
    return {
      homeSpinning,
      ...storeToRefs(store),
    };
  },

  computed: {
    map() {
      // const mapStore = mapState();
      // const { getMap, setMap } = mapStore;
      return mapState().getMap;
    },

    // getGeoserverAccount: function () {
    //   return userState().getGeoserverAccount;
    // },
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
    const mapStore = mapState();
    const { getMap, setMap } = mapStore;
    const map = new ol.Map({
      target: 'map',
      view: new ol.View({
        // projection: 'EPSG:4326',
        projection: customCRS.addCustomCrs('EPSG:5899'),

        minZoom: 5,
        maxZoom: 22,
      }),
    });
    mapState().setMap(map);
    runMap(map);

    // this.$store.commit('setMap', this.map);
  },

  methods: {
    getLayers() {
      // console.log(this.map.getLayers().getArray()[0]);
      console.log(this.map.getLayers().getArray());
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
      // return layer;
      // console.log(layer.getSource().getFeatures());
      var data = [];
      layer
        .getSource()
        .getFeatures()
        .forEach((v) => {
          // console.log(v.getGeometry().getType());
          // console.log(v.getGeometry().getCoordinates());
          data.push(v.getGeometry().getCoordinates());
        });

      // axios
      //   .post('http://127.0.0.1:8000/api/create-shapefile', { data: data })
      //   .then((response) => {
      //     if (response) {
      //       console.log(response);
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });

      axios
        .get('http://127.0.0.1:8000/api/download-shapefile')
        .then((response) => {
          if (response) {
            console.log(response);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    decryptAccount(username, userkey) {
      var bytes = CryptoJS.AES.decrypt(username, userkey);
      var code = bytes.toString(CryptoJS.enc.Utf8);
      return code;
    },

    sendRequestToGeoserver() {
      const xml = `<wfs:Transaction service="WFS" version="1.1.0"
  xmlns:topp="http://www.openplans.org/topp"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:wfs="http://www.opengis.net/wfs"
  xmlns:gml="http://www.opengis.net/gml"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd">
  <wfs:Update typeName="TestEditingFeature:hanh_chinh_nha_trang_EPSG3857">

            <wfs:Property>
            <wfs:Name>OBJECTID</wfs:Name>
            <wfs:Value>-1</wfs:Value>
            </wfs:Property>

            <wfs:Property>
            <wfs:Name>NAME</wfs:Name>
            <wfs:Value>anhquyendeptraivcl1123</wfs:Value>
            </wfs:Property>

    <ogc:Filter>
      <ogc:FeatureId fid="hanh_chinh_nha_trang_EPSG3857.167"/>
    </ogc:Filter>
  </wfs:Update>
  </wfs:Transaction>`;

      if (this.getGeoserverAccount['username']) {
        let updateRequest = {
          headers: {
            Authorization: `Basic ${window.btoa(
              this.decryptAccount(this.getGeoserverAccount['username'], this.getGeoserverAccount['userkey'])
            )}`,
            'content-type': 'text/xml',
          },
        };
        axios
          .post('http://localhost:8080/geoserver/TestEditingFeature/wfs', xml, updateRequest)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });

        // var url = 'http://localhost:8080/geoserver/TestEditingFeature/wfs';
        // var method = 'POST';
        // var req = new XMLHttpRequest();
        // req.open(method, url, false);
        // req.setRequestHeader('Content-type', 'text/xml');
        // req.setRequestHeader(
        //   'Authorization',
        //   'Basic ' +
        //     window.btoa(this.decryptAccount(this.getGeoserverAccount['username'], this.getGeoserverAccount['userkey']))
        // );
        // req.onreadystatechange = function () {
        //   if (req.readyState != 4) return;
        //   if (req.status != 200 && req.status != 304) {
        //     alert('HTTP error ' + req.status);
        //     return;
        //   }
        // };
        // if (req.readyState == 4) return;
        // req.send(xml);

        // $.ajax({
        //   type: 'POST',
        //   url: url,
        //   contentType: 'text/xml',
        //   data: xml,
        //   headers: {
        //     Authorization: `Basic ${window.btoa(
        //       this.decryptAccount(this.getGeoserverAccount['username'], this.getGeoserverAccount['userkey'])
        //     )}`,
        //     'Access-Control-Allow-Origin': '*',
        //   },
        //   success: function () {
        //     // layer.getSource().refresh();
        //   },
        // });
      }
    },
  },
});
</script>

<style lang="scss">
.map-container {
  position: relative;
}
.map .ol-zoom {
  position: absolute;
  top: 15rem;
  left: auto;
  right: 2.5rem;
}

.top-left-nav {
  position: absolute;
  top: 1rem;
  left: 2rem;
}
.top-right-nav {
  position: absolute;
  top: 1rem;
  right: 2rem;
}

.bottom-right-nav {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
}

.ol-control.ol-layerswitcher-image button::after {
  background-color: red;
  right: 2rem;
}
</style>
