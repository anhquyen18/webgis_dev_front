<template>
  <a-button type="primary" shape="round" @click="addMeasureTool"><i class="fa-solid fa-ruler"></i></a-button>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue';
import { mapState } from '../../stores/map-state';

export default defineComponent({
  components: {},
  setup() {
    return {};
  },

  computed: {
    map() {
      return mapState().getMap;
    },
  },

  data() {
    return {
      measureSource: new ol.source.Vector(),

      measureStyle: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(38, 111, 247, 0.8)',
          lineDash: [10, 10],
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
          fill: new ol.style.Fill({
            color: 'rgba(38, 111, 247, 0.5)',
          }),
        }),
      }),

      measureLabelStyle: new ol.style.Style({
        text: new ol.style.Text({
          font: '14px Calibri,sans-serif',
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 1)',
          }),
          backgroundFill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
          padding: [3, 3, 3, 3],
          textBaseline: 'bottom',
          offsetY: -15,
        }),
        image: new ol.style.RegularShape({
          radius: 8,
          points: 3,
          angle: Math.PI,
          displacement: [0, 10],
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
        }),
      }),

      measureTipStyle: new ol.style.Style({
        text: new ol.style.Text({
          font: '12px Calibri,sans-serif',
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 1)',
          }),
          backgroundFill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0.4)',
          }),
          padding: [2, 2, 2, 2],
          textAlign: 'left',
          offsetX: 15,
        }),
      }),

      measureModifyStyle: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0.4)',
            color: 'rgba(38, 111, 247, 0.8)',
          }),
        }),
        text: new ol.style.Text({
          text: 'Kéo để tùy chỉnh',
          font: '12px Calibri,sans-serif',
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 1)',
          }),
          backgroundFill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
          padding: [2, 2, 2, 2],
          textAlign: 'left',
          offsetX: 15,
        }),
      }),

      measureSegmentStyle: new ol.style.Style({
        text: new ol.style.Text({
          font: '12px Calibri,sans-serif',
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 1)',
          }),
          backgroundFill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0.4)',
          }),
          padding: [2, 2, 2, 2],
          textBaseline: 'bottom',
          offsetY: -12,
        }),
        image: new ol.style.RegularShape({
          radius: 6,
          points: 3,
          angle: Math.PI,
          displacement: [0, 8],
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0.4)',
          }),
        }),
      }),

      tipPoint: null,
      measureModify: new ol.interaction.Modify({
        source: new ol.source.Vector(),
      }),
      drawMeasure: null,
      // measureModify: null,
    };
  },
  // props: {
  //   measureType: String,
  //   measureStatus: String,
  // },

  mounted() {},

  methods: {
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

    measureFormatLength(line) {
      const length = ol.sphere.getLength(line);
      let output;

      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' km';
      } else {
        output = Math.round(length * 100) / 100 + ' m';
      }
      return output;
    },

    measureFormatArea(polygon) {
      const area = ol.sphere.getArea(polygon);
      // const perimeter = ol.sphere.getLength(polygon);
      let output;
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2';
      } else {
        output = Math.round(area * 100) / 100 + ' m\xB2';
      }
      return output;
    },

    measureStyleFunction(feature, segments, drawType, tip) {
      const styles = [this.measureStyle];
      const geometry = feature.getGeometry();
      const type = geometry.getType();
      const measureSegmentStyles = [this.measureSegmentStyle];

      let point, label, line;
      if (!drawType || drawType === type) {
        if (type === 'Polygon') {
          point = geometry.getInteriorPoint();
          label = this.measureFormatArea(geometry);
          line = new ol.geom.LineString(geometry.getCoordinates()[0]);
        } else if (type === 'LineString') {
          point = new ol.geom.Point(geometry.getLastCoordinate());
          label = this.measureFormatLength(geometry);
          line = geometry;
        }
      }
      if (segments && line) {
        let count = 0;
        let that = this;
        line.forEachSegment(function (a, b) {
          const segment = new ol.geom.LineString([a, b]);
          const label = that.measureFormatLength(segment);
          if (measureSegmentStyles.length - 1 < count) {
            measureSegmentStyles.push(that.measureSegmentStyle.clone());
          }
          const segmentPoint = new ol.geom.Point(segment.getCoordinateAt(0.5));
          measureSegmentStyles[count].setGeometry(segmentPoint);
          measureSegmentStyles[count].getText().setText(label);
          styles.push(measureSegmentStyles[count]);
          count++;
        });
      }
      if (label) {
        this.measureLabelStyle.setGeometry(point);
        this.measureLabelStyle.getText().setText(label);
        styles.push(this.measureLabelStyle);
      }
      if (tip && type === 'Point' && !this.measureModify.getOverlay().getSource().getFeatures().length) {
        this.tipPoint = geometry;
        this.measureTipStyle.getText().setText(tip);
        styles.push(this.measureTipStyle);
      }
      return styles;
    },

    getMeasureStyle(feature) {
      return this.measureStyleFunction(feature, true);
    },

    measureAddInteraction(measureType) {
      // var typeSelected = this.measureType;
      // console.log(typeSelected);
      const activeTip = 'Nhấn chuột trái để tiếp tục đo ' + (measureType === 'Polygon' ? 'diện tích' : 'khoảng cách');
      const idleTip = 'Nhấn chuột trái để bắt đầu đo';
      let tip = idleTip;
      let that = this;
      this.drawMeasure = new ol.interaction.Draw({
        source: that.measureSource,
        type: measureType,
        style: function (feature) {
          return that.measureStyleFunction(feature, true, measureType, tip);
        },
      });
      this.drawMeasure.on('drawstart', function () {
        that.measureModify.setActive(false);
        tip = activeTip;
      });
      this.drawMeasure.on('drawend', function () {
        that.measureModify.setActive(true);
        that.map.once('pointermove', function () {
          that.measureModifyStyle.setGeometry();
        });
        tip = idleTip;
      });
      this.measureModify.setActive(true);
      this.map.addInteraction(this.drawMeasure);
    },

    addMeasureTool() {
      if (this.drawMeasure) {
        return;
      }
      this.getLayerByTitle('Measure layer').setSource(this.measureSource);
      this.getLayerByTitle('Measure layer').setStyle(this.getMeasureStyle);
      this.measureModify = new ol.interaction.Modify({
        source: this.measureSource,
        style: this.measureModifyStyle,
      });
      this.map.addInteraction(this.measureModify);

      this.measureAddInteraction('LineString');
      this.$emit('start-measure', true);
      // this.map.removeInteraction(this.drawMeasure);
    },

    clearMeasureTool() {
      this.measureSource.clear();
      this.measureModify.setActive(false);
    },

    stopMeasure() {
      this.measureSource.clear();
      this.map.removeInteraction(this.drawMeasure);
      this.measureModify.setActive(false);
    },

    measureTypeChange(measureType) {
      this.map.removeInteraction(this.drawMeasure);
      this.measureAddInteraction(measureType);
    },

    measureStatusChange(status) {
      if (status === 'inactive') {
        this.map.removeInteraction(this.drawMeasure);
      } else {
        this.map.addInteraction(this.drawMeasure);
      }
    },
  },

  // đem biến measure từ map.js qua hết đây
});
</script>

<style scoped lang="scss"></style>
