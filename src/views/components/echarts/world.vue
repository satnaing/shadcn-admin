<script setup>
import world from 'echarts/map/json/world.json'
import setting from '@/setting.js'
import {adjustColorOpacity} from '@/utils/util.common.js'

const state = reactive({
  mapCityOption: {
    name: 'world',
    geoData: world
  },
  chartOptions: {
    title: {
      text: "世界地图",
      top: "10px",
      left: "center",
      textStyle: {
        color: setting.theme.color,
      },
    },
    visualMap: [
      {
        min: 10,
        max: 1000,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        calculable: false,
        orient: 'horizontal',
        inRange: {
          color: [adjustColorOpacity(setting.theme.color, 20), setting.theme.color],
          symbolSize: [30, 100],
        },
      },
    ],
    geo: {
      map: 'world',
      show: false,
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, .6)',
      textStyle: {
        color: '#fff',
        fontSize: 12,
      },
    },
    series: [
      {
        type: 'map',
        map: 'world',
        label: {
          show: false,
          color: '#a7a7a7',
          fontSize: 13,
        },
        itemStyle: {
          areaColor: adjustColorOpacity(setting.theme.color, 10),
          borderColor: adjustColorOpacity(setting.theme.color, 80),
          emphasis: {
            areaColor: setting.theme.color,
          }
        },
        data: [],
      },
      // 添加标记点的series
      {
        type: 'effectScatter', // 可以使用scatter或effectScatter
        coordinateSystem: 'geo',
        data: [
          {
            name: '🧭贵州·贵阳',
            symbol: 'circle', // 标记点的图形样式，可以是圆圈：'circle'、气泡：'pin'、方块：'rect'等
            value: [106.628201, 25.646694], // 数值可以影响标记点大小，例如 [经度, 纬度, 100]
          }
          // 可以添加多个标记点
        ],
        rippleEffect: {
          brushType: 'stroke'
        },
        symbolSize: function (val) {
          return 10; // 设置标记点的大小为10
        },
        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: 'yellow',
            shadowBlur: 20,
            shadowColor: 'yellow'
          }
        },
        label: {
          show: true,
          color: setting.theme.color,
          distance: 16,
          fontSize: 15,
          fontWeight: 600,
          position: 'top',
          formatter: '{b}',
        },
      }
    ],
  },


})
const countries = [
  'China', 'United States', 'India', 'Indonesia', 'Pakistan', 'Brazil', 'Nigeria', 'Bangladesh', 'Russia', 'Mexico',
  'Japan', 'Ethiopia', 'Philippines', 'Egypt', 'Vietnam', 'DR Congo', 'Turkey', 'Iran', 'Germany', 'Thailand',
  'United Kingdom', 'France', 'Italy', 'Tanzania', 'South Africa', 'Myanmar', 'Kenya', 'South Korea', 'Colombia', 'Spain',
  'Argentina', 'Australia', 'Canada', 'Chile', 'Cuba', 'Denmark', 'Finland', 'Greece', 'Iceland', 'Ireland',
  'Israel', 'Jamaica', 'Jordan', 'Kazakhstan', 'Malaysia', 'Morocco', 'Netherlands', 'New Zealand', 'Norway', 'Peru',
  'Poland', 'Portugal', 'Saudi Arabia', 'Singapore', 'Sweden', 'Switzerland', 'Tunisia', 'Ukraine', 'United Arab Emirates', 'Uruguay',
  'Austria', 'Belgium', 'Bulgaria', 'Czech Republic', 'Ecuador', 'Hungary', 'Iraq', 'Lebanon', 'Libya', 'Lithuania'
];


const generateData = () => {
  let tempMapData = []
  for (let i = 0; i < 70; i++) {
    const country = {
      name: countries[i],
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    };
    tempMapData.push(country)

  }
  state.chartOptions.series[0].data = tempMapData;
}
generateData()

onMounted(() => {
  setInterval(() => {
    generateData()
  }, 3000)
})

</script>

<template>
  <section>
    <ZyEcharts :mapCityOption="state.mapCityOption" height="calc(100vh - 130px)" :chartOptions="state.chartOptions"/>
  </section>
</template>

<style scoped lang="scss">

</style>