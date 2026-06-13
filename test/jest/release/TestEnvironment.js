// const path = require('path')
let AlphabizAppPath
if (process.env.APP_TYPE === 'msi') {
  AlphabizAppPath = require('../../../test.config.js').AlphabizAppMSIPath
  console.log('APP_TYPE = msi,AlphabizAppPath: ' + AlphabizAppPath)
} else if (process.env.APP_TYPE === 'exe') {
  AlphabizAppPath = require('../../../test.config.js').AlphabizAppEXEPath
  console.log('APP_TYPE = 7z,AlphabizAppPath: ' + AlphabizAppPath)
} else {
  AlphabizAppPath = require('../../../test.config.js').AlphabizAppPath
  console.log('APP_TYPE = 7z,AlphabizAppPath: ' + AlphabizAppPath)
}
// const AlphabizAppPath = path.resolve(__dirname, '../../../dist/electron/Alphabiz-win32-x64/Alphabiz.exe')
export const opts = {
  path: '/wd/hub',
  port: 4723,
  capabilities: {
    browserName: '',
    platformName: 'Windows',
    "ms:waitForAppLaunch": 50,
    "appium:deviceName": 'WindowsPC',
    "appium:createSessionTimeout": 60000,
    "appium:app": AlphabizAppPath
  },
  logLevel: 'error'
}
