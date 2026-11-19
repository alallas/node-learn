
// 高阶函数是输入是函数，输出也是函数
// 基本用法是这样
const fc = {}

fc.a = function (cb) {
    return () => {
        // 这里的this指向【内层箭头函数定义（即外部函数执行）的时候】的this，在下面的例子中是fc对象
        console.log('=======', this)
        cb()
    }
}

let newA = fc.a(() => console.log('执行回调函数'))

newA()



// 应用场景:我们有一个核心函数，想要给核心函数前面加一个before的逻辑，在不同场景下，before的逻辑不同！
// 总而言之，一个核心函数，多个不同的before函数在不同场景下用

function core() {
    // 执行逻辑...我们想要在这里执行before的逻辑
    console.log('执行核心函数的逻辑')
}


// 如果只是有一个核心函数，那就可以简单写为针对这个核心函数做扩展：
core.withBefore = function(cb) {
    return (...args) => {
        cb()
        core(...args)
    }
}
const core1 = core.withBefore(() => console.log('1'))
const core2 = core.withBefore(() => console.log('2'))

core1()
core2()



// 如果继续扩展，想要给不同的core函数使用，针对Function做扩展：
Function.prototype.withBefore = function(cb) {
    return (...args) => {
        cb()    // 不同场景下不同的before函数
        this(...args)  // 核心函数：
        // 可以写成core()，但是这样把具体混进抽象了。
        // 或可以before加第二个core参数。
        // 但最好的办法是this()，因为这是放在Function原型的函数
    }
}
const core3 = core.withBefore(() => console.log('3'))
const core4 = core.withBefore(() => console.log('4'))

core3()
core4()




