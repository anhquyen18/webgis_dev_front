<template>
  <div>
    <!-- <a-button type="primary" shape="round" @click="chartShower">
      <i class="fa-solid fa-cloud-rain"></i>
    </a-button> -->
    <a-button type="dashed" size="small" @click="chartShower">Biểu đồ</a-button>

    <a-drawer
      :style="{ position: 'relative', width: '100%', height: '100%' }"
      placement="bottom"
      :closable="false"
      :open="chartVisible"
      @close="chartOnClose"
      @after-open-change="afterVisibleChange">
      <!-- <template #title>
        <div dflext>anhquyendeptraivcl</div>
      </template> -->
      <div class="w-100 h-100">
        <canvas id="my-chart" width="100%" height="100%"></canvas>
      </div>
      <div style="position: absolute; top: 0.5rem; left: 6rem; width: 160px">
        <a-range-picker
          v-model:value="datePicked"
          picker="month"
          placement="topLeft"
          size="small"
          :bordered="false"
          :format="dateFormat"
          :valueFormat="dateFormat"
          :placeholder="datePlaceholder"
          :disabled-date="disabledDate"
          @openChange="datePickerOpenChange">
          <template #renderExtraFooter>extra footer</template>
        </a-range-picker>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { mapState } from '../../stores/map-state';

export default defineComponent({
  setup() {
    const chartVisible = ref(false);

    const chartOnClose = () => {
      chartVisible.value = false;
    };
    chartVisible.value = true;
    chartVisible.value = false;

    return {
      chartVisible,
      chartOnClose,
    };
  },
  computed: {
    map() {
      return mapState().getMap;
    },
  },
  data() {
    return {
      testData: [
        { month: 'Tháng 1', year: 2023, temp: 31, rainfall: 62 },
        { month: 'Tháng 2', year: 2023, temp: 33, rainfall: 29 },
        { month: 'Tháng 3', year: 2023, temp: 29, rainfall: 32 },
        { month: 'Tháng 4', year: 2023, temp: 33, rainfall: 58 },
        { month: 'Tháng 5', year: 2023, temp: 32, rainfall: 69 },
        { month: 'Tháng 6', year: 2023, temp: 36, rainfall: 52 },
        { month: 'Tháng 7', year: 2023, temp: 37, rainfall: 77 },
        { month: 'Tháng 8', year: 2023, temp: 36, rainfall: 88 },
        { month: 'Tháng 9', year: 2023, temp: 32, rainfall: 106 },
        { month: 'Tháng 10', year: 2023, temp: 29, rainfall: 96 },
        { month: 'Tháng 11', year: 2023, temp: 27, rainfall: 120 },
        { month: 'Tháng 12', year: 2023, temp: 26, rainfall: 115 },
      ],
      datePickerVisible: true,
      stationData: [],
      chartData: [],
      dataNumber: 12,
      rainfallChart: '',
      chartOptions: {
        responsive: true,
        layout: {
          padding: 0,
        },
        plugins: {
          title: {
            display: true,
            text: 'Biểu đồ lượng mưa',
            position: 'left',
            padding: 5,
            color: '#4494F1',
            font: { weight: 'bold', size: '16' },
          },
        },
        stacked: false,
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',

            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
        },
        // responsive: true,
      },
      datePicked: [],
      dateFormat: 'M-YYYY',
      datePlaceholder: ['Tháng', 'Tháng'],
    };
  },
  methods: {
    afterVisibleChange() {
      // console.log(this.chartVisible);
    },

    chartShower() {
      this.chartVisible = true;
      let that = this;
      if (!this.rainfallChart) {
        setTimeout(function () {
          that.renderChart();
        }, 0);
        // this.renderChart();
      }

      // }
    },

    renderChart() {
      const ctx = document.getElementById('my-chart').getContext('2d');

      axios
        .post('http://127.0.0.1:8000/api/get-measuring-data', this.stationData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          if (response) {
            // router.push({ name: 'home-page' });
            // console.log(response.data);
            this.stationData = response.data;
            this.chartData = this.stationData.slice(-this.dataNumber);
            this.rainfallChart = new Chart(ctx, {
              type: 'bar',
              options: this.chartOptions,
              data: {
                labels: this.chartData.map((row) => row.month + '-' + row.year),
                datasets: [
                  {
                    label: 'Lượng mưa (mm)',
                    data: this.chartData.map((row) => row.rainfall),
                    stack: 'combined',
                    type: 'bar',
                    borderWidth: 2,
                    yAxisID: 'y',
                  },
                  {
                    label: 'Nhiệt độ (ºC)',
                    data: this.chartData.map((row) => row.temp),
                    stack: 'combined',
                    type: 'line',
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4,
                    yAxisID: 'y1',
                  },
                ],
              },
            });
          }
        })
        .catch((error) => {
          // signInVisible.value = true;
          console.log(error);
        });
    },

    datePickedChange() {
      // console.log(this.datePicked);
      // console.log(this.datePicked[0].month());
      // console.log(dayjs().endOf('day'));
      // console.log(dayjs('2023-4'));
      console.log(this.rainfallChart.data);
      // Đếm số lượng tháng trong dataPicked
      // Tìm kiếm trong mảng thấy đúng tháng đầu tiên rồi cộng theo số lượng tháng
    },

    datePickerOpenChange(status) {
      this.chartData = this.testData;
      // console.log(status);
      // let that = this;
      if (status === false) {
        // this.chartData = '';
        // console.log(this.rainfallChart);
        // console.log(this.rainfallChart.data.datasets[0].data);
        this.rainfallChart.data.labels = this.chartData.map((row) => row.month + '-' + row.year);
        this.rainfallChart.data.datasets[0].data = this.chartData.map((row) => row.rainfall);
        this.rainfallChart.data.datasets[1].data = this.chartData.map((row) => row.temp);
        console.log(this.rainfallChart.data);
        this.rainfallChart.update();
      }
      // let oldData;
      // if (status === true) oldData = this.chartData;

      // if (status === false && oldData != this.chartData) {
      // }
    },

    disabledDate(current) {
      return (
        current < dayjs(`${this.stationData[0].year}-${this.stationData[0].month}`) ||
        current >
          dayjs(
            `${this.stationData[this.stationData.length - 1].year}-${
              this.stationData[this.stationData.length - 1].month
            }`
          ).add(1, 'month')
      );
    },
  },

  mounted() {
    const ctx = document.getElementById('my-chart');
  },
});
</script>
