
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

// ------------- 输入框搜索+lodash -------------
/**
 * _.debounce(func,[wait=0],[option])
 *   1. 参数1: 需要防抖优化的原函数
 *   2. 参数2: 防抖的延迟时间,单位是毫秒
 *   3. 参数3: 选项对象(了解即可)
 *   4. 返回值: 防抖优化之后的新函数
 * */
const func = function (e) {
  console.log('e:', e)
  renderCity(this.value)
}

const debouncedFn = _.debounce(func, 500)

document.querySelector('.search-city').addEventListener('input', debouncedFn)










