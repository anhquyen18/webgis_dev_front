<template>
  <a-spin :spinning="homeSpinning" tip="Loading..." size="large">
    <a-layout>
      <a-layout-sider
        breakpoint="lg"
        class="home-sider"
        v-model:collapsed="siderCollapsed"
        theme="light"
        :width="siderWidth"
        :collapsed-width="collapsedWidth"
        @breakpoint="onBreakpoint"
        :class="{ 'zero-width': collapsedWidth === 80 }">
        <a-row class="mt-2" align="middle">
          <a-col :span="6">
            <router-link :to="{ name: 'home-page' }">
              <img src="../assets/luffy-chilling-gear5-round.png" alt="logo" style="width: 4rem; height: 4rem" />
            </router-link>
          </a-col>
          <a-col v-if="!siderCollapsed" :span="18">
            <p
              style="
                text-align: center;
                font-weight: bold;
                font-size: 1rem;
                text-transform: uppercase;
                color: rgb(91, 91, 91);
              ">
              WebGIS Project <br />
              by PAI
            </p>
          </a-col>
        </a-row>
        <SiderLayerManager ref="siderLayerManagerRef" class="mt-3"></SiderLayerManager>
      </a-layout-sider>

      <a-layout-content>
        <div class="content-container vh-100" style="position: relative">
          <div id="map" class="map h-100"></div>
          <a-row justify="start" class="top-left-nav align-items-center" style="width: 90%">
            <a-col :xl="1" :xs="2">
              <a-button size="large" shape="circle" @click="siderCollapsedChange">
                <i class="fa-solid fa-bars"></i>
              </a-button>
            </a-col>
            <a-col :xl="6" :md="10" :xs="0">
              <a-input-search
                v-model:value="searchValue"
                class="ms-3 rounded"
                placeholder="Search"
                @search="onSearch()"
                :disabled="searchInputDisabled"
                :enter-button="!searchInputDisabled"
                :loading="searchInputDisabled" />
            </a-col>
          </a-row>

          <div class="top-right-nav d-inline-flex align-items-center align-content-end">
            <AppManager v-if="getSignInState === true" />
            <SignIn></SignIn>
          </div>

          <div class="bottom-right-nav align-items-center">
            <ToolBox class="mt-5"></ToolBox>
            <LayerManager class="mt-5"></LayerManager>
          </div>
        </div>
      </a-layout-content>
    </a-layout>
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
import SiderLayerManager from '../components/ol-tools/sider-layer-manager.vue';
import { setCookie, getCookie } from '../js/util';
import { PieChartOutlined, LoadingOutlined } from '@ant-design/icons-vue';

import { Map, View } from 'ol';
import olms from 'ol-mapbox-style';

// import * as a from '../assets';

export default defineComponent({
  components: {
    SignIn,
    Category,
    AppManager,
    LayerManager,
    FeatureInfoPopup,
    ToolBox,
    SiderLayerManager,
    PieChartOutlined,
    LoadingOutlined,
  },

  data() {
    return {
      test: false,
    };
  },

  beforeRouteEnter(to, from, next) {
    if (getCookie('accessToken') === '') {
      next((data) => {
        data.homeSpinning = false;
      });
    } else {
      next((data) => {
        const getSignedIn = () => {
          axios
            .post(
              'http://127.0.0.1:8000/api/signed-in',
              { accountId: '' },
              {
                headers: {
                  Authorization: `Bearer ${getCookie('accessToken')}`,
                },
              }
            )
            .then((response) => {
              if (response) {
                console.log(response);
                userState().onAuthentication();
                data.homeSpinning = false;
                data.userData = JSON.parse(getCookie('user'));
                setCookie('user', JSON.stringify(response.data.user));
              }
            })
            .catch((error) => {
              console.log(error);
              data.homeSpinning = false;
              setCookie('accessToken', '');
              setCookie('user', '');
              userState().onLogOut();
            });
        };
        getSignedIn();
      });
    }
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = userState();
    // console.log(JSON.parse(getCookie('user')));
    // xem cái userData này có giống accountInfo bên account không

    const homeSpinning = ref(true);
    provide('homeSpinning', homeSpinning);

    const userData = ref();
    provide('userData', userData);

    const siderCollapsed = ref(false);
    const siderWidth = ref(250);
    const collapsedWidth = ref(80);
    const onBreakpoint = (broken) => {
      // console.log(broken);
      if (broken) {
        collapsedWidth.value = 0;
        // console.log(collapsedWidth.value);
      } else {
        collapsedWidth.value = 80;
        // console.log(collapsedWidth.value);
      }
    };
    const mainLayerData = ref([
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
    ]);
    provide('mainLayerData', mainLayerData);

    const searchValue = ref('');
    const searchInputDisabled = ref(false);
    provide('searchInputDisabled', searchInputDisabled);

    // console.log((siderCollapsed.value = true));
    return {
      userData,
      homeSpinning,
      ...storeToRefs(store),
      siderCollapsed,
      siderWidth,
      collapsedWidth,
      onBreakpoint,
      searchValue,
      searchInputDisabled,
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

  mounted() {
    // console.log(this.anhquyen);
    const mapStore = mapState();
    const { getMap, setMap } = mapStore;

    const map = new Map({
      target: 'map',
      view: new View({
        // projection: 'EPSG:4326',
        projection: customCRS.addCustomCrs('EPSG:5899'),

        minZoom: 5,
        maxZoom: 22,
      }),
    });
    // const key = 'FaZvqSsyUcg9u0pnhR97';
    // const styleJson = `https://api.maptiler.com/maps/topo-v2/style.json?key=${key}`;
    // olms.apply(map, 'https://api.maptiler.com/maps/topo-v2/style.json?key=FaZvqSsyUcg9u0pnhR97');
    // olms.apply(map, styleJson);
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

    siderCollapsedChange() {
      this.siderCollapsed = !this.siderCollapsed;
      // console.log(this.siderCollapsed);
    },

    onSearch() {
      // console.log(this.searchValue);
      this.$refs.siderLayerManagerRef.onSearch(this.searchValue);
      // console.log(this.$refs);
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
  top: 35vh;
  left: auto;
  right: 2.5vw;
}

.top-left-nav {
  position: absolute;
  top: 2vh;
  left: 2vw;
}
.top-right-nav {
  position: absolute;
  top: 2vh;
  right: 2vw;
}

.bottom-right-nav {
  position: absolute;
  bottom: 2vw;
  right: 2vh;
  display: flex;
  flex-direction: column;
}

.ol-control.ol-layerswitcher-image button::after {
  right: 2rem;
}

.home-sider {
  position: relative;
  width: 100%;
  // margin-left: calc(100vw - 100%);
  overflow-x: hidden;
  overflow-y: overlay;
  // scrollbar-gutter: stable;
  // overflow: hidden !important;
  &.zero-width {
    border: 1px solid rgb(203, 203, 203);
    padding: 0.5rem;
    height: 100vh;
    max-height: 100vh;
  }
  &::-webkit-scrollbar {
    width: 0px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 3px;
  }
  &:hover {
    // overscroll-behavior-y: overlay;
  }
}
</style>
