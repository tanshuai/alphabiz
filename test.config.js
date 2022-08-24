const path = require('path')

const AlphabizAppPath = path.resolve(__dirname, 'Alphabiz-win32-x64/Alphabiz.exe')
const AlphabizAppMSIPath = 'C:/Program Files/Alphabiz/Alphabiz.exe'
const electronMainPath = 'build/electron/UnPackaged/electron-main.js'

module.exports = { electronMainPath, AlphabizAppPath, AlphabizAppMSIPath }