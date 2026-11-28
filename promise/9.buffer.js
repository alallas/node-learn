// ======================1.进制======================

// ============1.1 其他进制转化为十进制============
// （1）比如：2进制转化为10进制
// 1001 = 1 * 2^3 + 0 * 2^2 + 0 * 2^1 + 1 * 2^0 = 9

// （2）为啥这么写？
// 123在十进制中，可以表示为: 1 * 10^2 + 1 * 10^2 + 1 * 10^2
// 也就是每一个位置都是该进制数的递增/减的量级，因为数字表示方法就是超过某位数之后需要进一位，方便表达

// （3）为啥得到的9就是十进制而不是其他进制？
// 比如：2进制转化为8进制
// 1001 = 1 * 2^3 + 0 * 2^2 + 0 * 2^1 + 1 * 2^0
//      = 10（在八进制中，没有8这个数字，7下一个数字需要进一位，就是10了）+ 0 + 0 + 1
//      = 11（8进制）
// 验证下11（8进制）转化成10进制就是：1 * 8^1 + 1 * 8^0 = 9，也就是等于刚才的9

// 比如：2进制转化为16进制
// 11111 = 1 * 2^4 + 1 * 2^3 + 1 * 2^2 + 1 * 2^1 + 1 * 2^0
//      = 10（在十六进制中，没有16这个数字，f下一个数字需要进一位，就是10了） + 8 + 4 + 2 + 1
//      = 18 + 4 + 2 + 1
//      = 1C + 2 + 1          （18+4为22，22为1c）
//      = 1E + 1              （1c+2为1e）
//      = 1F（16进制）         （1e+1为1f）
// 验证下1F（16进制）转化成10进制就是：1 * 16^1 + 15 * 16^0 = 16 + 15 = 31

// PS：各个进制的数字表示为：
// 二进制:   0, 1, 10, 11, 100, 101, 110, 111, 1000...
// 八进制:   0, 1, ..., 7, 10, 11, ..., 17, 20...
// 十进制:   0, 1, ..., 9, 10, 11, ..., 99, 100...
// 十六进制: 0, 1, ..., f, 10, 11, ..., 1f, 20...


// ============1.2 十进制转化为其他进制============
// （1）整数部分: 除2取余,倒着读
// 比如: 16转化为二进制是: 10000 (从下往上地倒着读)
// 16 ÷ 2 = 8  余 0
//  8 ÷ 2 = 4  余 0
//  4 ÷ 2 = 2  余 0
//  2 ÷ 2 = 1  余 0
//  1 ÷ 2 = 0  余 1

// 原因是:
// 10000也表示为：10000₂ = 1×2⁴ + 0×2³ + 0×2² + 0×2¹ + 0×2⁰
// 也就是说：N = a₄×2⁴ + a₃×2³ + a₂×2² + a₁×2¹ + a₀×2⁰
//      N ÷ 2 = a₄×2³ + a₃×2² + a₂×2¹ + a₁×2⁰ ... 余 a₀（这里(a₀×2⁰)=(0×2)+a₀，因此除以2就是余a₀）
// N继续往下÷2直到【商为0】，此时意味着没有大于等于2¹的位数了，对于二进制数字从头开始读就是从余数(a₀)倒着往前读


// （2）小数部分: 乘2取整,正着读
// 比如：0.625转化为二进制是：0.101
// 0.625 × 2 = 1.25   → 取整数 1，留下 0.25
// 0.25  × 2 = 0.5    → 取整数 0，留下 0.5
// 0.5   × 2 = 1.0    → 取整数 1，留下 0   （结束）

// 原因是：
// 0.101也表示为：0.101₂ = 1×2⁻¹ + 0×2⁻² + 1×2⁻³
// 也就是说：N = a₁×2⁻¹ + a₂×2⁻² + a₃×2⁻³ + ...
// N × 2 = a₁×2⁰ + a₂×2⁻¹ + a₃×2⁻² + ...
//         └──┬─┘  └──────┬──────┘
//          整数部分      小数部分
//          ≥1的部分      <1的部分
// 拿出整数部分之后，N继续往下×2直到【小数部分为 0】，也就是没有小于等于2⁻¹的位数了，此时从整数的a1正着往后读


// 除了分母为(2的幂的分数)，其他小数表示起来都是无尽的：
// 比如0.1转化成二进制是0.0001100110011...₂
// 0.1 × 2 = 0.2   → 0
// 0.2 × 2 = 0.4   → 0
// 0.4 × 2 = 0.8   → 0
// 0.8 × 2 = 1.6   → 1，留下 0.6
// 0.6 × 2 = 1.2   → 1，留下 0.2
// 0.2 × 2 = 0.4   → 0   ← 0.2 又出现了，开始循环！

// 因此出现小数在运算中会不精确的情况：0.1 + 0.2 === 0.3   // false！结果是 0.30000000000000004
// 如何处理？1、转化成整数处理。2、用三方库


// ============1.3 JS方法转换进制============
// parseInt表示【从指定的进制转化为十进制】
const a1 = parseInt('1001', 2)
console.log('从二进制的1001转化为十进制-parseInt:', a1)

// toString表示【从任意一个进制转化为指定的进制】
// 0b表示二进制(binary)，0o表示八进制(octal)，0x表示十六进制(hexadecimal)
const a2 = (0b1001).toString(10)
console.log('从二进制的1001转化为十进制-toString:', a2)
const a3 = (0b1001).toString(8)
console.log('从二进制的1001转化为八进制-toString:', a3)
const a7 = (0b11111).toString(16)
console.log('从二进制的11111转化为十六进制-toString:', a7)

const a4 = (16).toString(2)
console.log('从十进制的16转化为二进制-toString:', a4)
const a5 = (0.625).toString(2)
console.log('从十进制的0.625转化为二进制-toString:', a5)
const a6 = (0.1).toString(2)
console.log('从十进制的0.1转化为二进制-toString:', a6)



// ======================2.字节和编码======================
// ============2.1 字节============
// （1）作用
// 数据都是以二进制方式进行存储和传输的。比特是最小的存储单元（一个二值状态），字节是数据存储容量的基本单位
// 1个字节以8比特组成，也就是八个二进制的位数。

// （2）属性
// 数字上可表示的最大值为11111111，这个数转化为十进制是：1×2⁷ + 1×2⁶ + 1×2⁵ + 1×2⁴ + 1×2³ + 1×2² + 1×2¹ + 1×2⁰ = 255
// 也可以表示为2⁸ − 1
    // 一种解释方法：有一个数学规律为（n个1组成的二进制数 = 2ⁿ − 1）
    // 第二种解释方法：全1的数在数字表示上已经满了，继续加1会往前进一位，变成100000000（就像十进制里 999 + 1 = 1000），
    //                 所以反过来，全 1 就是 (1×2⁸ + (7个0)) − 1 = 2⁸ − 1 = 255。
    // 第三种解释方法：用概率的想法，一个数位有2种表示可能，八个数字就有2⁸种可能，
    //                从00000000开始到11111111，共有256种可能，表示从0到255的数字，因此字节表达的数值上的最大值是256-1


// ============2.2 编码============
// 编码发展史：ASCII -> GB2312/GB18030/GBK -> unicode -> utf8
// ASCII：没有中文，只有数字和英文和一些符号，每个标识都是一个字节
// GB2312/GB18030/GBK：有中文，一个汉字是由2个字节组成的
// unicode：希望采用【可变字节长度】统一所有编码，但没有统一成功
// utf8：utf组织成功统一编码，utf8是基于unicode的，一个汉字是由3个字节组成的【node只支持utf8】

// base64：本质上是64进制，一共有64个符号分别表示，即A-Z、a-z、0-9、+、/（+ 和 / 在URL里有问题，所以有变体Base64URL把它们换成 - 和 _）
// 和二进制之间的关系：6个二进制的比特位表示一个base64符号（因为64 = 2⁶）
// 作用：
    // 1、某些文本类协议（HTML、JSON、URL、SMTP）只接受可打印字符，原始二进制中的某些字符可能破坏协议格式，用base64可以转化为安全的字符。
    // （与文本类协议相对的是二进制通道/协议，比如文件上传、WebSocket binary、TCP，可以使用原始二进制直接传递，不需要转成base64）
    // （与可打印字符相对的是控制字符，比如空字节、换行、退格，这些字符可导致传输截断；另外还有协议保留字符，比如URL里的?&#=、JSON里的"{}、XML里的<>，这些字符可能导致解析错误）
    // 2、减少请求次数，比如css里面有base64编码的图片，解析css的时候不需要额外发出一次请求图片
// 不足：
    // 1、承载具有base64编码的文件无法被缓存，比如内有base64编码的css：如果只有css变了，图片也需要随着整个css被重新请求解析；如果只有图片变了，整个css也需要被重新请求解析
    // 2、编码成base64之后，文本体积会变大1/3（从3字节变成4字节，4/3=33.33%）


// 模拟base64编码：
// （1）准备好一个中文字符的二进制数据（其在utf8里面的编码是0x5170，从而得知此汉字的二进制原始数据）
// （这里借助buffer来快速得到此汉字的二进制原始数据）
const b1 = Buffer.from('兰')
console.log('兰这个字编码后的十六进制为', b1) // 得到<Buffer e5 85 b0>

// 把十六进制的三个字节转化成二进制
const b2 = (0xe5).toString(2)
const b3 = (0x85).toString(2)
const b4 = (0xb0).toString(2)
console.log('兰这个字编码后的二进制为', b2, b3, b4) // 得到11100101 10000101 10110000

// 二进制原始数据和编码之间的转化方式如下：
// 1110 0101  → 1110 开头 = 3 字节字符的开头
// 10 000101  → 10 开头 = 续字节，载荷是后 6 位
// 10 110000  → 10 开头 = 续字节，载荷是后 6 位
// 拼载荷:      0101   000101   110000
//             └4位┘  └──6位─┘ └──6位─┘
//             = 0101 0001 0111 0000 = 0x5170


// （2）按6比特一位的方式重新编排
// 原始为3字节，3*8=24比特：11100101 10000101 10110000
// 重新编排为4字节，4*6=24比特：111001 011000 010110 110000

// 把这重新编排之后的四个字节转化为十进制是：
// （得到的十进制就是base64转化之后的编码）
const b5 = parseInt('111001', 2)
const b6 = parseInt('011000', 2)
const b7 = parseInt('010110', 2)
const b8 = parseInt('110000', 2)
console.log('base64重新编排之后的编码是：', b5, b6, b7, b8) // 得到57 24 22 48

// （3）利用四个编码去base64的表里面找字符，得到就是base64编码后的字符
let base64Table ='ABCDEFGHIJKLMNOPQRSTUVWXYZ'
base64Table += base64Table.toLocaleLowerCase()
base64Table += '0123456789+/'
console.log('base64重新编排之后的字符是：',base64Table[57] + base64Table[24] + base64Table[22] + base64Table[48]); // 得到5YWw
// 这个经过base64编码之后的5YWw字符就可以安全地放到JSON/URL/HTML

// （4）验证下：
const b9 = Buffer.from('兰').toString('base64')
console.log('验证下手动转化base64的准确性：', b9)




// ======================3.buffer======================
// buffer是node用来【标识】内存的工具。本质上是“视图view”，是观察内存的窗口，本身不存储数据
// buffer决定对内存“怎么看”（Uint8逐字节看/Uint32每4字节拼一个数/DataView 更灵活）和“看哪里”（窗口放在数据的第n~n+5字节那段看内存）
// buffer把数据转化成16进制来表示（可以用短数字表示大数）

// ============3.1 创建buffer============
// (1)分配一段固定长度的内存
const c1 = Buffer.alloc(5)
console.log('分配一段固定长度的内存：', c1) // <Buffer 00 00 00 00 00>

// (2)将一个值（数组或字符串或arrayBuffer或buffer）转化为buffer格式

// 数组：node会把数组的每一个元素当成一个字节，即【0~255 的数字】
// 如果传入的数组内部不是数字，就会转成数字。比如Number({a: 1})为NaN，被规定转成00
// 如果输入的数字超过255会取余数
const c2 = Buffer.from([1, 2, 3])
const c3 = Buffer.from([0b111, 0x1f, 0o11])
const c4 = Buffer.from([255, 256, 257])
const c5 = Buffer.from([2, {a: 1}, '你好', '我是小黑', 19])
console.log('将一个数组转化为buffer格式：', c2, c3, c4, c5) // <Buffer 01 02 03> <Buffer 07 1f 09> <Buffer ff 00 01> <Buffer 02 00 00 00 13>

// Q：如果一个数组是复杂的数据结构，包含对象，字符串等，如何转化成buffer呢？或者说如何转化成字节呢？
// A：序列化。对象是无法直接变成字节的，必须先约定一种编码格式（JSON、protobuf……）把对象翻译成文本或二进制结构
// （JSON 的结构字符（{ } [ ] : , "）都是 ASCII 字符，在 UTF-8 编码下每个占 1 字节）
const c7 = Buffer.from(JSON.stringify([2, {a: 1}, '你好', '我是小黑', 19]))
console.log('把一个复杂数据结构序列化再转buffer：', c7)
// 如果后续要解码，那就是：
const c8 = JSON.parse(c7.toString('utf8'))
console.log('把buffer解析回对象', c8)


// 字符串：按utf8编码成字节
const c6 = Buffer.from('小黑师叔好') // 五个字符串，共5*3=15个字节
console.log('将一个字符串转化为buffer格式：', c6) // <Buffer e5 b0 8f e9 bb 91 e5 b8 88 e5 8f 94 e5 a5 bd>

// arrayBuffer：创建buffer窗口共享arrayBuffer的内存，arrayBuffer就是一块原始的内存，是真正存储数据的地方
// 如果创建多个窗口，通过窗口改数据，另一个窗口立刻能看到新数据
const arrayBuffer1 = new ArrayBuffer(5)
const c10 = Buffer.from(arrayBuffer1)
const c11 = Buffer.from(arrayBuffer1)
c10[0] = 255
console.log('为arrayBuffer创建两个buffer窗口：', c10, c11)

// buffer：复制另一个窗口和数据相同的另一片内存区域，是分配一个新的内存区域而不是改写原本内存区的值
// 在node内部有8kb的内存池，
// 对于小于4kb的数据，不会新建一个arrayBuffer，而是在arrayBuffer里面截取出另一段，作为窗口看见的地方
// 对于大于4kb的数据，新建一个arrayBuffer

// 具体解释如下：
// 小 Buffer（< 4KB）：
//   b1.buffer === b2.buffer     → true   ← 底层 ArrayBuffer 对象居然是同一个！
//   b1.byteOffset = 8, b2.byteOffset = 16 ← 但住在不同的"房间"

// 大 Buffer（≥ 4KB）：
//   big1.buffer === big2.buffer → false   ← 各自独立拥有一块 ArrayBuffer

const c12 = Buffer.from([4, 5, 6])
const c13 = Buffer.from(c12)
c12[0] = 255
console.log('复制一个小buffer：', c10, c11)



// ============3.2 操控buffer============
// （1）截取内存数据，新建一个窗口，【指向同一个内存数据】，没有新开辟内存块
const d1 = Buffer.from([1, 2, 3, 4, 5])
const d2 = d1.slice(0, 2)
d1[0] = 255
console.log('buffer的slice方法，看前后两个buffer', d1, d2)

// 对比数组的slice，是新建一个新的数组引用出来（浅拷贝）
// 改原来的数组的基础值不会影响新数组的基础值，改数组内部对象元素内的值则会影响新数组
const d3 = [1, {a: 1}, 3, 4, 5]
const d4 = d3.slice(0, 2)
d3[0] = 255
d3[1].a = 2
console.log('数组的slice方法，看前后两个数组', d3, d4)


// （2）拷贝内存数据（一般比较少用copy，一般用concat）
// 把前面的buffer的数据拷贝到后面的buffer处，她不会新建buffer，也不分配内存，只是在两个buffer之间搬运数据而已

// 第二个参数是targetStart被拷贝目标的开始索引
// 第三个参数是sourceStart数据源的开始索引
// 第四个参数是sourceEnd数据源的结束索引

// d5/d6/d7 底层是同一个池子
const d5 = Buffer.from('小')
const d6 = Buffer.from('黑')
const d7 = Buffer.from('鹿野')
// alloc分配的是另一个池子
const toCopyBuffer = Buffer.alloc(12)

d7.copy(toCopyBuffer, 6, 0, 6)
d5.copy(toCopyBuffer, 0, 0, 3)
d6.copy(toCopyBuffer, 3, 0, 3)

d7[0] = 255
console.log('copy方法生成的新buffer：', toCopyBuffer, toCopyBuffer.toString())
console.log('copy方法使用的数据源旧buffer：', d5, d6, d7)


// 原理上：
Buffer.prototype.copy = function(targetBuffer, targetStart = 0, sourceStart = 0, sourceEnd = this.length) {
    let targetIndex = targetStart
    for (let i = sourceStart; i < sourceEnd; i++) {
        targetBuffer[targetIndex++] = this[i]
    }
}


// （3）拼接内存数据（基于copy实现）
// 外部看是：把各个buffer的数据拼接起来，生成一个新的整合后的buffer
// 内部是：算好总长度 → 申请一块新内存 → 把各段逐个copy进去
// （注意concat内部申请的新内存是用8k共享池的，类似于from('xx')的方式）

// 入参是一个数组，且数组内每一个元素都是Buffer或Uint8Array的实例，不能写成.concat(b1, b2, b3)或.concat([b1, b2, b3, 100, 255])

const d8 = Buffer.from('小')
const d9 = Buffer.from('黑')
const d10 = Buffer.from('鹿野')
const concatedBuffer = Buffer.concat([d8, d9, d10])

d8[0] = 255
console.log('concat方法生成的新的buffer：', concatedBuffer)
console.log('concat方法使用的各部分旧buffer：', d8, d9, d10)


// 原理上：
Buffer.prototype.concat = function(bufferList, bufferListLength = bufferList.reduce((sum, buf) => sum + buf.length , 0)) {
    const newBuffer = Buffer.alloc(bufferListLength)
    let targetIndex = 0
    for (let i = 0; i < bufferList.length; i++) {
        const curBuffer = bufferList[i]
        curBuffer.copy(newBuffer, targetIndex)
        targetIndex += curBuffer.length
    }
    return newBuffer
}



// ============3.3 查看buffer============
// （1）把buffer转化成字符串
// 默认是utf8的编码方式，可以传入：
    // 字符解码：utf16le、latin1、ascii（需要查编码表）
    // 字节转写：hex、base64、base64url（字节层面的规则转化）
const e1 = Buffer.from('你好，我是小黑').toString()
console.log('buffer的toString方法-默认编码：', e1)

const e2 = Buffer.from('小黑师叔好').toString('base64')
console.log('buffer的toString方法-base64编码：', e2)


// （2）判断一个值是否buffer
const e3 = Buffer.isBuffer(123)
const e4 = Buffer.isBuffer(Buffer.from([1]))
console.log('buffer的isBuffer方法：', e3, e4)


// （3）获取一个buffer的长度
// length和byteLength的区别是：
// length是【视图里的元素个数】
// byteLength是【视图覆盖的字节数】

// Q：元素个数和覆盖的字节数为啥存在不相同的情况
// A：在Uint32Array这种窗口（视图）里面，1 元素 = 4 字节
// Buffer / Uint8Array:   1 元素 = 1 字节  → length === byteLength（你实验里都是6）
// Uint32Array:          1 元素 = 4 字节  → length × 4 = byteLength（4 和 16）

// Q：还有其他长度的属性吗？
// A：有，bufInstance.buffer.byteLength
// 其中bufInstance.buffer是获得buffer背后的数据池/楼，而.byteLength是获取整个数据池/楼的大小，一般是8kb


const e5 = Buffer.from([1, 2, [1, 2]]).length
const e6 = Buffer.from([1, 2, [1, 2]]).byteLength
const e7 = Buffer.from('我是鹿野，你呢？').length // 八个中文，24个字节
const e8 = Buffer.from('😀').byteLength // 一个emoji是四个字节
console.log('buffer的获取长度的属性：', e5, e6, e7, e8)



