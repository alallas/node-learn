
function sum(a, b, c, d) {
    return a + b + c + d
}


// const sum0 = curring(sum)

// const sum1 = sum0(1)
// const sum2 = sum1(2, 3)
// const sum3 = sum2(4)
// console.log(sum3, '打印这个就是最后的加和')


// 想要写成这种形式 curringSum(1)(2, 3)(4)
// 功能上其实等同于 sum(1, 2, 3, 4)


function curring(executor) {
    const sumOfArgsLength = executor.length

    // 返回的loop想要组装参数，如果直接return loop([...argsArr, ]) ，不知道从哪里获取用户传递的参数，
    // 可以返回一个包裹函数(...userArgs) => loop([...argsArr, ...userArgs])

    // loop的入参形式：
    // 数组：loop的入参是数组args = []
    // 组合的时候写成(...userArgs) => loop([...argsArr, ...userArgs])
    // 最后返回的时候返回loop()，因为loop用的是数组的入参，相当于是内部函数有自己定义的入参形式，给外部暴露的时候不要暴露内部函数

    // 拼装参数：loop的入参是...args
    // 组合的时候写成(...userArgs) => loop(...args, ...userArgs)，本质上等于...[...argsArr, ...userArgs]
    // 最后直接返回loop，因为这个内部函数的入参是正常的，没有自己额外定义类型

    const loop = (...args) => {
        if (args.length >= sumOfArgsLength) return executor(...args)
        else return (...userArgs) => loop(...args, ...userArgs)
    }

    return loop

}


const sum0 = curring(sum)

const sum1 = sum0(1)
const sum2 = sum1(2, 3)
const sum3 = sum2(4)
console.log(sum3, '打印这个就是最后的加和')




// 应用

// ps注意Object.prototype.toString 是拿 this 判断的，不是拿入参，别漏了.call(val)，让this就是val

// 想要利用Object.prototype.toString来判断类型，且要求入参是'String'和'123'，判断后者是不是前者那个类型
// 普通写法
function isTyping(typing, val) {
    return Object.prototype.toString.call(val) === `[object ${typing}]`
}

// 不让用户自己输入typing，typing由开发者输入，封装之后给别人直接输入val
// 进化版本，坏处是写多个isString/isNumber
function isTyping2(typing) {
    return (val) => Object.prototype.toString.call(val) === `[object ${typing}]`
}
const isString = isTyping2('String')
const isNumber = isTyping2('Number')
isString('123')


// 批量做一个utils
// 可以用curring如下，也可以用utils['is' + type] = isTyping2(type)
const utils = {};
['String', 'Number', 'Boolean', 'Null', 'Undefined'].forEach((type) => { utils['is' + type] = curring(isTyping)(type) })

const res = utils.isString('123')
console.log(res)






