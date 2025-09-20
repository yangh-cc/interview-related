const myChart = echarts.init(document.querySelector('.main'))

const option = {
  title: {
    text: 'ECharts 入门示例'
  },
  tooltip: {},
  legend: {
    data: ['销量']
  },
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
}
myChart.setOption(option)


// ------------- 更改图表大小 -------------
window.addEventListener('resize', () => {
  // console.log('resize触发')
  myChart.resize()
})