const fs = require('fs')
const { path } = require('path')
const { parse } = require('csv-parse')

/**
 * @function parseCSV
 * @description 解析.csv文件
 * @param { string } inputPath csv文件路径
 * @return { array }  返回promise二维数组
 */
const parseCSV = (inputPath) => {
  return new Promise((resolve, reject) => {
    const data = []
    fs.createReadStream(inputPath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', (r) => {
      // console.log(r)
        data.push(r)
      })
      .on('end', () => {
        // console.log('end:' + data)
        resolve(data)
      })
  })
}

/**
 * @function get2DArray
 * @description 获取二维数组中每个元素的第num个值
 * @param { array } array 二维数组
 * @param { int } num 第num个值，从0开始
 * @return { array }
 */
const get2DArray = (array, num) => {
  const newArray = []
  array.forEach(function (item, index) {
    // 排除第一个数组，都是数据类型
    if (index !== 0) {
      // console.log('item[num]:' + item[num])
      newArray.push(item[num])
    }
  })
  return newArray
}

module.exports = {
  parseCSV,
  get2DArray
}
