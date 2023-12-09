const path = require('path')

const appConfig = require('./developer/app')
const productName = appConfig.displayName

const AlphabizAppPath = path.resolve(__dirname, `dist/electron/${productName}-win32-x64/${productName}.exe`)
const AlphabizAppEXEPath = (process.env.HOME + `/AppData/Local/${productName}/${productName}.exe`).replace(/\\/g, '/')
const AlphabizAppMSIPath = `C:/Program Files/${productName}/${productName}.exe`
const electronMainPath = 'build/electron/UnPackaged/electron-main.js'

const appDirectoryRootPath = 'build'
module.exports = {
  electronMainPath,
  AlphabizAppPath,
  AlphabizAppMSIPath,
  AlphabizAppEXEPath,
  appDirectoryRootPath
}