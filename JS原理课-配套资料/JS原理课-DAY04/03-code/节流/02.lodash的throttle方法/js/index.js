
const video = document.querySelector('.video')

// 视频加载完成时,读取并设置播放时间
video.addEventListener('loadeddata', () => {
  video.currentTime = localStorage.getItem('currentTime') || 0
})

// ------------- 使用节流优化 -------------
/**
 * lodash的throttle方法 _.throttle(func, [wait=0], [options=])
 *  func: 需要进行节流优化的原函数
 *  wait: 节流的毫秒数
 *  options:
 *    options.leading: 节流开始时是否触发函数,默认为true
 *  返回值: 节流优化之后的新函数
 * */
const func = function (e) {
  console.log('timeupdate触发')
  console.log('e:', e)
  localStorage.setItem('currentTime', this.currentTime)
}

const throttleFn = _.throttle(func, 1000, { leading: false })

video.addEventListener('timeupdate', throttleFn)


