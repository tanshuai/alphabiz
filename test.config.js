const path = require('path')

const AlphabizAppPath = path.resolve(__dirname, 'Alphabiz-win32-x64/Alphabiz.exe')
const AlphabizAppEXEPath = (process.env.HOME + '/AppData/Local/Alphabiz/Alphabiz.exe').replace(/\\/g, '/')
const AlphabizAppMSIPath = 'C:/Program Files/Alphabiz/Alphabiz.exe'
const electronMainPath = 'build/electron/UnPackaged/electron-main.js'

const appDirectoryRootPath = 'build'
module.exports = {
  electronMainPath,
  AlphabizAppPath,
  AlphabizAppMSIPath,
  AlphabizAppEXEPath,
  appDirectoryRootPath
}