
/**
 * 查询并渲染城市
 * @param {*} city 城市名
 */
function renderCity(city) {
  axios({
    url: 'http://hmajax.itheima.net/api/weather/city',
    params: {
      city
    }
  }).then(res => {
    // 4. 渲染城市
    if (res.data.data.length === 0) {
      document.querySelector('.search-list').innerHTML = `
      <li class="city-item" data-code="">未找到</li>
      `
      return
    }
    const str = res.data.data.map(v => {
      return `<li class="city-item" data-code="${v.code}">${v.name}</li>`
    }).join('')
    // console.log(str)
    document.querySelector('.search-list').innerHTML = str
  })
}

// ------------- 输入框搜索 -------------
let timeId
document.querySelector('.search-city').addEventListener('input', function () {
  clearTimeout(timeId)
  timeId = setTimeout(() => {
    renderCity(this.value)
  }, 500)
})

