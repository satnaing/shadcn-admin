<template>
  <section>
    <ZyEcharts :mapCityOption="state.mapCityOption" :chartOptions="state.chartOptions"
               height="calc(100vh - 130px)"/>
  </section>
</template>

<script setup>
import setting from '@/setting.js'
import {adjustColorOpacity} from '@/utils/util.common.js'
import china from 'echarts/map/json/china.json'


const state = reactive({
  mapCityOption: {
    name: 'china',
    geoData: china
  },
  chartOptions: {
    animation: true,
    title: [{
      show: true,
      text: '2024年度访问排行',
      subtext: '单位：次',
      subtextStyle: {
        color: '#8a8a8a',
        lineHeight: 20
      },
      textStyle: {
        color: setting.theme.color,
        fontSize: 18
      },
      right: 140,
      top: 20
    }],
    grid: {
      right: 10,
      top: 80,
      bottom: 20,
      width: '200'
    },
    tooltip: {
      trigger: 'item',
      formatter: params => {
        if (params.seriesType === 'scatter') {
          return `电话：${params.data.telphone}<br/>地址：${params.data.address}<br/>访客姓名：${params.data.username}`;
        }
        return params.name + ' : ' + params.value;
      }
    },
    geo: {
      map: 'china',
      label: {
        show: true,
        color: setting.theme.color,
        fontSize: 13,
        emphasis: {
          color: 'white',
          show: false
        }
      },
      roam: false,//是否允许缩放
      left: 'left',
      right: '350',
      zoom: .7, //默认显示级别
      scaleLimit: {
        min: 0,
        max: 1
      },
      itemStyle: {
        areaColor: adjustColorOpacity(setting.theme.color, 10),
        borderColor: adjustColorOpacity(setting.theme.color, 80),
        emphasis: {
          areaColor: setting.theme.color,
        }
      },
      //是否显示南海诸岛
      /*regions: [{
        name: "南海诸岛",
        value: 0,
        itemStyle: {
          normal: {
            opacity: 0,
            label: {
              show: false
            }
          }
        }
      }],*/
      tooltip: {
        show: false
      }
    },
    xAxis: {
      show: false
    },
    yAxis: {
      type: 'category',
      inverse: true,
      nameGap: 5,
      axisLine: {
        show: false,
        lineStyle: {
          color: '#fff'
        }
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: setting.theme.color
        }
      },
      axisLabel: {
        interval: 0,
        margin: 85,
        textStyle: {
          color: setting.theme.color,
          align: 'left',
          fontSize: 14
        },
        rich: {
          a: {
            color: '#fff',
            backgroundColor: '#f0515e',
            width: 20,
            height: 20,
            align: 'center',
            borderRadius: 2
          },
          b: {
            color: '#fff',
            backgroundColor: '#3f51b5',
            width: 20,
            height: 20,
            align: 'center',
            borderRadius: 2
          }
        },
        formatter: function (params) {
          if (parseInt(params.slice(0, 2)) < 3) {
            return [
              '{a|' + (parseInt(params.slice(0, 2)) + 1) + '}' + '  ' + params.slice(2)
            ].join('\n')
          } else {
            return [
              '{b|' + (parseInt(params.slice(0, 2)) + 1) + '}' + '  ' + params.slice(2)
            ].join('\n')
          }
        }
      },
      data: []
    },
    series: [
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        z: 1,
        data: [],
        symbolSize: 14,
        label: {
          normal: {
            show: true,
            formatter: function (params) {
              return '{fline|访客：' + params.data.username + '  ' + params.data.telphone + '}\n{tline|' + params.data.address + '}';
            },
            position: 'top',
            backgroundColor: 'rgba(254,174,33,.8)',
            padding: [0, 0],
            borderRadius: 3,
            lineHeight: 32,
            color: '#f7fafb',
            rich: {
              fline: {
                padding: [0, 10, 10, 10],
                color: '#ffffff'
              },
              tline: {
                padding: [10, 10, 0, 10],
                color: '#ffffff'
              }
            }
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          color: '#feae21',
        }
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        z: 1,
        data: [],
        symbolSize: 14,
        label: {
          normal: {
            show: true,
            formatter: function (params) {
              return '{fline|访客：' + params.data.username + '  ' + params.data.telphone + '}\n{tline|' + params.data.address + '}';
            },
            position: 'top',
            backgroundColor: 'rgba(233,63,66,.9)',
            padding: [0, 0],
            borderRadius: 3,
            lineHeight: 32,
            color: '#ffffff',
            rich: {
              fline: {
                padding: [0, 10, 10, 10],
                color: '#ffffff'
              },
              tline: {
                padding: [10, 10, 0, 10],
                color: '#ffffff'
              }
            }
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          color: '#e93f42',
        }
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        z: 1,
        data: [],
        symbolSize: 14,
        label: {
          normal: {
            show: true,
            formatter: function (params) {
              return '{fline|访客：' + params.data.username + '  ' + params.data.telphone + '}\n{tline|' + params.data.address + '}';
            },
            position: 'top',
            backgroundColor: 'rgba(55, 79, 223,.9)',
            padding: [0, 0],
            borderRadius: 3,
            lineHeight: 32,
            color: '#ffffff',
            rich: {
              fline: {
                padding: [0, 10, 10, 10],
                color: '#ffffff'
              },
              tline: {
                padding: [10, 10, 0, 10],
                color: '#ffffff'
              }
            }
          },
          emphasis: {
            show: true
          }
        },
        itemStyle: {
          color: '#3c38e4',
        }
      },
      //地图
      {
        type: 'map',
        mapType: 'china',
        geoIndex: 0,
        z: 0,
        label: {
          show: true,
          color: '#fff',
          fontSize: 13,
        },
        itemStyle: {
          areaColor: adjustColorOpacity(setting.theme.color, 10),
          borderColor: adjustColorOpacity(setting.theme.color, 80),
          emphasis: {
            areaColor: setting.theme.color,
          }
        },
        data: []
      },
      {
        name: 'barSer',
        type: 'bar',
        roam: false,
        visualMap: false,
        zlevel: 2,
        barMaxWidth: 16,
        barGap: 0,
        itemStyle: {
          normal: {
            color: function (params) {
              var colorList = [{
                colorStops: [{
                  offset: 0,
                  color: '#f0515e'
                }, {
                  offset: 1,
                  color: '#ef8554'
                }]
              },
                {
                  colorStops: [{
                    offset: 0,
                    color: '#3c38e4'
                  }, {
                    offset: 1,
                    color: '#24a5cd'
                  }]
                }
              ];
              if (params.dataIndex < 3) {
                return colorList[0]
              } else {
                return colorList[1]
              }
            },
            barBorderRadius: [15, 15, 15, 15]
          }
        },
        label: {
          normal: {
            show: true,
            textBorderColor: '#333',
            textBorderWidth: 2
          }
        },
        data: []
      }
    ]
  },
  namedata: [
    {name: '张'}, {name: '刘'}, {name: '李'}, {name: '邓'}, {name: '熊'},
    {name: '田'}, {name: '周'}, {name: '赵'}, {name: '钱'}, {name: '孙'},
    {name: '吴'}, {name: '郑'}, {name: '王'}, {name: '冯'}, {name: '陈'},
    {name: '杨'}, {name: '朱'}, {name: '秦'}, {name: '许'}, {name: '徐'},
    {name: '何'}, {name: '曹'}, {name: '陶'}, {name: '邹'}, {name: '苏'},
    {name: '范'}, {name: '彭'}, {name: '鲁'}, {name: '马'}, {name: '方'},
    {name: '唐'}, {name: '顾'}
  ],
  geoCoordMap: {
    '上海': [119.1803, 31.2891], "福建": [119.4543, 25.9222], "重庆": [108.384366, 30.439702],
    '北京': [116.4551, 40.2539], "辽宁": [123.1238, 42.1216], "河北": [114.4995, 38.1006],
    "天津": [117.4219, 39.4189], "山西": [112.3352, 37.9413], "陕西": [109.1162, 34.2004],
    "甘肃": [103.5901, 36.3043], "宁夏": [106.3586, 38.1775], "青海": [101.4038, 36.8207],
    "新疆": [87.9236, 43.5883], "西藏": [91.11, 29.97], "四川": [103.9526, 30.7617],
    "吉林": [125.8154, 44.2584], "山东": [117.1582, 36.8701], "河南": [113.4668, 34.6234],
    "江苏": [118.8062, 31.9208], "安徽": [117.29, 32.0581], "湖北": [114.3896, 30.6628],
    "浙江": [119.5313, 29.8773], '内蒙古': [110.3467, 41.4899], "江西": [116.0046, 28.6633],
    "湖南": [113.0823, 28.2568], "贵州": [106.6992, 26.7682], "云南": [102.9199, 25.4663],
    "广东": [113.12244, 23.009505], "广西": [108.479, 23.1152], "海南": [110.3893, 19.8516],
    '黑龙江': [127.9688, 45.368], '台湾': [121.4648, 25.5630]
  },
  chinaDatas: [
    {
      name: '北京',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '天津',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '上海',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '重庆',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '河北',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '河南',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '云南',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '辽宁',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '黑龙江',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '湖南',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '安徽',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '山东',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '新疆',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '江苏',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '浙江',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '江西',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '湖北',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '广西',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '甘肃',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '山西',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '内蒙古',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '陕西',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '吉林',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '福建',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '贵州',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '广东',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '青海',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '西藏',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '四川',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '宁夏',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '海南',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '台湾',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '香港',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
    {
      name: '澳门',
      value: Math.round(Math.random() * 1000),
      tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
    },
  ],
})
const convertData = (data, type) => {
  let res = [];
  for (let i = 0; i < data.length; i++) {
    let geoCoord = state.geoCoordMap[data[i].name];
    if (geoCoord) {
      if (type === 2) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value),
          username: data[i].username,
          telphone: data[i].telphone,
          address: data[i].address
        });
      } else {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value)
        });
      }
    }
  }
  return res;
}
const getTel = () => {
  let telstr = '1';
  for (let i = 2; i < 12; i++) {
    if (i < 3) {
      let nums;
      do {
        nums = Math.floor(Math.random() * 10);
      } while (nums === 0 || nums === 1 || nums === 2 || nums === 3 || nums === 4 || nums === 6);
      telstr += nums;
    } else if (i > 3 && i < 8) {
      telstr += '*';
    } else {
      telstr += Math.floor(Math.random() * 10);
    }
  }
  return telstr;
}
const getName = (type) => {
  let name = '';
  let roundnum = Math.floor(Math.random() * 32);
  switch (type) {
    case 1:
      name = state.namedata[roundnum].name + '先生';
      break;
    case 2:
      name = state.namedata[roundnum].name + '女士';
      break;
    default:
      name = state.namedata[roundnum].name + '先生';
      break;
  }
  return name;
}
const getAddress = (num, type) => {
  let addstr = '';
  switch (type) {
    case 1:
      addstr = '在' + state.chinaDatas[num].name + ' - 访问了ADMIN';
      break;
    case 2:
      addstr = '在' + state.chinaDatas[num].name + ' - 访问了微信小程序';
      break;
    default:
      addstr = '在' + state.chinaDatas[num].name + ' - 访问了ADMIN';
      break;
  }
  return addstr;
}
const updateChart = () => {
  let runidx = Math.floor(Math.random() * 3);
  let typeidx = Math.floor(Math.random() * 3);
  let dataidx = Math.floor(Math.random() * 34);
  let ranval = Math.floor(Math.random() * 390);
  state.chinaDatas[dataidx].value += ranval;
  let valarr = state.geoCoordMap[state.chinaDatas[dataidx].name];
  valarr.push(ranval);
  state.chartOptions.series[typeidx].data = [{
    name: '',
    username: getName(runidx),
    telphone: getTel(),
    address: getAddress(dataidx, typeidx),
    value: valarr
  }];
  state.chartOptions.series[4].data.sort((a, b) => b.value - a.value);
  state.chartOptions.series[3].data = convertData(state.chinaDatas, typeidx)
}
const initChart = () => {
  let yData = [];
  let barData = state.chinaDatas.sort((a, b) => b.value - a.value);
  for (var j = 0; j < barData.length; j++) {
    if (j < 10) {
      yData.push('0' + j + barData[j].name);
    } else {
      yData.push(j + barData[j].name);
    }
  }
  state.chartOptions.yAxis.data = yData
  state.chartOptions.series[4].data = barData
}


onMounted(() => {
  initChart()
  setInterval(updateChart, 3000);
})

</script>


<style scoped>

</style>
