
const video = document.querySelector('.video')

// 视频加载完成时,读取并设置播放时间
video.addEventListener('loadeddata', () => {
  video.currentTime = localStorage.getItem('currentTime') || 0
})

// ------------- 使用节流优化 -------------
//  播放时间改变会触发 timeupdate 事件
let timeId
video.addEventListener('timeupdate', function () {
  if (timeId !== undefined) {
    return
  }

  timeId = setTimeout(() => {
    console.log('timeupdate触发')
    localStorage.setItem('currentTime', this.currentTime)
    timeId = undefined
  }, 3000)

})
