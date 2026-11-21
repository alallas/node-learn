// global全局属性
// 内置模块、文件模块、第三方模块
// 模块规范

// ======================1.global全局属性（能通过global直接访问的属性）======================
// ============1.1 process属性============

// 获取当前操作系统的类型
const c1 = process.platform
console.log('process的platform：', c1) // win32

// 获取当前调用node文件的根目录
const c2 = process.cwd()
console.log('process的cwd：', c2) // d:\Repos\node-learn

// 获取环境变量
// 在调用的时候定义变量的值，比如
// cmd：set NODE_ENV=production && node promise/7.node模块.js
// powershell：$env:NODE_ENV="production"; node promise/7.node模块.js
// bash：NODE_ENV=production node promise/7.node模块.js
const c3 = process.env.NODE_ENV
console.log('process的env：', c3) // d:\Repos\node-learn







// ======================2.内置模块（node中自带的模块）======================
// ============2.1 path模块============
const path = require('path')

// 拼绝对路径
// 没有__dirname，就按照【当前调用node文件的根目录】+ 【拼接的参数】返回，是会变的
const a1 = path.resolve('a', 'b', 'c')
// 有__dirname，就按照【__dirname】+ 【拼接的参数】返回，固定不变
const a2 = path.resolve(__dirname, 'a', 'b', 'c')
// 两个破碎路径，以当前文件所在盘作为头部，拼接为绝对路径
const a3 = path.resolve('/a/b', '../c/d.js');
console.log('resolve没有__dirname: ', a1) // d:\Repos\node-learn\a\b\c
console.log('resolve有__dirname: ', a2) // d:\Repos\node-learn\promise\a\b\c
console.log('resolve两个破碎路径: ', a3) // d:\a\c\d.js

// 根据两个路径拆出相对路径：如果你现在站在 from 这个位置，要怎么走才能到达 to
// 两个参数都会被 path.resolve() 处理——如果传相对路径，会基于当前工作目录（process.cwd()）解析成绝对路径再计算
const a7 = path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')
console.log('relative: ', a7) // ..\..\impl\bbb

// 纯粹拼路径，不会产生绝对路径
const a4 = path.join(__dirname, 'a', 'b', 'c')
const a5 = path.join('a', 'b', 'c')
console.log('join有__dirname: ', a4) // d:\Repos\node-learn\promise\a\b\c
console.log('join没有__dirname: ', a5) // a\b\c

// 获取父路径（当前入参这个路径的目录的路径）
const a6 = path.dirname('a/b/c')
console.log('dirname: ', a6) // a/b

// 获取扩展名
const a8 = path.extname('/c/d.min.js')
console.log('extname: ', a8)

// 获取文件名，第二个参数是自定义的扩展名（没有输入就按照path.extname的来）
const a9 = path.basename('/c/d.min.js', 's')
const a10 = path.basename('/c/d.min.js')
console.log('basename有自带扩展名: ', a9)
console.log('basename没有自带扩展名: ', a10)



// ============2.2 fs模块============
const fs = require('fs')

// 读文件
// 异步的
fs.readFile('./promise/example/throughThisToReadFile.txt', 'utf8', (err, data) => {
    console.log('fs.readFile异步的读文件：', data)
})
// 同步的
const b1 = fs.readFileSync('./promise/example/throughThisToReadFile.txt', 'utf8')
console.log('fs.readFile同步的读文件：', b1)

// 写文件
// 异步的
fs.writeFile('./promise/example/c.txt', '要写入的内容', 'utf8', (err, data) => {
    if (err) {
        console.log('fs.writeFile异步写入出错：', err)
        return
    }
    console.log('fs.writeFile异步写入成功')
})
// 同步的
fs.writeFileSync('./promise/example/c.txt', '要写入的内容', 'utf8');

// 判断文件是否存在
const isExists = fs.existsSync('./promise/example/throughThisToReadFile.txt')
console.log('fs.existsSync：', isExists)



// ============2.3 vm模块============
// vm作用是模板引擎，将字符串转化为代码执行
// vm内部会新起一个沙箱环境（沙箱环境的构造方法：1、快照，执行前保存环境信息，执行后还原环境信息。 2、proxy）
const vm = require('vm')

// 其他模板引擎方法：
// eval：会受执行环境影响
// new Function()：可以获取全局global变量，自己内部也有独立的上下文，本质上类似于vm

global.a = 'a'
// 在node全局上下文global的内部，和每个文件模块的上下文function(module, exports, require, __dirname, __filename){}并列
// 也就是：能访问全局变量（global上的变量）和自己的局部变量，不能访问隔壁模块的变量
vm.runInThisContext('console.log("vm.runInThisContext: ", global.a)')

// 和node全局上下文global并列
// 也就是：无法访问全局变量（global上的变量），可以访问自己的局部变量
vm.runInNewContext('try { console.log("vm.runInNewContext: ", global) } catch(err) { console.log("vm.runInNewContext: ", err) }')

// node的全局上下文global
//     function(module, exports, require, __dirname, __filename){}
//     vm.runInThisContent
// vm.runInNewContent



// ============2.4 ejs模块============



// ======================3.文件模块（源文件内自己写的模块）======================








// ======================4.第三方模块（需要手动安装的模块）======================




