<template>
  <div>
    <a-popover>
      <template #content> Water level warning </template>
      <a-switch v-model:checked="checked" checked-children="ON" un-checked-children="OFF" @change="change()" />
      <!-- <a-input size="small" style="width: 30%"></a-input> -->
    </a-popover>
    <!-- <a-input size="small" style="width: 50%"></a-input> -->
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, inject } from 'vue';
import { mapState } from '../../stores/map-state';
import VectorSource from 'ol/source/Vector';
import { Image as ImageLayer, Vector as VectorLayer } from 'ol/layer.js';
import { Draw } from 'ol/interaction';
import { Style, Text, Stroke } from 'ol/style';
import * as VueLayer from '../../js/VueLayer';

// import VectorLayer from 'ol/layer/Vector';

export default defineComponent({
  setup() {
    // làm sao để hết lag con trỏ khi vẽ (cái này draw nào cũng bị)
    // khai báo source ở đây hay ở map.js thì cũng lag như nhau
    // có thể do khai báo map ở chỗ khác -- không phải do cái này
    // Tắt cái label theo con chuột khi vẽ lên?
    const checked = ref(false);
    // console.log(VueLayer.getLayerByTitle(mapState().getMap, 'Water level warning layer'));
    const idwSource = VueLayer.getLayerByTitle(mapState().getMap, 'Water level warning layer').getSource().getSource();
    let draw = new Draw({
      type: 'Point',
      source: idwSource,
      // source: idw.getSource(),
    });

    draw.on('drawend', function (e) {
      let randomValue = Math.round(Math.random() * 100);
      e.feature.set('elevation', randomValue);
      // e.feature.set('val', 5);
      // console.log(idw.getColor(randomValue));
      // console.log(e.feature);
      // console.log(e.feature.get('elevation'));
      // console.log(idw.getColor(parseInt($('#value').val())));
      // console.log(idw.getSource());
      // if ($('#random').prop('checked')) $('#value').val(Math.round(Math.random() * 100));
    });
    mapState().getMap.addInteraction(draw);
    draw.setActive(false);
    return {
      checked,
      // idwImageLayer,
      // idwLabelVetor,
      draw,
    };
  },

  data() {
    return {};
  },

  computed: {
    map() {
      return mapState().getMap;
    },
  },

  methods: {
    testVal() {},

    change() {
      // console.log(VueLayer.getLayerByTitle(this.map, 'Tam kỳ building layer').getSource().getFeatures());
      if (this.checked) {
        // console.log(this.draw);
        this.draw.setActive(true);
        // this.map.addInteraction(this.draw);
        VueLayer.getLayerByTitle(this.map, 'Water level warning layer').setVisible(true);
        VueLayer.getLayerByTitle(this.map, 'Water level warning label').setVisible(true);
        VueLayer.getLayerByTitle(this.map, 'Tam kỳ building layer').setVisible(true);
        // this.idwImageLayer.setVisible(true);
        // this.idwLabelVetor.setVisible(true);
      } else {
        // console.log('remove');
        this.draw.setActive(false);
        VueLayer.getLayerByTitle(this.map, 'Water level warning layer').setVisible(false);
        VueLayer.getLayerByTitle(this.map, 'Water level warning label').setVisible(false);
        VueLayer.getLayerByTitle(this.map, 'Tam kỳ building layer').setVisible(false);
        // console.log(this.map.getInteractions().removeAt(11));
        // console.log(this.map.removeInteraction(this.draw));

        // this.idwImageLayer.setVisible(false);
        // this.idwLabelVetor.setVisible(false);
      }
    },
  },

  mounted() {},
});
</script>

<style lang="scss" scoped></style>
