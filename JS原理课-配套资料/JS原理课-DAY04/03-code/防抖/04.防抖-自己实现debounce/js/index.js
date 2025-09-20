
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

// ------------- 自己实现 debounce-------------
/**
 * 自己实现 debounce
 *   1. 返回防抖动的新函数
 *   2. 原函数中的this可以正常使用
 *   3. 原函数中的参数可以正常使用 
 * */
const func = function (e) {
  console.log('e:', e)
  renderCity(this.value)
}

function debounce(func, wait = 0) {
  let timeId
  return function (...args) {
    // console.log(this)
    const _this = this
    // console.log(args)
    clearTimeout(timeId)
    timeId = setTimeout(function () {
      func.apply(_this, args)
    }, wait)
  }
}

const deFunc = debounce(func, 500)

document.querySelector('.search-city').addEventListener('input', deFunc)



