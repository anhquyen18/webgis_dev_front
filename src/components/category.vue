<template>
  <a-button shape="circle" size="large" @click="danhMucShower()">
    <i class="fa-solid fa-bars"></i>
  </a-button>

  <a-drawer
    title="Danh mục"
    size="large"
    placement="left"
    :closable="false"
    :open="danhMucVisible"
    @close="danhMucOnClose">
    <a-collapse class="fs-5" v-model:activeKey="activeKey" :bordered="false">
      <a-collapse-panel key="1" header="Bộ chỉ số">
        <p class="fs-6">{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="Loại hình cung cấp nước">
        <p class="fs-6">{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="Nguồn cung cấp nước">
        <p class="fs-6">{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="4" header="Công trình và phạm vi cung cấp nước">
        <p class="fs-6">{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="5" header="Đối tượng sử dụng">
        <p class="fs-6">{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="6" header="Đơn vị hành chính">
        <p class="fs-6">{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
  </a-drawer>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { mapState } from '../stores/map-state';

export default defineComponent({
  setup() {
    const danhMucVisible = ref(false);
    const danhMucShower = () => {
      console.log(mapState().getMap);
      danhMucVisible.value = true;
    };
    const danhMucOnClose = () => {
      danhMucVisible.value = false;
    };
    const activeKey = ref(['1']);
    const text = `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`;

    return {
      danhMucVisible,
      danhMucShower,
      danhMucOnClose,
      activeKey,
      text,
    };
  },
  computed: {
    map() {
      const mapStore = mapState();
      const { getMap, setMap } = mapStore;
      // console.log(mapState.getMap);
      return mapState().getMap;
    },
  },
  methods: {
    testSomethings() {
      // console.log(this.map);
    },
  },
  mounted() {
    // const mapStore = mapState();
    // const { getMap, setMap } = mapStore;
    // console.log(mapState().getMap);
  },
});
</script>
