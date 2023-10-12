<template>
  <div>
    <a-button type="primary" shape="round" @click="showConvertCrsModal">
      <template #icon>
        <i class="fa-solid fa-globe text-white"></i>
      </template>
    </a-button>
    <a-modal
      :open="visible"
      title="Chuyển đổi hệ toạ độ (CRS)"
      :closable="false"
      :zIndex="1000"
      @ok="modalOk"
      @cancel="modalCancel">
      <a-form layout="horizontal">
        <div class="row">
          <a-form-item name="area" label="Hệ toạ độ hiện tại">
            <a-select style="width: 100%" :filter-option="filterOption" show-search @change="oldSelectChange">
              <a-select-option v-for="option in crsList" :key="option.code" :value="option.name" :proj4="option.proj4">
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div class="row">
          <div class="col-6">
            <a-form-item :label="oldFirstNameOfCoordinate">
              <a-input type="number" v-model:value="oldFirstValueOfCoordinate" placeholder="" />
            </a-form-item>
          </div>
          <div class="col-6">
            <a-form-item :label="oldSecondNameOfCoordinate">
              <a-input v-model:value="oldSecondValueOfCoordinate" placeholder="" />
            </a-form-item>
          </div>
        </div>
        <div class="row mt-4">
          <a-form-item name="area" label="Hệ toạ độ chuyển đổi">
            <a-select style="width: 100%" :filter-option="filterOption" show-search @change="newSelectChange">
              <a-select-option v-for="option in crsList" :key="option.code" :value="option.name" :proj4="option.proj4">
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div class="row mb-2">
          <div class="col-6">
            <a-form-item :label="newFirstNameOfCoordinate">
              <a-input v-model:value="newFirstValueOfCoordinate" placeholder="" disabled />
            </a-form-item>
          </div>
          <div class="col-6">
            <a-form-item :label="newSecondNameOfCoordinate">
              <a-input v-model:value="newSecondValueOfCoordinate" placeholder="" disabled />
            </a-form-item>
          </div>
        </div>
        <a-form-item>
          <a-button type="primary" @click="transform">Chuyển đổi</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue';

export default defineComponent({
  components: {},
  setup() {
    const visible = ref(false);
    const showConvertCrsModal = () => {
      visible.value = true;
    };

    const modalOk = () => {
      visible.value = false;
    };

    const modalCancel = () => {
      visible.value = false;
    };

    const data = reactive({
      newFirstNameOfCoordinate: 'X',
      newSecondNameOfCoordinate: 'Y',
      oldFirstNameOfCoordinate: 'X',
      oldSecondNameOfCoordinate: 'Y',

      oldFirstValueOfCoordinate: null,
      oldSecondValueOfCoordinate: null,
      newFirstValueOfCoordinate: null,
      newSecondValueOfCoordinate: null,
    });

    let oldCrs = {
      code: '',
      proj4: '',
    };
    let newCrs = {
      code: '',
      proj4: '',
    };

    let crsList = ref();

    const getCrsList = () => {
      axios
        .get('http://127.0.0.1:8000/api/getcrs')
        .then(function (response) {
          crsList.value = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    getCrsList();

    const filterOption = (input, crs) => {
      let searchData = `${crs.value} (${crs.key})`;
      return searchData.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    };

    const oldSelectChange = (value, crs) => {
      if (crs.proj4.includes('longlat')) {
        data.oldFirstNameOfCoordinate = 'Longitude';
        data.oldSecondNameOfCoordinate = 'Latitude';
      } else if (crs.proj4.includes('tmerc') || crs.proj4.includes('utm')) {
        data.oldFirstNameOfCoordinate = 'X';
        data.oldSecondNameOfCoordinate = 'Y';
      }
      oldCrs.code = crs.key;
      oldCrs.proj4 = crs.proj4;
    };
    const newSelectChange = (value, crs) => {
      if (crs.proj4.includes('longlat')) {
        data.newFirstNameOfCoordinate = 'Longitude';
        data.newSecondNameOfCoordinate = 'Latitude';
      } else if (crs.proj4.includes('tmerc') || crs.proj4.includes('utm')) {
        data.newFirstNameOfCoordinate = 'X';
        data.newSecondNameOfCoordinate = 'Y';
      }
      newCrs.code = crs.key;
      newCrs.proj4 = crs.proj4;
    };

    const transform = () => {
      if (oldCrs && newCrs && data.oldFirstValueOfCoordinate && data.oldSecondValueOfCoordinate) {
        var oldCoordinate = [Number(data.oldFirstValueOfCoordinate), Number(data.oldSecondValueOfCoordinate)];
        proj4.defs(oldCrs.code, oldCrs.proj4);
        proj4.defs(newCrs.code, newCrs.proj4);
        ol.proj.proj4.register(proj4);

        var newCoordinate = ol.proj.transform(oldCoordinate, oldCrs.code, newCrs.code);
        data.newFirstValueOfCoordinate = newCoordinate[0];
        data.newSecondValueOfCoordinate = newCoordinate[1];
      }
    };
    return {
      visible,
      showConvertCrsModal,
      modalOk,
      modalCancel,
      data,
      filterOption,
      crsList,
      ...toRefs(data),
      oldSelectChange,
      newSelectChange,
      transform,
    };
  },

  methods: {},

  computed: {},

  data() {
    return {};
  },

  mounted() {},

  methods: {},
});
</script>

<style scoped lang="scss"></style>
