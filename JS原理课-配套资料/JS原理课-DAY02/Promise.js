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
        //参数判断
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

    //静态方法
    static resolve(value){
        //判断传值 
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

    //all
    static all(promises){
        return new HmPromise((resolve,reject)=>{
            if(!Array.isArray(promises)){
                return reject(new TypeError('argument is not iterable'))
            }

            //空数组直接兑现
            promises.length === 0 && resolve(promises)
            //记录结果
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
}


const p1 = new HmPromise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(1)
    },1000)
})    

const  p2 = new HmPromise((resolve,reject)=>{
    setTimeout(()=>{
        reject(2)
    },2000)
})  
const p3 = 3
HmPromise.allSettled([p1,p2,p3]).then(res=>{
    console.log('res:',res);
    
},err=>{
    console.log('err:',err);
    
})


// HmPromise.race([p1,p2]).then((res)=>{
//     console.log('res:',res);
    
// },err=>{
//     console.log('err:',err)
// })

// HmPromise.resolve(new HmPromise((resolve,reject)=>{
//     // resolve('resolve')
//     // reject('reject')
//     throw 'error'
// })).then(res => {
//     console.log('res',res);
    
// }, err =>{
//     console.log('err',err);
    
// })

// HmPromise.resolve('itheima').then(res=>{
//     console.log(res);
    
// })

// const p = new HmPromise((resolve, reject) => {

//     resolve('success111')
//     // throw 'throw-error'
// })
// p.then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// }).finally(()=>{
//     console.log('finally');
    
// })
// p.then(res => {

//     return new HmPromise((resolve, reject) => {
//         resolve("khjgkgf")
//     })
// }, err => {

//     console.log('回调失败', err);

// }
// ).then((result) => {
//     console.log(result);

// }, (err) => {
//     console.log(err);

// })



