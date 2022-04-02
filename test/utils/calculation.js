// js 加法计算
// 调用：accAdd(arg1,arg2)
// 返回值：arg1加arg2的精确结果
function calculation (type, num1, num2) {
  var temp1, temp2, a
  try {
    // 获取temp1小数点后的长度
    temp1 = num1.toString().split('.')[1].length
  } catch (e) {
    temp1 = 0
  }
  try {
    // 获取temp2小数点后的长度
    temp2 = num2.toString().split('.')[1].length
  } catch (e) {
    temp2 = 0
  }
  // Math.max(temp1, temp2) 为了获取temp1和temp2两个值中较大的一个
  // Math.pow(a,b) 表示 a 的 b 次方
  a = Math.pow(10, Math.max(temp1, temp2))

  // 计算的方式是先将所有的小数乘为整数，待加减运算执行完之后再除去对应的 a 的值，将其变为小数输出
  // 先判断执行的方式是否是加法，不是的话则执行减法运算
  return type === 'add' ? (num1 * a + num2 * a) / a : (num1 * a - num2 * a) / a
}

module.exports = {
  calculation
}
