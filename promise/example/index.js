// 这样写导出之后还是只有acd属性，因为把module.exports覆盖了
// exports.b = '222'
// module.exports = {
//     a: '111',
//     c: __dirname,
//     d: __filename
// }

// 可以这么写：
exports.b = '222'
module.exports.dirname = __dirname
module.exports.filename = __filename
module.exports.thisValue = JSON.stringify(this)
module.exports.checkIsThisEqualExports = this === exports
module.exports.checkIsThisEqualModuleExports = this === module.exports
this.a = '111'




