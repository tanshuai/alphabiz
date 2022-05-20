const path = require('path')

const AlphabizAppPath = path.resolve(__dirname, 'build/electron/Alphabiz-win32-x64/Alphabiz.exe')

const electronMainPath = 'build/electron/UnPackaged/electron-main.js'

module.exports = { electronMainPath, AlphabizAppPath }