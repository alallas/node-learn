// global全局属性
// 内置模块、文件模块、第三方模块
// 模块规范

// ======================1.global全局属性（能通过global直接访问的属性）======================
// ============1.1 process属性============

// 获取当前操作系统的类型
const c1 = process.platform
console.log('process的platform：', c1) // win32

// 获取当前调用node文件的根目录，是动态会变的
const c2 = process.cwd()
console.log('process的cwd：', c2) // d:\Repos\node-learn

// 获取环境变量
// 在执行代码的时候定义变量的值，命令为：
// cmd：set NODE_ENV=production && node promise/7.node模块.js
// powershell：$env:NODE_ENV="production"; node promise/7.node模块.js
// bash：NODE_ENV=production node promise/7.node模块.js
const c3 = process.env.NODE_ENV
console.log('process的env：', c3) // production

// 获取代码执行的时候传入的参数
// 命令为node promise/7.node模块.js --port 3000 --env dev
const c4 = process.argv
console.log('process的argv：', c4)
/*
得到的值如下：
[
    'D:\\nvm4w\\nodejs\\node.exe',                         // 这里固定是：Node可执行文件的路径
    'D:\\Repos\\node-learn\\promise\\7.node模块.js',       // 这里固定是：被执行脚本的路径
    '--port',                                              // 这里开始是自己传入的参数 
    '3000',
    '--env',
    'dev'
]
*/
// 一般这么使用：
const c5 = process.argv.slice(2); // ['--port', '3000', '--env', 'dev']
console.log('process的argv进行去除固定值之后：', c5)
// 整合到对象里面：
const processArgvs = process.argv.reduce((previousValue, currentValue, currentIndex, array) => {
    if (currentIndex <= 1) return previousValue
    if (currentValue.startsWith('--')) {
        previousValue[currentValue.slice(2)] = array[currentIndex + 1]
    }
    return previousValue
}, {})
console.log('process的argv整合到对象里面：', processArgvs)

// 微任务
// 不属于node中的EventLoop，优先级比promise更高
process.nextTick(() => {
    console.log('process的nextTick，属于微任务，优先级比promise更高')
})



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






// ============2.5 events模块============



// ======================3.文件模块（源文件内自己写的模块）======================



// ======================4.第三方模块（需要手动安装的模块）======================
// ============4.1 ejs模块============
const ejs = require('ejs');

// ejs用于给html动态注入参数（目标html用<%  %>来包裹代码）
(async function () {
    const str = await ejs.renderFile('./promise/example/template.html', { arr: [1, 2, 3], title: 'ejs的html' })
    console.log('ejs生成的模板：', str)
})()

// ejs的原理如下，核心是用new Function 和 with 实现
// （1）我们先来看with部分，看下面的函数，核心是“字符串拼接”
// （with的作用是：把对象 obj 临时挂到作用域链最前面，让代码块里的变量名可以直接读写对象的属性，不用写obj.前缀。）
function generateHtmlString(obj) {
    let str = ''
    with (obj) {
        // 一种写法：模板字符串
        str = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <title>${title}</title>
                </head>
                <body>
                    ${arr.map(item => `<li>${item}</li>`).join('\n')}
                </body>
                </html>`

        // 另一种写法：拼接字符串
        // str += `<!DOCTYPE html>
        //         <html lang="en">
        //         <head>
        //         <title>`
        // str += title
        // str += `</title>
        //         </head>
        //         <body>`
        // arr.forEach((item) => {
        //     str += `<li>${item}</li>`
        // })
        // str += `</body>
        //         </html>`
    }
    return str
}
console.log(generateHtmlString({ arr: [1, 2, 3], title: '手写with的html' }))

// （2）真正的核心源码，字符串拼接加上new Functio
// 为啥在ejs里面必须要用with？
// 因为ejs是靠正则识别变量，但是无法确定变量的形式（比如是单个变量还是<%=a+b%>这种复合变量的形式），需要借助with来不写前缀就拿到变量。
// 如果确定是当个变量，可以在拼接字符串的时候加上obj.，比如str.replace(/<%=/s*(.+?)%>/g, (match, expr) => '${obj.' + expr + '}')
const util = require('util')
const readFileAsync = util.promisify(fs.readFile)
const ejs_self = {
    renderFile: async function(filename, obj) {
        // 读取文件
        let content = await readFileAsync(filename, 'utf8')
        // 先把=开头的变量替换掉
        content = content.replace(/<%=\s*(.+?)%>/g, (match, expr) => '${' + expr + '}')
        // 然后把代码替换掉
        content = content.replace(/<%\s*(.+?)%>/g, (match, expr) => '`' + expr + 'str += `')
        // 构造头部
        const head = 'let str = ``; with (obj) { str += `'
        // 构造尾部
        const tail = '`} return str'

        // 核心：用new FUnction来构造模板函数
        const fn = new Function('obj', head + content + tail)
        return fn(obj)
    }
}
// 验证下
(async function () {
    const str = await ejs_self.renderFile('./promise/example/template.html', { arr: [1, 2, 3], title: 'ejs的html' })
    console.log('手写的ejs生成的模板：', str)
})()


// ======================5.模块规范（模块之间如何相互引用）======================









