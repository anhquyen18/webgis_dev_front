<template>
  <a-button size="large" shape="circle" @click="danhMucShower()">
    <i class="fa-solid fa-bars"></i>
  </a-button>

  <a-drawer
    title="Danh mục"
    size="large"
    placement="left"
    :open="danhMucVisible"
    @close="danhMucOnClose"
    :bodyStyle="{ maxWidth: '100vw' }">
    <a-collapse v-model:activeKey="activeKey" :bordered="false">
      <a-collapse-panel key="1">
        <template #header>
          <p class="fw-bold">Bộ chỉ số</p>
        </template>
        <p class="fs-6">{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="2">
        <template #header>
          <p class="fw-bold">Loại hình cung cấp nước</p>
        </template>
        <p class="fs-6">{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="3">
        <template #header>
          <p class="fw-bold">Nguồn cung cấp nước</p>
        </template>
        <p class="fs-6">{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="4">
        <template #header>
          <p class="fw-bold">Công trình và phạm vi cung cấp nước</p>
        </template>
        <p class="fs-6">{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="5">
        <template #header>
          <p class="fw-bold">Đối tượng sử dụng</p>
        </template>
        <p class="fs-6">{{ text }}</p>
      </a-collapse-panel>
      <a-collapse-panel key="6">
        <template #header>
          <p class="fw-bold">Đơn vị hành chính</p>
        </template>
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
