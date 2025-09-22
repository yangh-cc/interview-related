function runAsyncTask(callback) {
    if (typeof queueMicrotask === 'function') {
        queueMicrotask(callback)
    } else if (typeof MutationObserver === 'function') {
        const obs = new MutationObserver(callback)
        const divNode = document.createElement('div')
        obs.observe(divNode, { childList: true })
        divNode.innerText = 'itheima111'
    } else {
        setTimeout(callback, 0)
    }
}


const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
function resolvePromise(p2, x, resolve, reject) {
    if (x === p2) {
        throw new TypeError('Chaining cycle detected for promise #<Promise>')
    }
    if (x instanceof HmPromise) {
        x.then(res => resolve(res), err => reject(err))
    } else {
        resolve(x)
    }
}
class HmPromise {
    state = PENDING

    result = undefined

    #handlers = []
    constructor(func) {
        const resolve = (result) => {
            if (this.state === PENDING) {
                this.state = FULFILLED
                this.result = result
                this.#handlers.forEach(({ onFulfilled }) => {
                    onFulfilled(this.result)
                })
            }
        }
        const reject = (result) => {
            if (this.state === PENDING) {
                this.state = REJECTED
                this.result = result
                this.#handlers.forEach(({ onRejected }) => {
                    onRejected(this.result)
                })
            }
        }
        try {
            func(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : x => x
        onRejected = typeof onRejected === 'function' ? onRejected : x => { throw x }

        const p2 = new HmPromise((resolve, reject) => {
            if (this.state === FULFILLED) {
                runAsyncTask(() => {
                    try {
                        const x = onFulfilled(this.result)
                        resolvePromise(p2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            } else if (this.state === REJECTED) {
                runAsyncTask(() => {
                    try {
                       const x = onRejected(this.result)
                        resolvePromise(p2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            } else if (this.state === PENDING) {
                this.#handlers.push({
                    onFulfilled: () => {
                        runAsyncTask(() => {
                            try {
                                const x = onFulfilled(this.result)
                                resolvePromise(p2, x, resolve, reject)
                            } catch (error) {
                                reject(error)
                            }
                        })
                    },
                    onRejected: () => {
                        runAsyncTask(() => {
                            try {
                                const x = onRejected(this.result)
                                resolvePromise(p2, x, resolve, reject)
                            } catch (error) {
                                reject(error)
                            }
                        })
                    }
                })
            }
        })
        return p2
    }

    catch(onRejected) {
        return this.then(undefined, onRejected)
    }

    finally(onFinally){
        return this.then(onFinally,onFinally)
    } 

    static resolve(value){
        if(value instanceof HmPromise){
            return value
        }

        return new HmPromise((resolve)=>{
            resolve(value)
        })
    }

    static reject(value){
        return new HmPromise((undefined,reject)=>{
            reject(value)
        })
    }

    static race(promises){
        return new HmPromise((resolve,reject)=>{
            if(!Array.isArray(promises)){
                return reject(new TypeError('argument is not iterable'))
            }
            promises.forEach(p=>{
                HmPromise.resolve(p).then(res=>{resolve(res)},err=>{reject(err)})
            })
        })
    }   

    static all(promises){
        return new HmPromise((resolve,reject)=>{
            if(!Array.isArray(promises)){
                return reject(new TypeError('argument is not iterable'))
            }

            promises.length === 0 && resolve(promises)
        const results=[]
        let count =0
        promises.forEach((p,index)=>{
            HmPromise.resolve(p).then(
                res=>{
                    results[index]= 
                    count++
                    count === promises.length && resolve(results)
                },err=>{
                    reject(err)
                }
            )
        })
        })
        
    }

    static allSettled(promises){
        return new HmPromise((resolve,reject)=>{
            if(!Array.isArray(promises)){
                return reject(new TypeError('argument is not iterable'))
            }
            promises.length === 0 && resolve(promises)


            const results=[]
            let count = 0
            promises.forEach((p,index)=>{
                HmPromise.resolve(p).then(res=>{
                    results[index]={status:FULFILLED,value:res}
                    count++
                    count === promises.length && resolve(results)
                },err=>{
                    results[index]={status:REJECTED,reason:err}
                    count++
                    count === promises.length && resolve(results)
                })
            })
        })

       
    }

    static any(promises){
        return new HmPromise((resolove,reject)=>{
            if(!Array.isArray(promises)){
                return reject(new TypeError('All promises were rejected'))
            }

            promises.length === 0 && reject(new AggregateError(promises,'All promises were rejected'))

            const errors =[]
            let count = 0
            promises.forEach((p,index)=>{
            HmPromise.resolve(p).then(res=>{
                resolove(res)
            },err=>{
                errors[index]=err
                count++
                count === promises.length && reject(new AggregateError(errors,'All promises were rejected'))
            })
        })
        })

        
    }
}

module.exports = {
    deferred(){
        const res = {}
        res.promise = new HmPromise((resolve,reject)=>{
            res.resolove = resolve
            res.reject = reject
        })
        return res
    }
}



