import {
  Vector as VectorSource,
  ImageWMS as ImageWMSSource,
  XYZ as XYZSource,
  Stamen as StamenSource,
  OSM as OSMSource,
  Raster as RasterSource,
  TileJSON as TileJSONSource,
} from 'ol/source.js';
import { Vector as VectorLayer, Tile as TileLayer, Group as LayerGroup, Image as ImageLayer } from 'ol/layer.js';
import { Style, Icon, Stroke, Circle, Fill, Text } from 'ol/style.js';
import { GeoJSON } from 'ol/format.js';
import { LineString, Geometry, Polygon, Point } from 'ol/geom.js';
import { Feature } from 'ol';
import { Draw } from 'ol/interaction';
import { WKB } from 'ol/format.js';
import olms from 'ol-mapbox-style';

import ol_interaction_Hover from 'ol-ext/interaction/Hover.js';
import ol_source_IDW from 'ol-ext/source/IDW.js';

const runMap = (map) => {
  // var map;
  var format = 'image/png';
  var degreeBounds = [108.66931915300006, 11.769107818000062, 109.46916961700003, 12.86867141600004];
  const meterBounds = [576281.1063905563, 1720086.1249637157, 580872.2309828001, 1724335.9856269273];
  const maxMeterBounds = [556421, 1702209, 604820, 1739026];
  // var TKmeterBounds = [548539.1168823242187500, 1719723.5018920898437500, 554086.7171020507812500, 1724261.0479125976562500];
  const maptilerKey = 'FaZvqSsyUcg9u0pnhR97';
  // ---------------------------------
  // ----------Map Layer--------------
  // ---------------------------------
  var baseLayerGroup = new LayerGroup({
    title: 'Base layers',
    // openInLayerSwitcher: true,
    layers: [
      new TileLayer({
        title: 'Google Map',
        baseLayer: true,
        preload: Infinity,
        type: 'base',
        visible: false,
        source: new XYZSource({
          url: 'https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga',
          crossOrigin: 'anonymous',
        }),
      }),
      // new TileLayer({
      //   preload: Infinity,
      //   title: 'Water Color',
      //   baseLayer: true,
      //   visible: false,
      //   source: new StamenSource({ layer: 'watercolor', attributions: [], attributionsCollapsible: false }),
      // }),
      new TileLayer({
        preload: Infinity,
        title: 'Toner',
        baseLayer: true,
        visible: false,
        source: new TileJSONSource({
          url: `https://api.maptiler.com/maps/toner-v2/tiles.json?key=${maptilerKey}`, // source URL
          tileSize: 512,
          attributions: [],
          attributionsCollapsible: false,
          crossOrigin: 'anonymous',
        }),
      }),
      new TileLayer({
        preload: Infinity,
        baseLayer: true,
        source: new OSMSource({
          attributions: [],
          attributionsCollapsible: false,
        }),
        visible: false,
        title: 'Open Street Map',
      }),
      new TileLayer({
        title: 'Topo Map',
        baseLayer: true,
        preload: Infinity,
        type: 'base',
        visible: false,
        source: new TileJSONSource({
          url: `https://api.maptiler.com/maps/topo-v2/tiles.json?key=${maptilerKey}`, // source URL
          tileSize: 512,
          attributions: [],
          attributionsCollapsible: false,
          crossOrigin: 'anonymous',
        }),
      }),
      new TileLayer({
        title: 'Streets Map',
        baseLayer: true,
        preload: Infinity,
        type: 'base',
        visible: true,
        source: new TileJSONSource({
          url: `https://api.maptiler.com/maps/streets-v2/tiles.json?key=${maptilerKey}`, // source URL
          tileSize: 512,
          attributions: [],
          attributionsCollapsible: false,
          crossOrigin: 'anonymous',
        }),
      }),
      new TileLayer({
        baseLayer: true,
        visible: false,
        title: 'No Basemap',
      }),
    ],
  });

  const congNgamLayer = new VectorLayer({
    title: 'Cống ngầm',
    source: new VectorSource({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Acong_ngam&outputFormat=application%2Fjson',
      format: new GeoJSON(),
    }),
    style: new Style({
      stroke: new Stroke({
        color: 'hotpink',
        width: 2,
      }),
    }),
  });
  const kenhLayer = new VectorLayer({
    title: 'Kênh',
    source: new VectorSource({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Akenh&outputFormat=application%2Fjson',
      format: new GeoJSON(),
    }),
    style: new Style({
      stroke: new Stroke({
        color: '#00ab5b',
        // lineDash: [10, 10],
        width: 2,
      }),
    }),
  });

  const hoGaLayer = new VectorLayer({
    title: 'Hố ga',
    source: new VectorSource({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Aho_ga&outputFormat=application%2Fjson',
      format: new GeoJSON(),
    }),
    style: new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: 'grey',
        }),
        stroke: new Stroke({
          color: 'white',
          width: 1,
        }),
      }),
    }),
  });
  const cuaXaLayer = new VectorLayer({
    title: 'Cửa xả',
    source: new VectorSource({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Acua_xa&outputFormat=application%2Fjson',
      format: new GeoJSON(),
    }),
    style: new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: '#ffa500',
        }),
        stroke: new Stroke({
          color: 'white',
          width: 1,
        }),
      }),
    }),
  });
  const congNganTrieuLayer = new VectorLayer({
    title: 'Cống ngăn triều',
    source: new VectorSource({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Acong_ngan_trieu&outputFormat=application%2Fjson',
      format: new GeoJSON(),
    }),
    style: new Style({
      image: new Circle({
        radius: 5,
        fill: new Fill({
          color: '#35177a',
        }),
        stroke: new Stroke({
          color: 'white',
          width: 1,
        }),
      }),
    }),
  });

  const hoDieuHoaLayer = new VectorLayer({
    title: 'Hồ điều hoà',
    preview: '/src/assets/luffy-chilling-gear5-round.png',
    // preview: 'F:/Programming project/Personal/web-gis-dev/front-end/src/assets/luffy-chilling-gear5-round.png',
    source: new VectorSource({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Aho_dieu_hoa&outputFormat=application%2Fjson',
      format: new GeoJSON(),
    }),
    style: new Style({
      stroke: new Stroke({
        color: 'white',
        width: 1,
      }),
      fill: new Fill({
        color: '#1ca9c9',
      }),
    }),
  });

  const tramDoMuaLayer = new VectorLayer({
    title: 'Trạm đo mưa',
    // preview: 'F:/Programming project/Personal/web-gis-dev/front-end/src/assets/luffy-chilling-gear5-round.png',
    source: new VectorSource({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Atram_do_mua&outputFormat=application%2Fjson',
      format: new GeoJSON(),
    }),
    style: new Style({
      image: new Icon({
        // anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: '../src/assets/icon/broadcast.png',
      }),
      stroke: new Stroke({
        color: 'white',
        width: 1,
      }),
    }),
  });

  var mainLayerGroup = new LayerGroup({
    title: 'Main layers',
    layers: [congNgamLayer, kenhLayer, hoGaLayer, cuaXaLayer, hoDieuHoaLayer, congNganTrieuLayer, tramDoMuaLayer],
  });
  map.addLayer(baseLayerGroup);
  map.addLayer(mainLayerGroup);
  map.getView().fit(meterBounds, map.getSize());

  var hover = new ol_interaction_Hover({ cursor: 'pointer' });
  map.addInteraction(hover);

  // Define a new legend
  // var legend = new ol.legend.Legend({
  //   title: 'Legend',
  //   margin: 5,
  //   maxWidth: 300,
  // });
  // var legendCtrl = new ol.control.Legend({
  //   legend: legend,
  //   collapsed: false,
  // });
  // map.addControl(legendCtrl);

  // hover.on('enter', function (e) {
  // hover.setCursor('pointer');
  // switch (e.feature.getGeometry().getType()) {
  //   case 'LineString':
  //     hover.setCursor('copy');
  //     break;
  //   case 'Polygon':
  //     hover.setCursor('help');
  //     break;
  //   default:
  //     hover.setCursor('pointer');
  //     break;
  // }
  // });
  // map.setVisible(false);'
  // baseLayerGroup.setVisibile(false);
  // console.log('anhquyen');
  // var reader = new FileReader();
  // reader.onload = function (e) {
  // this.setState({ file: reader.result });
  // reader.readAsDataURL(e.target.files[0]);
  // console.log(e);
  // data = reader.readAsDataURL(e.target.files[0]);
  //   var data = e.target.result;
  //   var workbook = XLSX.read(data, {
  //     type: 'binary',
  //   });
  //   workbook.SheetNames.forEach(function (sheetName) {
  //     // Here is your object
  //     var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
  //     var json_object = JSON.stringify(XL_row_object);
  //     console.log(json_object);
  //   });
  // };

  /* set up async GET request */
  // var testUrl = '../src/assets/shapefile/draw_test.xlsx';
  // var req = new XMLHttpRequest();
  // req.open('GET', testUrl, true);
  // req.responseType = 'arraybuffer';

  // req.onload = function (e) {
  //   console.log(req.response);
  //   var data = new Uint8Array(req.response);
  //   var workbook = XLSX.read(data, { type: 'array' });
  //   var sheet = workbook.SheetNames[0];
  //   /* DO SOMETHING WITH workbook HERE */
  //   // console.log(sheet);
  //   // console.log(workbook);
  //   // console.log(req.response);
  //   // console.log(XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]));
  //   data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
  //   data.forEach((item) => {
  //     // console.log(item['ToadoX'], item['ToadoY']);
  //   });
  // };

  // req.send();
  // TEST DRAW FEATURE FROM EXCEL DATA READING
  var highlightLabelStyles = {
    MultiLineString: new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 4,
      }),
    }),
    LineString: new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 4,
      }),
    }),
    Point: new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({
          color: 'pink',
        }),
        stroke: new Stroke({
          color: 'white',
          width: 1,
        }),
      }),
    }),
    MultiPolygon: new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(243, 138, 138, 0.5)',
      }),
    }),
    Polygon: new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 3,
      }),
      fill: new Fill({
        color: 'rgba(243, 138, 138, 0.5)',
      }),
    }),
    Circle: new Style({
      stroke: new Stroke({
        color: 'cyan',
        width: 1,
      }),
      fill: new Fill({
        color: 'rgba(243, 138, 138, 0.5)',
      }),
    }),
  };

  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    loader: function (extent, resolution, projection, success, failure) {
      const onError = function () {
        vectorSource.removeLoadedExtent(extent);
        failure();
      };
      var polygonArray = [];

      axios
        .get('../src/assets/shapefile/draw_test.xlsx', { responseType: 'arraybuffer' })
        .then((response) => {
          if (response) {
            var data = new Uint8Array(response.data);
            var workbook = XLSX.read(data, { type: 'array' });
            var sheet = workbook.SheetNames[0];
            data = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
            data.forEach((item, index, arr) => {
              // console.log(item['ToadoX'], item['ToadoY']);
              // arr.length = index + 1;
              // if (index === arr.length - 2) arr.length = index + 1;
              // console.log(index, ' ', arr.length);
              var feature1 = new Feature({
                geometry: new Point([item['ToadoX'], item['ToadoY']]),
              });
              polygonArray.push([item['ToadoX'], item['ToadoY']]);
              // vectorSource.addFeature(feature1);
              success(feature1);
            });
            var polygon = new Polygon([polygonArray]);
            var polygonFeature = new Feature(polygon);
            // vectorSource.addFeature(polygonFeature);

            for (var i = 0; i < data.length - 1; i++) {
              var feature2 = new Feature({
                geometry: new LineString([
                  [data[i]['ToadoX'], data[i]['ToadoY']],
                  [data[i + 1]['ToadoX'], data[i + 1]['ToadoY']],
                ]),
              });
              // vectorSource.addFeature(feature2);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });
  var stylePopupFunction = function (feature) {
    return highlightLabelStyles[feature.getGeometry().getType()];
  };
  const vectorLayer = new VectorLayer({
    // Layer này dùng để test vẽ các object từ file excel
    title: 'Test Layer',
    // source: vectorSource,

    // source: vectorSource,
    style: stylePopupFunction,
  });
  map.addLayer(vectorLayer);
  // console.log(map.getView().getProjection().getCode());
  const testData = {
    testa: 'anhquyendeptraivcl',
    testb: 'admin',
  };

  const searchLayer = new VectorLayer({
    title: 'Search hightlight layer',
    source: new VectorSource(),
    style: stylePopupFunction,
  });
  map.addLayer(searchLayer);

  const routingPointLayer = new VectorLayer({
    title: 'Start and destination points',
    source: new VectorSource(),
    style: new Style({
      image: new Icon({
        color: 'rgba(255, 0, 0, 0)',
        crossOrigin: 'anonymous',
        src: '../src/assets/icon/location-sign.png',
        scale: 0.4,
      }),
    }),
  });
  map.addLayer(routingPointLayer);

  // const routeLayer = new Image({
  //   title: 'Route layer',
  //   source: new ImageWMS(),
  // });
  // map.addLayer(routeLayer);

  const roadsLayer = new VectorLayer({
    title: 'Roads layer',
    source: new VectorSource({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3ATamKy_roads_EPSG5899_explode&outputFormat=application%2Fjson',
      format: new GeoJSON(),
    }),
    style: new Style({
      stroke: new Stroke({
        color: 'rgba(255,255,255,0)',
        width: 4,
      }),
    }),
    // visible: false,
  });
  map.addLayer(roadsLayer);
  roadsLayer.getSource().on('featuresloadend', () => {
    roadsLayer.setVisible(false);
  });

  const measureVector = new VectorLayer({
    title: 'Measure layer',
    // source: measureSource,
    // style: function (feature) {
    //   return measureStyleFunction(feature, true);
    // },
  });
  // map.addInteraction(measureModify);
  map.addLayer(measureVector);

  // -------------------------------------------------------------------------------------------------
  // Layer IDW--------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------------------
  const olSourceRasterOperation = (pixels) => {
    if (pixels[1][3] === 0) {
      return pixels[0];
    } else {
      return [0, 0, 0, 0];
    }
  };

  const idw = new ol_source_IDW({
    source: new VectorSource(),
    // scale: 1,
    // Use val as weight property
    weight: 'elevation',
  });

  let idwImageLayer = new ImageLayer({
    extent: meterBounds,
    title: 'Water level warning layer',
    source: idw,
    opacity: 0.5,
    visible: false,
  });

  let idwLabelVetor = new VectorLayer({
    extent: meterBounds,
    title: 'Water level warning label',
    source: idw.getSource(),
    style: function (f) {
      return new Style({
        // image: new ol.style.Circle({ radius: 2, fill: new ol.style.Fill({ color: '#000' }) }),
        text: new Text({
          text: ((f.get('elevation') * 2) / 100).toString(),
          stroke: new Stroke({
            color: [255, 255, 255, 128],
            width: 1.25,
          }),
        }),
      });
    },
  });

  map.addLayer(idwImageLayer);
  map.addLayer(idwLabelVetor);

  const tamKyBuildingLayer1 = new ImageLayer({
    title: 'Tam kỳ building layer',
    source: new ImageWMSSource({
      ratio: 1,
      url: 'http://localhost:8080/geoserver/webgis_dev/wms',
      params: {
        FORMAT: format,
        VERSION: '1.1.1',
        LAYERS: 'webgis_dev:tam-ky_building',
        STYLES: 'style_tam-ky_building',
      },
      crossOrigin: 'anonymous',
      wrapX: false,
      serverType: 'geoserver',
    }),
    visible: false,
  });

  const tamKyBuildingLayer = new VectorLayer({
    title: 'Tam kỳ building layer',
    renderMode: 'image',
    // preview: 'F:/Programming project/Personal/web-gis-dev/front-end/src/assets/luffy-chilling-gear5-round.png',
    source: new VectorSource({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Atam-ky_building&outputFormat=application%2Fjson',
      format: new GeoJSON(),
    }),
    // style: new Style({
    //   stroke: new Stroke({
    //     color: 'white',
    //     width: 1,
    //   }),
    //   fill: new Fill({
    //     color: '#1ca9c9',
    //   }),
    // }),
  });
  // setTimeout(() => {
  // console.log(tamKyBuildingLayer.getSource().getFeatures());
  // }, 10000);
  // tamKyBuildingLayer.getSource().on('featuresloadend', () => {
  //   tamKyBuildingLayer.getSource().getFeatures();
  // });

  map.addLayer(tamKyBuildingLayer1);

  // var geojsonFormat = new GeoJSON();
  // var features = geojsonFormat.readFeatures(featureCollection);
};

export default runMap;
