// ======================1.generator的基本用法======================
function* generator_example() {
    const a = yield 1;
    console.log(a)
    const b = yield 2;
    console.log(b)
    const c = yield 3;
    console.log(c)
}

// 生成器就像XXFactory，生成的是一个迭代器（对象）
// 碰到yield就停止，得到的值就是yield后面的值，每次next就继续。
// 相当于用户在外部控制函数一步一步执行，有点像debug

const iterator = generator_example()

// 【为了让yield return的值等于yield后面的值，需要把value给下一个next函数传入参数】

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
const { value: value4, done: done4 } = iterator.next(value3) // 得到的value4是undefined， done为true
console.log('第四次', value4, done4)






// ======================2.generator编译后的源码======================

// 迭代器工具箱，用于生成迭代器：
// 调度用户传入的
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
            stop(){
                this.done = true
            }
        }
        const iterator = {
            next(curValue) {
                context.sent = curValue
                const newValue = executor(context)
                return {value: newValue, done: context.done}
            }
        }
        return iterator

    }
}


// 生成器主函数，相当于function *real_generator_example(){}编译后的样子
function real_generator_example() {
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
                case 6:
                    // 为yield的接受值者赋值
                    const c = context.sent
                    // 执行用户函数
                    console.log(c)
                    // 开始往下走
                    context.next = 9
                
                // 结束的时候，调用stop，表示done被赋值为true
                case 9:
                case 'end':
                    return context.stop()
            }
        }
    })
}




// ======================4.用于测试和验证-开始======================
const it = real_generator_example()

const { value: v1, done: d1 } = it.next()
console.log('自己写的-第一次', v1, d1)

const { value: v2, done: d2 } = it.next(v1)
console.log('自己写的-第二次', v2, d2)

const { value: v3, done: d3 } = it.next(v2)
console.log('自己写的-第三次', v3, d3)

const { value: v4, done: d4 } = it.next(v3)
console.log('自己写的-第四次', v4, d4)
// ======================用于测试和验证-结束======================




