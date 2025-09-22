class HMEmmiter {
    //添加私有属性
    #handlers = {

    }

    $on(event, callback) {
        if (this.#handlers[event] === undefined) {
            this.#handlers[event] = []
        }
        this.#handlers[event].push(callback)
    }

    //触发事件
    $emit(event, ...args) {
        const funcs = this.#handlers[event] || []
        funcs.forEach(callback => callback(...args))
    }

    //移除事件
    $off(event) {
        this.#handlers[event] = undefined
    }

    //一次性事件注册
    $once(event, callback) {
        this.$on(event, (...args) => {
            callback(...args)

            this.$off(event)
        })

    }
}

const bus = new HMEmmiter()

document.querySelector('.on').addEventListener('click', () => {
    bus.$on('event1', () => { console.log('回调函数1') })
    bus.$on('event2',(name,info)=>{console.log(name,info)})
})
document.querySelector('.emit').addEventListener('click', () => {
    bus.$emit('event1')
    bus.$emit('event2', 'itheima', '666')
})
document.querySelector('.off').addEventListener('click', () => {
    bus.$off('event1')
})
document.querySelector('.once-on').addEventListener('click', () => {
    bus.$once('once-event', (name, info) => {
        console.log(name, info);

    })
})
document.querySelector('.once-emit').addEventListener('click', () => {
    bus.$once('once-event', 'itheima', '666')
})