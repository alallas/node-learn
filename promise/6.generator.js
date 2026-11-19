// ======================1.generator的基本用法======================
function* generator_example() {
    const a = yield 1;
    console.log(a)
    const b = yield 2;
    console.log(b)
    const c = yield 3;
    console.log(c)
    return c
}

// 生成器就像XXFactory，生成的是一个迭代器（对象）
// 碰到yield就停止，得到的值就是yield后面的值，每次next就继续。
// 相当于用户在外部控制函数一步一步执行，有点像debug

const iterator = generator_example()

// 【为了让yield return的值等于yield后面的值，需要把value给下一个next函数传入参数。】
// 第一个next不需要传递参数，因为第一个next不会执行到第一个yield前的逻辑
// n个yield，用n+1个next可以执行完毕。


// 第一次开始执行，执行的是：1;
const { value: value1, done: done1 } = iterator.next() // 得到的value1就是1，传递给下面第二次，使得a为1
console.log('第一次', value1, done1)

// 第二次开始执行，执行的是：const a = 和 console.log(a) 和 2;
const { value: value2, done: done2 } = iterator.next(value1) // 得到的value2就是2，传递给下面第三次，使得b为2
console.log('第二次', value2, done2)

// 第三次开始执行，执行的是：const b = 和 console.log(b) 和 3;
const { value: value3, done: done3 } = iterator.next(value2) // 得到的value3就是3，传递给下面第四次，使得c为3
console.log('第三次', value3, done3)

// 第四次开始执行，执行的是：const c = 和 console.log(c)
const { value: value4, done: done4 } = iterator.next(value3) // 得到的value4是3，即为生成器返回的值，done为true
console.log('第四次', value4, done4)


// 【上述是很不优雅的写法，可以用循环来写，等到done为true就结束循环】
let curDone = false;
let curValue = undefined;
while (!curDone) {
    const { value, done } = iterator.next(curValue)
    console.log('while循环内的：', value, done)
    curValue = value
    curDone = done
}



// ======================2.generator编译后的源码======================

// 迭代器工具箱，用于生成迭代器：
// 调度用户传入的函数
const iteratorFactory = {
    wrap(executor) {
        const context = {
            // 两个指针来调度函数往后走，一个是当前的，一个是指示下一步骤要走的方向的
            prev: undefined,
            next: 0,
            // 整个调度是否已经结束
            done: false,
            // 用户给next传入的参数，即yield的接受值者的值，存在这里
            sent: undefined,
            // 结束调度
            stop() {
                this.done = true
            }
        }
        const iterator = {
            next(curValue) {
                context.sent = curValue
                const newValue = executor(context)
                return { value: newValue, done: context.done }
            }
        }
        return iterator

    }
}


// 生成器主函数，相当于function *iteratorGenerator(){}编译后的样子
function iteratorGenerator() {
    // 返回的是迭代器对象，用wrap来生成
    return iteratorFactory.wrap((context) => {
        // 这个回调是用户自己写的代码，经过编译后的样子
        // wrap内部会调度用户写的代码，控制她一行一行执行
        while (1) {
            switch (context.prev = context.next) {
                // 第一次开始执行，执行的是：1;
                case 0:
                    context.next = 3
                    return 1

                // 第二次开始执行，执行的是：const a = 和 console.log(a) 和 2;
                case 3:
                    // 为yield的接受值者赋值(context.sent的赋值是放在迭代器里面执行，因为里面是拿到用户传值最近的地方)
                    const a = context.sent
                    // 执行用户函数
                    console.log(a)
                    // 开始往下走
                    context.next = 6
                    return 2

                // 第三次开始执行，执行的是：const b = 和 console.log(b) 和 3;
                case 6:
                    // 为yield的接受值者赋值
                    const b = context.sent
                    // 执行用户函数
                    console.log(b)
                    // 开始往下走
                    context.next = 9
                    return 3

                // 第四次开始执行，执行的是：const c = 和 console.log(c)
                case 9:
                    // 为yield的接受值者赋值
                    const c = context.sent
                    // 执行用户函数
                    console.log(c)
                    // 开始往下走
                    context.next = 12
                    return c

                // 结束的时候，调用stop，表示done被赋值为true
                case 12:
                case 'end':
                    return context.stop()
            }
        }
    })
}




// ======================4.用于测试和验证-开始======================
const it = iteratorGenerator()

// const { value: v1, done: d1 } = it.next()
// console.log('自己写的-第一次', v1, d1)

// const { value: v2, done: d2 } = it.next(v1)
// console.log('自己写的-第二次', v2, d2)

// const { value: v3, done: d3 } = it.next(v2)
// console.log('自己写的-第三次', v3, d3)

// const { value: v4, done: d4 } = it.next(v3)
// console.log('自己写的-第四次', v4, d4)

let curDone1 = false;
let curValue1 = undefined;
while (!curDone1) {
    const { value, done } = it.next(curValue1)
    console.log('自己写的-while循环内的：', value, done)
    curValue1 = value
    curDone1 = done
}
// ======================用于测试和验证-结束======================




// ======================4.generator的应用及其源码======================
// 目标：throughThisToReadFile.txt解析出a.txt，再解析出aaaaa
const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)

function* readDoubleFile() {
    const data = yield readFile('./promise/example/throughThisToReadFile.txt', 'utf8')
    const finalData = yield readFile(`./promise/example/${data}`, 'utf8')
    console.log('生成器里面的finalData', finalData)
    return finalData
}
const itOfReadDoubleFile = readDoubleFile()


// 写法1：最朴素的写法，直接用next硬生生写
// 两个yield，用三个next可以解决完毕。
// const { value: promise1 } = itOfReadDoubleFile.next() // 拿到第一个promise
// promise1.then((data) => {
//     const { value: promise2 } = itOfReadDoubleFile.next(data)
//     promise2.then((data) => {
//         // 最后这个返回值是没有意义的，因为此时此刻已经执行完函数了，返回的return自然是undefined
//         const { value } = itOfReadDoubleFile.next(data)
//     })
// })



// 写法2：用一个大promise解决完所有，利用co库的原理
function co(iterator) {
    // 返回一个大的promise
    return new Promise((resolve, reject) => {
        try {
            const next = (nextValue) => {
                // 立刻执行next
                const { value, done } = iterator.next(nextValue)
                // 没完成就递归，已经完成了就直接resolve外层的大promise
                if (!done) {
                    // 这里一定要Promise.resolve(value).then()之后才递归，用于处理value是promise或非promise的情况
                    Promise.resolve(value).then((data) => next(data), (err) => reject(err))
                } else {
                    // 当done为true的时候，这里的value就是 generator 的 return 值
                    resolve(value)
                }
            }
            // 先立刻执行一次
            next()
        } catch (err) {
            reject(err)
        }
    })
}
// 得到的最终结果是最后的解析成果
co(itOfReadDoubleFile).then((finalData) => {
    console.log('利用co得到的最后的解析数据: ', finalData)
})



// 写法3：用async和await，本质上就是generator，写法更加简洁
// async就是*，await就是yield

async function readDoubleFile2() {
    const res1 = await readFile('./promise/example/throughThisToReadFile.txt', 'utf8')
    const finalData = await readFile(`./promise/example/${res1}`, 'utf8')
    const otherData = await 1000
    console.log('用async和await写的，最终获取到的finalData', finalData)
    console.log('用async和await写的，await常量的测试', otherData)
    return finalData
}
readDoubleFile2()


// async和await编译出来之后是（其源码是）：
// 核心函数：本质上是co库的逻辑，递归执行next直到done。
// 接受一个生成器作为入参，内部创造一个迭代器，Q：为啥不直接用迭代器作为入参？
function asyncGenerator(generator) {
    return function () {
        const self = this;
        const args = arguments;
        return new Promise((resolve, reject) => {
            const iterator = generator.apply(self, args)
            const next = (newValue) => {
                try {
                    const { value, done } = iterator.next(newValue)
                    if (!done) {
                        Promise.resolve(value).then(next, reject)
                    } else {
                        resolve(value)
                    }
                } catch (err) {
                    reject(err)
                }
            }
            next()
        })
    }

}

// 迭代器工具箱
const iteratorFactory_async = {
    wrap(executor) {
        const context = {
            // 两个指针来调度函数往后走，一个是当前的，一个是指示下一步骤要走的方向的
            prev: undefined,
            next: 0,
            // 整个调度是否已经结束
            done: false,
            // 用户给next传入的参数，即yield的接受值者的值，存在这里
            sent: undefined,
            // 结束调度
            stop() {
                this.done = true
            }
        }
        const iterator = {
            next(curValue) {
                context.sent = curValue
                const newValue = executor(context)
                return { value: newValue, done: context.done }
            }
        }
        return iterator

    }
}

// 生成器，返回一个迭代器
const iteratorGenerator_async = () => {
    let finalData
    return iteratorFactory_async.wrap((context) => {
        while (1) {
            switch (context.prev = context.next) {
                case 0:
                    const promise1 = readFile('./promise/example/throughThisToReadFile.txt', 'utf8')
                    context.next = 2;
                    return promise1;
                case 2:
                    const res1 = context.sent
                    const promise2 = readFile(`./promise/example/${res1}`, 'utf8')
                    context.next = 4;
                    return promise2;
                case 4:
                    finalData = context.sent
                    context.next = 6;
                    return 1000;
                case 6:
                    const otherData = context.sent
                    console.log('用async和await写的，最终获取到的finalData', finalData)
                    console.log('用async和await写的，await常量的测试', otherData)
                    context.next = 8;
                    return finalData;
                case 8:
                case 'end':
                    context.stop()
            }
        }
    })
}

// 最后async函数会变成一个promise，里面的await其实就是yield
function readDoubleFile2_async() {
    const async = asyncGenerator(iteratorGenerator_async)
    return async()
}






