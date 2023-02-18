const path = require('path')

const appConfig = require('./developer/app')
const productName = appConfig.displayName

const AlphabizAppPath = path.resolve(__dirname, `${productName}-win32-x64/${productName}.exe`)
const AlphabizAppEXEPath = (process.env.HOME + `/AppData/Local/${productName}/${productName}.exe`).replace(/\\/g, '/')
const AlphabizAppMSIPath = `C:/Program Files/${productName}/${productName}.exe`
const electronMainPath = 'dist/electron/UnPackaged/electron-main.js'


module.exports = {
  electronMainPath,
  AlphabizAppPath,
  AlphabizAppMSIPath,
  AlphabizAppEXEPath
}