<template>
  <div class="chart-container" :style="{ height, width }" ref="chartContainer"></div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, watchEffect} from 'vue';
import echarts from 'echarts';
import 'echarts/map/js/china.js'
import china from 'echarts/map/json/china.json'

const props = defineProps({
  chartOptions: {
    type: Object,
    default() {
      return {};
    },
  },
  mapCityOption: {
    type: Object,
    default() {
      return {};
    },
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '300px',
  },
})
const chartContainer = ref(null);
let chartInstance = null;
watch(
    props.chartOptions,
    () => {
      setOptions(props.chartOptions);
    },
    {
      deep: true
    }
);
const setOptions = (options) => {
  chartInstance.setOption(options);
}
onMounted(() => {
  chartInstance = echarts.init(chartContainer.value);
  if (Object.keys(props.mapCityOption).length > 0) {
    echarts.registerMap(props.mapCityOption.name || 'china', props.mapCityOption.geoData || china);
  }
  chartInstance.setOption(props.chartOptions);
  handleResize(); // 设置初始大小
  window.addEventListener('resize', handleResize);
});

watchEffect(() => {
  if (chartInstance && props.chartOptions) {
    chartInstance.setOption(props.chartOptions);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});

function handleResize() {
  const width = chartContainer.value.offsetWidth;
  const height = chartContainer.value.offsetHeight;
  chartInstance.resize({width, height});
}

</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
