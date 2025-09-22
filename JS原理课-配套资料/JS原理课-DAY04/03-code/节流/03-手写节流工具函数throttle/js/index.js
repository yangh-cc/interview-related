
const video = document.querySelector('.video')

// 视频加载完成时,读取并设置播放时间
video.addEventListener('loadeddata', () => {
  video.currentTime = localStorage.getItem('currentTime') || 0
})

// ------------- 使用节流优化 -------------
/**
 * throttle(func, [wait=0])
 *   1. 返回节流的新函数
 *   2. 原函数中的this可以正常使用
 *   3. 原函数中的参数可以正常使用
 * */
const func = function (e) {
  console.log('timeupdate触发')
  console.log('e:', e)
  localStorage.setItem('currentTime', this.currentTime)
}

function throttle(func, wait = 0) {
 let timeId
 return function(...args){
  if(timeId!== undefined){
    return
  }
  const _this=this
  timeId=setTimeout(()=>{
    func.apply(_this,args)
    timeId=undefined
  },wait)
 }
}

const throttleFn = throttle(func, 1000)

video.addEventListener('timeupdate', throttleFn)




// 防抖工具函数
function debounce(func, wait = 0) {
  let timeId
  return function (...args) {
    let _this = this
    clearTimeout(timeId)
    timeId = setTimeout(function () {
      func.apply(_this, args)
    }, wait)
  }
}
// 节流工具函数
function throttle(func, wait = 0) {
  let timeId
  return function (...args) {
    if (timeId !== undefined) {
      return
    }
    const _this = this
    timeId = setTimeout(() => {
      func.apply(_this, args)
      timeId = undefined
    }, wait)
  }
}


//  let timeId
//   return function (...args) {
//     if (timeId !== undefined) {
//       return
//     }
//     // console.log(this)
//     // console.log(args)
//     const _this = this
//     timeId = setTimeout(() => {
//       func.apply(_this, args)
//       timeId = undefined
//     }, wait)
//   }