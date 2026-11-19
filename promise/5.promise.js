// ================1.promise的基本用法================
// 异步功能（本质上是发布订阅）、链式调用（防止回调嵌套）

// const promise1 = new Promise((resolve, reject) => {
//     // Promise类的入参函数是立即执行的，好处是什么呢？
//     // 因为我们要让一个事情立刻做，比如请求，等待一段时间之后才能拿到结果，需要内部提供的resolve发布函数来发布
//     setTimeout(() => {
//         // 本质上是发布函数
//         resolve('1000s后，请求回来数据了，拿到这个数据')
//     }, 1000)
// })

// promise1.then((data) => {
//     // 上面resolve获得的数据在这里会拿到
//     // 本质上为提前写订阅函数，拿到数据之后要干嘛
//     console.log('拿到第一个请求之后的数据了，接下来还要发出另一个请求，第一个请求的数据为：', data)
//     // 返回一个新的promise，给下一个then使用
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(`旧数据：${data}，加上新数据：xxxxx`)
//         }, 2000)
//     })
// }).then((data) => {
//     // 这里即为链式调用，目的是防止出现function readFile() { readFile(data, '', (data2) => { readFile(data2, '', () => {}) }) }
//     console.log('拿到两个请求的数据了，完成了，完整的数据是：', data)
// })

// promise1.then((data) => {
//     // 提前写第二个订阅函数，多个并行处理逻辑
//     console.log('拿到第一个请求之后的数据了，除了发另一个请求之外，还需要做额外的逻辑，第一个请求的数据为：', data)
// })

// promise1.then((data) => {
//     return new Promise((resolve) => {
//         // resolve可以传入一个promise，下一个then会继续等待这个新promise的resolve结果
//         resolve(new Promise((resolve) => {
//             setTimeout(() => {
//                 resolve(22 + '  ' + data)
//             }, 1000)
//         }))
//     })
// }).then((data) => {
//     console,log('拿到的是resolve内的promise的resolve之后的结果', data)
// })

// promise1.then(null).then((data) => {
//     // then也可以什么都不写，内部会处理
//     console.log('中间一个then没写回调，看看下一个then能不能拿到值:', data)
// })

// promise1.then((data) => {
//     throw new Error('抛出错误给catch，本then不写error的回调函数')
// }).catch((err) => {
//     // 用catch接住错误，上上层如果抛错而上层没有写error的回调函数，在这里的catch处接住
//     // 因此如果很多层then，不想每一层都写错误处理，可以最后再写
//     console.log('catch得到的结果：', err)
// })

// promise1.then((data) => {
//     console.log('finally前面的then返回的data：', data)
//     return data
// }).finally((data) => {
//     // finally相当于一个then，执行本回调，返回上一个promise返回的data或抛出上一个promise的错误
//     console.log('finally回调没有入参，你看入参为：', data)
// }).then((data) => {
//     // finally后面还可以继续then
//     console.log('finally后面的then得到的data：', data)
// }, (err) => {
//     console.log('finally后面的then得到的err：', err)
// })



// ================2.promise的其他方法================
// all方法：所有的promise都成功了才最终成功
// allSettled方法：所有的promise都保存结果，不管成功还是失败
// any方法：如果一个成功了就走成功，所有都失败了就走失败
// race方法：有一个成功或失败就采用他的结果

// Promise.all([
//     new Promise((resolve) => { setTimeout(() => resolve(1), 1000) }),
//     new Promise((resolve, reject) => { setTimeout(() => resolve(2), 2000) }),
// ]).then((data) => {
//     console.log('all方法执行，得到的结果是：', data)
// })
// Promise.allSettled([
//     new Promise((resolve) => { setTimeout(() => resolve(1), 1000) }),
//     new Promise((resolve, reject) => { setTimeout(() => reject(2), 2000) }),
// ]).then((data) => {
//     console.log('allSettled方法执行，得到的结果是：', data)
// })
// Promise.any([
//     new Promise((resolve) => { setTimeout(() => resolve(1), 1000) }),
//     new Promise((resolve, reject) => { setTimeout(() => reject(2), 2000) }),
// ]).then((data) => {
//     console.log('any方法执行，得到的结果是：', data)
// })
// Promise.race([
//     new Promise((resolve) => { setTimeout(() => resolve(1), 1000) }),
//     new Promise((resolve, reject) => { setTimeout(() => reject(2), 2000) }),
// ]).then((data) => {
//     console.log('race方法执行，得到的结果是：', data)
// })





// ================promise的基本源码================
// Promise用三个状态来控制什么时候要做发布动作，即执行订阅的函数
const PENDING = "PENDING"
const RESOLVED = "RESOLVED"
const REJECTED = "REJECTED"


// 处理then回调的返回值：
// 一步一步判断，先简单或复杂的方式好过，大if套用小if的情况
function resolveWithThenReturn(returnValueOfThen, nextPromise, nextResolve, nextReject) {
    // 1、需要nextPromise的入参也是为了做这个判断
    // 不能自相等
    if (returnValueOfThen === nextPromise) {
        nextReject('then回调函数返回的值不能是then返回的promise')
        return
    }

    // 2、判断是不是thanable，不是thanable就是基础值，直接resolve
    const isThenable = (typeof returnValueOfThen === 'object' && returnValueOfThen !== null) || typeof returnValueOfThen === 'function'
    if (!isThenable) {
        nextResolve(returnValueOfThen)
        return
    }

    // 3、判断能不能拿到then(防止getter出错)
    let thenFunc
    try {
        thenFunc = returnValueOfThen.then
    } catch (err) {
        nextReject(err)
        return
    }

    // 4、判断then是不是函数，不是就是{then:123}类似的
    if (typeof thenFunc !== 'function') {
        nextResolve(returnValueOfThen)
        return
    }

    // 5、处理thenable的情况
    // then回调返回的是一个promise，等此promise完成之后才resolve本then的返回的promise，以此进入下一层

    // 这里定义一个called是为了防止外部的回调被调用两次，导致promise状态被改两次(规范定义不能从非pending状态改向其他状态)
    let called = false
    try {
        // （用call的原因是returnValueOfThen.then直接调用会触发getter可能会发生异常）
        thenFunc.call(returnValueOfThen, (data) => {
            if (called) return
            called = true
            // 这里data有可能是一个promise，需要递归处理，直到data不是一个promise，才处理好本then的promise
            resolveWithThenReturn(data, nextPromise, nextResolve, nextReject)
        }, (err) => {
            if (called) return
            called = true
            nextReject(err)
        })
    } catch (err) {
        if (called) return
        called = true
        nextReject(err)
    }
}



// 处理then回调的同一个写法抽离：
// trycatch
// 执行外部用户写的then回调函数
// 处理then回调的返回值（实现链式调用的本质，下一个链可以拿到上一个链子的值）
function processWithThen(onCallback, value, nextResolve, nextReject, nextPromise) {
    try {
        // 执行外部用户写的then回调函数
        const returnValueOfThen = onCallback(value)
        // 因为then回调的返回值有可能有多种形式，需要一个专门的函数处理：
        resolveWithThenReturn(returnValueOfThen, nextPromise, nextResolve, nextReject)
    } catch (e) {
        nextReject(e)
    }
}

class Promise {
    constructor(executor) {
        // 三个状态
        this.status = PENDING;
        // 最新的存储的值，要给订阅的函数入参使用的
        // （一个promise只能存一个值，要想多个值，就需要多个promise）
        // 这里其实可以只设计一个变量，因为从pending到成功或失败，只变化一次，只存一次
        this.value = undefined; // 成功状态的入参
        this.reason = undefined; // 失败状态的入参
        // 订阅的函数的数组(需要分成功和失败)
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        // 这里提供一个【改变promise状态为成功状态】的函数
        // 其实是触发执行所有订阅的函数
        const resolve = (value) => {

            // 有可能resolve的是一个promise
            if (value instanceof Promise) {
                value.then((data) => resolve(data), (err) => reject(err))
                return
            }

            // 只有pending状态的promise才能改变状态，否则会出现promise先成功后失败的情况
            if (this.status !== PENDING) return
            this.status = RESOLVED
            this.value = value
            this.onResolvedCallbacks.forEach(fn => fn(value))
        }

        // 这里提供一个【改变promise状态为失败状态】的函数
        // 其实是触发执行所有订阅的函数
        const reject = (reason) => {
            if (this.status !== PENDING) return
            this.status = REJECTED
            this.reason = reason
            this.onRejectedCallbacks.forEach(fn => fn(reason))
        }

        // 一上来就执行回调函数，因为本意是赶紧执行用户指定的函数，以便开始进入等待期
        try {
            executor(resolve, reject)
        } catch {
            reject(new Error('执行executor失败'))
        }
    }

    then(onResolved, onRejected) {
        // 兼容处理两个回调，用户不传入也能运行
        onResolved = typeof onResolved === 'function' ? onResolved : ((data) => { return data })
        onRejected = typeof onRejected === 'function' ? onRejected : ((err) => { throw err })

        // 订阅函数，拿到【等用户resolve发布之后】要执行的函数，然后保存起来
        // 同时为了链式调用，返回一个新的promise，有他自己的状态/值管理
        const newPromise = new Promise((resolve, reject) => {
            if (this.status === RESOLVED) {
                // 1、成功的状态，相当于要发布了，直接执行订阅函数
                // 此时的value肯定已经被更新了，因为已经执行过resolve了

                // setTimeout为0（promise内部的处理只能是异步的，且这样才能拿到newPromise，用于判断then回调return的东西是不是newPromise）
                setTimeout(() => { processWithThen(onResolved, this.value, resolve, reject, newPromise) }, 0)
            } else if (this.status === REJECTED) {
                // 2、失败的状态，相当于要发布了，直接执行订阅函数
                setTimeout(() => { processWithThen(onRejected, this.reason, resolve, reject, newPromise) }, 0)
            } else {
                // 3、状态还是pending的状态
                // 把订阅的函数收集起来，到时候发布的时候一起执行
                this.onResolvedCallbacks.push((value) => {
                    setTimeout(() => { processWithThen(onResolved, value, resolve, reject, newPromise) }, 0)
                })
                this.onRejectedCallbacks.push((reason) => {
                    setTimeout(() => { processWithThen(onRejected, reason, resolve, reject, newPromise) }, 0)
                })
            }
        })
        return newPromise
    }

    catch(onRejected) {
        // catch本质上是一个then，形式为then(null, () => {})，专门用于接住错误
        return this.then(null, (err) => {
            onRejected(err)
        })
    }

    finally(cb) {
        // finally本质上也是一个then，但是只管返回上一步的数据和错误，无论自己的回调返回啥

        // 首先立刻执行cb，然后返回一个新的promise，目的是借助新的promise返回上层的data或者抛出上层的错误
        // 用Promise.resolve().then()来实现
        return this.then(
            (data) => Promise.resolve(cb()).then(() => data),
            (err) => Promise.resolve(cb()).then(() => { throw err }),
        )
    }


    // ================promise的其他方法================
    static resolve(onResolvedValue) {
        if (onResolvedValue instanceof Promise) return onResolvedValue
        return new Promise((resolve) => {
            resolve(onResolvedValue)
        })
    }
    static reject(onRejectedReason) {
        return new Promise((resolve, reject) => {
            reject(onRejectedReason)
        })
    }
    static all(promises) {
        return new Promise((resolve, reject) => {
            const res = []
            let times = promises.length
            for (let i = 0; i < promises.length; i++) {
                // 这里用Promise.resolve包裹是为了兼容处理所有的非promise值
                const promise = Promise.resolve(promises[i])
                promise.then((data) => {
                    // 得到的结果要按顺序放入
                    res[i] = data
                    // 这里不用length来判断是否收集完毕，因为有可能第三个promise先结束，导致res为[empty, empty, data]
                    if (--times === 0) resolve(res)
                }, (err) => {
                    reject(err)
                })
            }
        })
    }
    static allSettled(promises) {
        return new Promise((resolve) => {
            const res = [];
            let times = promises.length;
            for (let i = 0; i < promises.length; i++) {
                const promise = Promise.resolve(promises[i])
                promise.then((data) => {
                    res[i] = data
                    // 成功算完成一次，等到所有promise都处理完成之后，才执行resolve
                    if (--times === 0) resolve(res)
                }, (err) => {
                    res[i] = err
                    // 失败也算完成一次，等到所有promise都处理完成之后，才执行resolve
                    if (--times === 0) resolve(res)
                })
            }
        })
    }
    static any(promises) {
        return new Promise((resolve, reject) => {
            const res = []
            let times = promises.length
            for (let i = 0; i < promises.length; i++) {
                const promise = Promise.resolve(promises[i])
                promise.then((data) => {
                    resolve(data)
                }, (err) => {
                    res[i] = err
                    if (--times === 0) reject(res)
                })
            }
        })
    }
    static race(promises) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                const promise = Promise.resolve(promises[i])
                promise.then((data) => {
                    resolve(data)
                }, (err) => {
                    reject(err)
                })
            }
        })
    }
}



// ================用于验证测试--开始================
// ================1、promise的基本用法================
const promise2 = new Promise((resolve, reject) => {
    // Promise类的入参函数是立即执行的，好处是什么呢？
    // 因为我们要让一个事情立刻做，比如请求，等待一段时间之后才能拿到结果，需要内部提供的resolve发布函数来发布
    setTimeout(() => {
        // 本质上是发布函数
        resolve('1000s后，请求回来数据了，拿到这个数据')
    }, 1000)
})

promise2.then((data) => {
    // 上面resolve获得的数据在这里会拿到
    // 本质上为提前写订阅函数，拿到数据之后要干嘛
    console.log('拿到第一个请求之后的数据了，接下来还要发出另一个请求，第一个请求的数据为：', data)
    // 返回一个新的promise，给下一个then使用
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(`旧数据：${data}，加上新数据：xxxxx`)
        }, 2000)
    })
}).then((data) => {
    // 这里即为链式调用，目的是防止出现function readFile() { readFile(data, '', (data2) => { readFile(data2, '', () => {}) }) }
    console.log('拿到两个请求的数据了，完成了，完整的数据是：', data)
})

promise2.then((data) => {
    // 提前写第二个订阅函数，多个并行处理逻辑
    console.log('拿到第一个请求之后的数据了，除了发另一个请求之外，还需要做额外的逻辑，第一个请求的数据为：', data)
})

promise2.then((data) => {
    return new Promise((resolve) => {
        // resolve可以传入一个promise，下一个then会继续等待这个新promise的resolve结果
        resolve(new Promise((resolve) => {
            setTimeout(() => {
                resolve(22 + '  ' + data)
            }, 1000)
        }))
    })
}).then((data) => {
    console.log('拿到的是resolve内的promise的resolve之后的结果', data)
})

promise2.then(null).then((data) => {
    // then也可以什么都不写，内部会处理
    console.log('中间一个then没写回调，看看下一个then能不能拿到值:', data)
})

promise2.then((data) => {
    throw new Error('抛出错误给catch，本then不写error的回调函数')
}).catch((err) => {
    // 用catch接住错误，上上层如果抛错而上层没有写error的回调函数，在这里的catch处接住
    // 因此如果很多层then，不想每一层都写错误处理，可以最后再写
    console.log('catch得到的结果：', err)
})

promise2.then((data) => {
    console.log('finally前面的then返回的data：', data)
    return data
}).finally((data) => {
    // finally相当于一个then，执行本回调，返回上一个promise返回的data或抛出上一个promise的错误
    console.log('finally回调没有入参，你看入参为：', data)
}).then((data) => {
    // finally后面还可以继续then
    console.log('finally后面的then得到的data：', data)
}, (err) => {
    console.log('finally后面的then得到的err：', err)
})




// ================2、promise的其他方法================

Promise.all([
    new Promise((resolve) => { setTimeout(() => resolve(1), 1000) }),
    new Promise((resolve, reject) => { setTimeout(() => reject(2), 2000) }),
]).then((data) => {
    console.log('all方法执行，得到的结果是：', data)
}, (err) => {
    console.log('all方法执行报错了', err)
})

Promise.allSettled([
    new Promise((resolve) => { setTimeout(() => resolve(1), 1000) }),
    new Promise((resolve, reject) => { setTimeout(() => reject(new Error('reject出来的错误')), 2000) }),
]).then((data) => {
    console.log('allSettled方法执行，得到的结果是：', data)
})

Promise.any([
    new Promise((resolve, reject) => { setTimeout(() => reject(1), 1000) }),
    new Promise((resolve, reject) => { setTimeout(() => reject(2), 2000) }),
]).then((data) => {
    console.log('any方法执行，得到的结果是：', data)
}, (err) => {
    console.log('any方法执行报错了', err)
})

Promise.race([
    new Promise((resolve) => { setTimeout(() => resolve(1), 1000) }),
    new Promise((resolve, reject) => { setTimeout(() => reject(2), 2000) }),
]).then((data) => {
    console.log('race方法执行，得到的结果是：', data)
})

// ================用于验证测试--结束================





// ================3.promise及其方法的应用================
// race是用来写请求超时的好方法，但是只是取了快的那个结果，而不是真正取消请求
const promise3 = new Promise((resolve) => {
    setTimeout(() => {
        resolve('请求后得到的数据')
    }, 5000)
})
const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('3s后超时了,停止请求')
    }, 3000)
})
Promise.race([promise3, timeoutPromise]).then((data) => {
    console.log("race应用，成功，查看最后结果:", data)
}, (err) => {
    console.log("race应用，失败，查看最后结果:", err)
})


// 让node的一些方法改成then的调用方式，防止回调嵌套，比如fs.readFile('', '', (err, data) => fs.readFile(data, '', () => { console.log(‘获得数据’) }))
// 一般第三个参数的回调的入参都是(name, parseMethod, callback)
// 1、简单的形式
const fs = require('fs')
function readFile_self(path, parseMethod) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, parseMethod, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}
readFile_self('./promise/example/throughThisToReadFile.txt', 'utf8').then((data) => {
    return readFile_self(`./promise/example/${data}`, 'utf8')
}).then(data => {
    console.log('使用readFile_self，两次读取文件之后的结果:', data)
})


// 2、把node的fs库的所有方法都改成promise的方式
function promisify(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }
}
function promisifyAll(fns) {
    const obj = {}
    for (fnKey in fns) {
        if (typeof fns[fnKey] !== 'function') continue
        // promisify得到的是改造过后的函数
        obj[fnKey] = promisify(fns[fnKey])
    }
    return obj
}

const newFs = promisifyAll(fs)
newFs.readFile('./promise/example/throughThisToReadFile.txt', 'utf8').then((data) => {
    return newFs.readFile(`./promise/example/${data}`, 'utf8')
}).then(data => {
    console.log('使用newFs.readFile，两次读取文件之后的结果:', data)
})




