const runMap = (map) => {
  // var map;
  var format = 'image/png';
  var degreeBounds = [108.66931915300006, 11.769107818000062, 109.46916961700003, 12.86867141600004];
  const meterBounds = [576281.1063905563, 1720086.1249637157, 580872.2309828001, 1724335.9856269273];
  const maxMeterBounds = [556421, 1702209, 604820, 1739026];
  // var TKmeterBounds = [548539.1168823242187500, 1719723.5018920898437500, 554086.7171020507812500, 1724261.0479125976562500];

  // ---------------------------------
  // ----------Map Layer--------------
  // ---------------------------------

  var baseLayerGroup = new ol.layer.Group({
    title: 'Base layers',
    // openInLayerSwitcher: true,
    layers: [
      new ol.layer.Tile({
        title: 'Google Map',
        baseLayer: true,
        preload: Infinity,
        type: 'base',
        visible: true,
        source: new ol.source.XYZ({
          url: 'https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga',
          crossOrigin: 'anonymous',
        }),
      }),
      new ol.layer.Tile({
        preload: Infinity,
        title: 'Water Color',
        baseLayer: true,
        visible: false,
        source: new ol.source.Stamen({ layer: 'watercolor', attributions: [], attributionsCollapsible: false }),
      }),
      new ol.layer.Tile({
        preload: Infinity,
        title: 'Toner',
        baseLayer: true,
        visible: false,
        source: new ol.source.Stamen({ layer: 'toner', attributions: [], attributionsCollapsible: false }),
      }),
      new ol.layer.Tile({
        preload: Infinity,
        baseLayer: true,
        source: new ol.source.OSM({
          attributions: [],
          attributionsCollapsible: false,
        }),
        visible: false,
        title: 'Open Street Map',
      }),
      new ol.layer.Tile({
        baseLayer: true,
        visible: true,
        title: 'No Basemap',
      }),
    ],
  });

  const congNgamLayer = new ol.layer.Vector({
    title: 'Cống ngầm',
    source: new ol.source.Vector({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3ACongNgam&outputFormat=application%2Fjson',
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'hotpink',
        width: 2,
      }),
    }),
  });
  const kenhLayer = new ol.layer.Vector({
    title: 'Kênh',
    source: new ol.source.Vector({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3AKenh&outputFormat=application%2Fjson',
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#00ab5b',
        // lineDash: [10, 10],
        width: 2,
      }),
    }),
  });

  const hoGaLayer = new ol.layer.Vector({
    title: 'Hố ga',
    source: new ol.source.Vector({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3AHoGa&outputFormat=application%2Fjson',
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: 'grey',
        }),
        stroke: new ol.style.Stroke({
          color: 'white',
          width: 1,
        }),
      }),
    }),
  });
  const cuaXaLayer = new ol.layer.Vector({
    title: 'Cửa xả',
    source: new ol.source.Vector({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3ACuaXa&outputFormat=application%2Fjson',
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: '#ffa500',
        }),
        stroke: new ol.style.Stroke({
          color: 'white',
          width: 1,
        }),
      }),
    }),
  });
  const congNganTrieuLayer = new ol.layer.Vector({
    title: 'Cống ngăn triều',
    source: new ol.source.Vector({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3Acntrieu&outputFormat=application%2Fjson',
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: '#35177a',
        }),
        stroke: new ol.style.Stroke({
          color: 'white',
          width: 1,
        }),
      }),
    }),
  });

  const hoDieuHoaLayer = new ol.layer.Vector({
    title: 'Hồ điều hoà',
    preview: '/src/assets/luffy-chilling-gear5-round.png',
    // preview: 'F:/Programming project/Personal/web-gis-dev/front-end/src/assets/luffy-chilling-gear5-round.png',
    source: new ol.source.Vector({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3AHoDieuHoa&outputFormat=application%2Fjson',
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'white',
        width: 1,
      }),
      fill: new ol.style.Fill({
        color: '#1ca9c9',
      }),
    }),
  });

  const tramDoMuaLayer = new ol.layer.Vector({
    title: 'Trạm đo mưa',
    // preview: 'F:/Programming project/Personal/web-gis-dev/front-end/src/assets/luffy-chilling-gear5-round.png',
    source: new ol.source.Vector({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3ATramDoMua&outputFormat=application%2Fjson',
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        // anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: '../src/assets/icon/broadcast.png',
      }),
      stroke: new ol.style.Stroke({
        color: 'white',
        width: 1,
      }),
    }),
  });

  var mainLayerGroup = new ol.layer.Group({
    title: 'Main layers',
    layers: [congNgamLayer, kenhLayer, hoGaLayer, cuaXaLayer, hoDieuHoaLayer, congNganTrieuLayer, tramDoMuaLayer],
  });
  map.addLayer(baseLayerGroup);
  map.addLayer(mainLayerGroup);
  map.getView().fit(meterBounds, map.getSize());

  var hover = new ol.interaction.Hover({ cursor: 'pointer' });
  map.addInteraction(hover);

  // Define a new legend
  var legend = new ol.legend.Legend({
    title: 'Legend',
    margin: 5,
    maxWidth: 300,
  });
  var legendCtrl = new ol.control.Legend({
    legend: legend,
    collapsed: false,
  });
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
    MultiLineString: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 4,
      }),
    }),
    LineString: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 4,
      }),
    }),
    Point: new ol.style.Style({
      image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
          color: 'pink',
        }),
        stroke: new ol.style.Stroke({
          color: 'white',
          width: 1,
        }),
      }),
    }),
    MultiPolygon: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 2,
      }),
      fill: new ol.style.Fill({
        color: 'rgba(243, 138, 138, 0.5)',
      }),
    }),
    Polygon: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 3,
      }),
      fill: new ol.style.Fill({
        color: 'rgba(243, 138, 138, 0.5)',
      }),
    }),
    Circle: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'cyan',
        width: 1,
      }),
      fill: new ol.style.Fill({
        color: 'rgba(243, 138, 138, 0.5)',
      }),
    }),
  };

  const vectorSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
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
              var feature1 = new ol.Feature({
                geometry: new ol.geom.Point([item['ToadoX'], item['ToadoY']]),
              });
              polygonArray.push([item['ToadoX'], item['ToadoY']]);
              // vectorSource.addFeature(feature1);
              success(feature1);
            });
            var polygon = new ol.geom.Polygon([polygonArray]);
            var polygonFeature = new ol.Feature(polygon);
            // vectorSource.addFeature(polygonFeature);

            for (var i = 0; i < data.length - 1; i++) {
              var feature2 = new ol.Feature({
                geometry: new ol.geom.LineString([
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
  const vectorLayer = new ol.layer.Vector({
    // Layer này dùng để test vẽ các object từ file excel
    title: 'Test Layer',
    source: vectorSource,
    style: stylePopupFunction,
  });
  map.addLayer(vectorLayer);
  // console.log(map.getView().getProjection().getCode());
  const testData = {
    testa: 'anhquyendeptraivcl',
    testb: 'admin',
  };

  const searchLayer = new ol.layer.Vector({
    title: 'Search layer',
    source: new ol.source.Vector(),
    style: stylePopupFunction,
  });
  map.addLayer(searchLayer);

  const routingPointLayer = new ol.layer.Vector({
    title: 'Start and destination points',
    source: new ol.source.Vector(),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        color: 'rgba(255, 0, 0, 0)',
        crossOrigin: 'anonymous',
        src: '../src/assets/icon/location-sign.png',
        scale: 0.4,
      }),
    }),
  });
  map.addLayer(routingPointLayer);

  // const routeLayer = new ol.layer.Image({
  //   title: 'Route layer',
  //   source: new ol.source.ImageWMS(),
  // });
  // map.addLayer(routeLayer);

  const roadsLayer = new ol.layer.Vector({
    title: 'Roads layer',
    source: new ol.source.Vector({
      url: 'http://localhost:8080/geoserver/webgis_dev/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=webgis_dev%3ATamKy_roads_EPSG5899_explode&outputFormat=application%2Fjson',
      format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
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

  const measureVector = new ol.layer.Vector({
    title: 'Measure layer',
    // source: measureSource,
    // style: function (feature) {
    //   return measureStyleFunction(feature, true);
    // },
  });
  // map.addInteraction(measureModify);
  map.addLayer(measureVector);
};

export default runMap;
