const fs = require('fs')


// fs.readFile('./promise/example/a.txt', 'utf8', (err, data) => {
//     console.log(err, data)
//     out(data)
// })

// fs.readFile('./promise/example/b.txt', 'utf8', (err, data) => {
//     console.log(err, data)
//     out(data)
// })


// 我们需要在每个“请求”即文件读取之后，执行一些处理逻辑，不同场景下有不同的处理逻辑
// 普通版本----
// 收集数据是各个场景都要做的事情，因此写在函数内部。
// 不同场景有不同的cb处理，比如3个的并发请求要xx，4个的并发请求要xx。
// 对外暴露的入参都只是data，没有times或cb


// 缺点，如果3个并发请求的cb的逻辑很多，只能糅杂在一起，比如function cb() { cb1(); cb2(); cb3() }

function outFactory(times, cb) {
    let arr = []
    return (data) => {
        arr.push(data)
        // ps：--times是先减后输出，times++是先输出后加
        if (--times === 0) {
            cb(arr)
        }
    }
}
const out1 = outFactory(2, (arr) => {
    console.log('读完数据了', arr)
})


fs.readFile('./promise/example/a.txt', 'utf8', (err, data) => {
    // console.log(err, data)
    out1(data)
})

fs.readFile('./promise/example/b.txt', 'utf8', (err, data) => {
    // console.log(err, data)
    out1(data)
})




// 进化版本，把内核的收集数据的函数也抽离出来
// 事前自己定义好请求完毕之后的所有处理逻辑
// 请求完毕之后触发一下就行，后续不用动emit()

// 本质上是发布订阅模式

class Event {

    cbArr = []

    on(fn) {
        this.cbArr.push(fn)
    }

    emit(data) {
        this.cbArr.forEach(fn => fn(data))
    }
}

const event1 = new Event()

const arr = []

event1.on((data) => {
    console.log(data)
})

event1.on((data) => {
    arr.push(data)
})

event1.on((data) => {
    if (arr.length === 2) console.log('读取完毕')
})

fs.readFile('./promise/example/a.txt', 'utf8', (err, data) => {
    // console.log(err, data)
    event1.emit(data)
})

fs.readFile('./promise/example/b.txt', 'utf8', (err, data) => {
    // console.log(err, data)
    event1.emit(data)
})



